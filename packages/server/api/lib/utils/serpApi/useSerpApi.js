/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const { SERP_API_KEY } = process.env;

const excludeList = [
  'insurance',
  'cars',
  'mortgage',
  'loan',
  'renters',
  'vehicle',
  'mutual',
  'cheap',
  'auto',
  'state',
];

async function fetchSerpApi() {
  const params = new URLSearchParams({
    engine: 'google_trends',
    q: 'quotes',
    hl: 'en',
    geo: 'US',
    date: 'now 1-d',
    data_type: 'RELATED_QUERIES',
    api_key: SERP_API_KEY,
  });

  try {
    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();
    const filteredData = data.related_queries.rising
      .map((item) => item.query)
      .filter((item) => {
        const query = item.toLowerCase();
        return !excludeList.some((exclude) => query.includes(exclude));
      });

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error(`Error on fetch:`, error);
  }
}

module.exports = fetchSerpApi;
