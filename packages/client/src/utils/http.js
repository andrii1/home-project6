import { apiURL } from '../apiURL';

export const exampleFunction = async () => {
  const response = await fetch(
    `https://forkify-api.herokuapp.com/api/search?q=1`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch');
  }
  return data;
};

export const fetchQuotes = async () => {
  const response = await fetch(`${apiURL()}/quotes/`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch');
  }
  return data;
};

export const fetchAuthors = async () => {
  const response = await fetch(`${apiURL()}/authors/`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch');
  }
  return data;
};
