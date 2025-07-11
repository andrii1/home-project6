require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data').v1beta;

const credentials = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
    'base64',
  ).toString('utf-8'),
);
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials,
});

const propertyId = '484584778';
// Get the day 31 days ago
const today = new Date().getTime() - 60 * 60 * 24 * 31 * 1000;
// Get the day, month and year
const day = new Date(today).getDate();
const month = new Date(today).getMonth() + 1;
const year = new Date(today).getFullYear();
// Put it in Google's date format
const dayFormat = `${year}-${month}-${day}`;

const getTopQuotesPages = async () => {
  try {
    const [response] = await analyticsDataClient.runReport({
      // eslint-disable-next-line prefer-template
      property: 'properties/' + propertyId,
      dateRanges: [
        {
          // Run from today to 31 days ago
          startDate: dayFormat,
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          // Get the page path
          name: 'pagePathPlusQueryString',
        },
      ],
      metrics: [
        {
          // And tell me how many active users there were for each of those
          name: 'activeUsers',
        },
      ],
    });
    const regex = /\/quotes\/\d+$/;
    const filteredResponse = response.rows
      .filter((item) => regex.test(item.dimensionValues[0].value))
      .map((item) => {
        return {
          quoteId: item.dimensionValues[0].value.split('quotes/')[1],
          url: item.dimensionValues[0].value,
          activeUsers: item.metricValues[0].value,
        };
      });

    return filteredResponse;
  } catch (error) {
    return error.message;
  }
};

const getTopAuthorsPages = async () => {
  try {
    const [response] = await analyticsDataClient.runReport({
      // eslint-disable-next-line prefer-template
      property: 'properties/' + propertyId,
      dateRanges: [
        {
          // Run from today to 31 days ago
          startDate: dayFormat,
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          // Get the page path
          name: 'pagePathPlusQueryString',
        },
      ],
      metrics: [
        {
          // And tell me how many active users there were for each of those
          name: 'activeUsers',
        },
      ],
    });
    const regex = /\/author\/\d+$/;
    const filteredResponse = response.rows
      .filter((item) => regex.test(item.dimensionValues[0].value))
      .map((item) => {
        return {
          authorId: item.dimensionValues[0].value.split('author/')[1],
          url: item.dimensionValues[0].value,
          activeUsers: item.metricValues[0].value,
        };
      });

    return filteredResponse;
  } catch (error) {
    return error.message;
  }
};

const getTopTagsPages = async () => {
  try {
    const [response] = await analyticsDataClient.runReport({
      // eslint-disable-next-line prefer-template
      property: 'properties/' + propertyId,
      dateRanges: [
        {
          // Run from today to 31 days ago
          startDate: dayFormat,
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          // Get the page path
          name: 'pagePathPlusQueryString',
        },
      ],
      metrics: [
        {
          // And tell me how many active users there were for each of those
          name: 'activeUsers',
        },
      ],
    });
    const regex = /\/tags\/\d+$/;
    const filteredResponse = response.rows
      .filter((item) => regex.test(item.dimensionValues[0].value))
      .map((item) => {
        return {
          tagId: item.dimensionValues[0].value.split('tags/')[1],
          url: item.dimensionValues[0].value,
          activeUsers: item.metricValues[0].value,
        };
      });

    return filteredResponse;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getTopQuotesPages,
  getTopAuthorsPages,
  getTopTagsPages,
};
