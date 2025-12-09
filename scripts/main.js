import { searchTMDB, getTrending, getRecommendations } from "./api/tmdb.js";
import { getWatchlist, addToWatchlist } from "./watchlistManager.js";
import { renderCards } from "./ui/renderCards.js";
import { renderRecommendations } from "./ui/renderRecommendations.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const trendingContainer = document.getElementById("trending-list");
const watchlistContainer = document.getElementById("watchlist-list");
const recommendationsContainer = document.getElementById("recommendations-list");

/** Add or update item in watchlist and refresh watchlist display */
function handleAddToWatchlist(item) {
  addToWatchlist(item);
  renderWatchlist();
}

/** Render current watchlist */
function renderWatchlist() {
  renderCards(getWatchlist(), watchlistContainer, handleAddToWatchlist);
}

/** Load trending movies/series */
async function loadTrending() {
  try {
    const trending = await getTrending();
    renderCards(trending, trendingContainer, handleAddToWatchlist);
  } catch (err) {
    console.error("Error loading trending:", err);
    trendingContainer.innerHTML = "<p>Failed to load trending items.</p>";
  }
}

/** Load recommendations (currently using trending as sample recommendations) */
async function loadRecommendations() {
  try {
    const recs = await getRecommendations();
    await renderRecommendations(recs, recommendationsContainer, handleAddToWatchlist);
  } catch (err) {
    console.error("Error loading recommendations:", err);
    recommendationsContainer.innerHTML = "<p>Failed to load recommendations.</p>";
  }
}

/** Handle search form */
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const results = await searchTMDB(query);
    renderCards(results, trendingContainer, handleAddToWatchlist);
  } catch (err) {
    console.error("Search failed:", err);
  }

  searchForm.reset();
});

/** Initialize app */
loadTrending();
renderWatchlist();
loadRecommendations();
