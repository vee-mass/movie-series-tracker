const OMDB_API_KEY = "fc351e2e"; 
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export async function getOMDbData(title) {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    if (data.Response === "False") {
      console.warn(`OMDb: No data found for "${title}"`);
      return null;
    }
    return data;
  } catch (err) {
    console.error("OMDb fetch error:", err);
    return null;
  }
}
