import { searchTMDB, getTrending, getRecommendations } from "./api/tmdb.js";
import { getWatchlist, addToWatchlist, updateProgress } from "./watchlistManager.js";
import { renderCards } from "./ui/renderCards.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const trendingContainer = document.getElementById("trending-list");
const watchlistContainer = document.getElementById("watchlist-list");
const recommendationsContainer = document.getElementById("recommendations-list");

async function loadTrending() {
  const trending = await getTrending();
  renderCards(trending, trendingContainer, addToWatchlist);
}

function renderWatchlist() {
  const watchlist = getWatchlist();
  renderCards(watchlist, watchlistContainer, addToWatchlist);
}

async function loadRecommendations() {
  const recommendations = await getRecommendations();
  renderCards(recommendations, recommendationsContainer, addToWatchlist);
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  const results = await searchTMDB(query);
  renderCards(results, trendingContainer, addToWatchlist);
  searchForm.reset();
});

loadTrending();
loadRecommendations();
renderWatchlist();
