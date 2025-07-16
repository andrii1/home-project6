/* eslint-disable no-console */
const { google } = require('googleapis');
require('dotenv').config();

const searchconsole = google.searchconsole('v1');

console.log(
  'GOOGLE_CREDENTIALS_B64 is set:',
  !!process.env.GOOGLE_CREDENTIALS_B64,
);

// Decode base64 and parse JSON
const key = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, 'base64').toString('utf8'),
);

function getLast7DaysRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  const format = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD

  return {
    startDate: format(start),
    endDate: format(end),
  };
}

async function getSearchQueries() {
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const siteUrl = 'https://www.motivately.co/'; // must match exactly how it's registered in GSC

  const { startDate, endDate } = getLast7DaysRange();

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 50, // max 25,000
    },
  });

  const rows = res.data.rows || [];
  const result = rows
    .map((row) => row.keys[0])
    .filter((item) => item.includes('quote'));

  return result;
}

// getSearchQueries().catch(console.error);
module.exports = getSearchQueries;
