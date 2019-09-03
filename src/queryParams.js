const config = require("../config")

const queryParams = {
  resource: {
    reportRequests: [
      {
        viewId: config.auth.viewID,
        dateRanges: [{ startDate: "2018-09-01", endDate: "2019-08-31" }],
        metrics: [{ expression: "ga:pageviews" }, { expression: "ga:exits" }],
        dimensions: [{ name: "ga:previousPagePath" }, { name: "ga:pagePath" }],
        orderBys: [
          { fieldName: "ga:previousPagePath", sortOrder: "ASCENDING" },
          { fieldName: "ga:pageviews", sortOrder: "DESCENDING" },
        ],
        pageSize: 100000,
      },
    ],
  },
}

module.exports = queryParams
