import { searchTMDB, getTrending, getRecommendations } from "./api/tmdb.js";
import { getWatchlist, addToWatchlist } from "./watchlistManager.js";
import { renderCards } from "./ui/renderCards.js";
import { renderRecommendations } from "./ui/renderRecommendations.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const trendingContainer = document.getElementById("trending-list");
const watchlistContainer = document.getElementById("watchlist-list");
const recommendationsContainer = document.getElementById("recommendations-list");

async function loadTrending() {
  try {
    const trending = await getTrending();
    renderCards(trending, trendingContainer, addToWatchlistHandler);
  } catch (error) {
    console.error("Error fetching trending data:", error);
  }
}

function renderWatchlist() {
  renderCards(getWatchlist(), watchlistContainer, addToWatchlistHandler);
}

async function loadRecommendations() {
  try {
    const recs = await getRecommendations();
    renderRecommendations(recs, recommendationsContainer, addToWatchlistHandler);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
}

function addToWatchlistHandler(item) {
  addToWatchlist(item);
  renderWatchlist();
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const results = await searchTMDB(query);
    renderCards(results, trendingContainer, addToWatchlistHandler);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }

  searchForm.reset();
});

loadTrending();
renderWatchlist();
loadRecommendations();
