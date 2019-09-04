const config = require("../config")
const fs = require("fs")

// Generates & saves predictions based off Google Analytics response
const saveReports = async reports => {
  let [report] = reports
  let { rows } = report.data
  const data = {}

  for (let row of rows) {
    let [previousPagePath, pagePath] = row.dimensions
    let pageviews = +row.metrics[0].values[0]
    let exits = +row.metrics[0].values[1]

    if (/\?.*$/.test(pagePath) || /\?.*$/.test(previousPagePath)) {
      pagePath = pagePath.replace(/\?.*$/, "")
      previousPagePath = previousPagePath.replace(/\?.*$/, "")
    }

    // Ignore pageviews where the current and previous pages are the same.
    if (previousPagePath == pagePath) continue

    if (previousPagePath != "(entrance)") {
      data[previousPagePath] = data[previousPagePath] || {
        pagePath: previousPagePath,
        pageviews: 0,
        exits: 0,
        nextPageviews: 0,
        nextExits: 0,
        nextPages: {},
      }

      data[previousPagePath].nextPageviews += pageviews
      data[previousPagePath].nextExits += exits

      if (data[previousPagePath].nextPages[pagePath]) {
        data[previousPagePath].nextPages[pagePath] += pageviews
      } else {
        data[previousPagePath].nextPages[pagePath] = pageviews
      }
    }

    data[pagePath] = data[pagePath] || {
      pagePath: pagePath,
      pageviews: 0,
      exits: 0,
      nextPageviews: 0,
      nextExits: 0,
      nextPages: {},
    }

    data[pagePath].pageviews += pageviews
    data[pagePath].exits += exits
  }

  // Converts each pages `nextPages` object into a sorted array.
  Object.keys(data).forEach(pagePath => {
    const page = data[pagePath]
    page.nextPages = Object.keys(page.nextPages)
      .map(pagePath => ({
        pagePath,
        pageviews: page.nextPages[pagePath],
      }))
      .sort((a, b) => b.pageviews - a.pageviews)
  })

  // Creates a sorted array of pages from the data object.
  const pages = Object.keys(data)
    .filter(pagePath => data[pagePath].nextPageviews > 0)
    .map(pagePath => {
      const page = data[pagePath]
      const { exits, nextPageviews, nextPages } = page
      page.percentExits = exits / (exits + nextPageviews)
      page.topNextPageProbability =
        nextPages[0].pageviews / (exits + nextPageviews)
      return page
    })
    .sort((a, b) => {
      return b.topNextPageProbability - a.topNextPageProbability
      // return b.pageviews - a.pageviews
    })
  await savePagesToJson(pages)
  await jsonToCsv()
}

const savePagesToJson = pages => {
  let json = {
    data: [],
  }
  for (let page of pages) {
    const prediction = {
      pagePath: page.pagePath,
      nextPagePath: page.nextPages[0] ? page.nextPages[0].pagePath : "",
      nextPageCertainty: page.nextPages[0] ? page.topNextPageProbability : "",
    }
    json.data.push(prediction)
  }

  fs.writeFileSync("./predictions.json", JSON.stringify(json, null, 2), err => {
    if (err) throw err
  })
  console.log("created predictions.json")
}

const jsonToCsv = () => {
  const json = fs.readFileSync("./predictions.json")
  const parsedJson = JSON.parse(json)
  const keys = Object.keys(parsedJson.data[0])
  const csvContent =
    keys.join(",") +
    "\n" +
    parsedJson.data
      .map(row => {
        return keys.map(k => row[k]).join(",")
      })
      .join("\n")

  fs.writeFileSync("./predictions.csv", csvContent, err => {
    if (err) throw err
  })
  console.log("created predictions.csv")
}

module.exports = { saveReports: saveReports }
