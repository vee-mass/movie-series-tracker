const TMDB_KEY = "db8170442766c1ead1e80f18f807d067"; 
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchTMDB(query) {
  const url = `${BASE_URL}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

export async function getTrending() {
  const url = `${BASE_URL}/trending/all/week?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results.slice(0, 10);
}

export async function getRecommendations() {
  // Example: using trending as recommendations for simplicity
  const url = `${BASE_URL}/trending/all/week?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results.slice(0, 10);
}
