require("dotenv").config()

const config = {
  auth: {
    keyFileName: "key.pem",
    viewID: process.env.VIEW_ID,
    serviceAccountEmail: process.env.SERVICE_ACCOUNT_EMAIL,
  },
  db: {
    mongoURL: "mongodb://localhost:27017/guessjs_dev",
  },
}

module.exports = config
