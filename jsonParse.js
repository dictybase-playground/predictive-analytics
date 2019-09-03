const fs = require("fs")
const json = require("./results.json")

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
