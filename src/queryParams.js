const config = require("../config")

const queryParams = {
  resource: {
    reportRequests: [
      {
        viewId: config.auth.viewID,
        dateRanges: [{ startDate: "365daysago", endDate: "yesterday" }],
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
