const fs = require("fs")
const json = require("./unparsed-results.json")

json.forEach(item => {
  delete item.__v && delete item._id
})

fs.writeFile(
  "./predictions.json",
  JSON.stringify(json, null, 2),
  "utf-8",
  err => {
    if (err) throw err
  },
)

// remove unparsed json
fs.unlink("./unparsed-results.json", err => {
  if (err) throw err
})
