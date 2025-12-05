const TMDB_KEY = "db8170442766c1ead1e80f18f807d067";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDb(url) {
  const res = await fetch(url);
  return await res.json();
}

export async function searchTMDB(query) {
  const url = `${BASE_URL}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
  const data = await fetchTMDb(url);

  return await Promise.all(data.results.map(async (item) => {
    if (item.media_type === "tv") {
      const details = await fetchTMDb(`${BASE_URL}/tv/${item.id}?api_key=${TMDB_KEY}`);
      return { ...item, number_of_seasons: details.number_of_seasons };
    }
    return item;
  }));
}

export async function getTrending() {
  const url = `${BASE_URL}/trending/all/week?api_key=${TMDB_KEY}`;
  const data = await fetchTMDb(url);
  return await Promise.all(data.results.slice(0, 10).map(async (item) => {
    if (item.media_type === "tv") {
      const details = await fetchTMDb(`${BASE_URL}/tv/${item.id}?api_key=${TMDB_KEY}`);
      return { ...item, number_of_seasons: details.number_of_seasons };
    }
    return item;
  }));
}

export async function getRecommendations() {
  return getTrending(); 
}
