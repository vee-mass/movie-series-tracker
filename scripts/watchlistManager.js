// scripts/watchlistManager.js

// Load existing watchlist from localStorage or start with empty array
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

/**
 * Add a movie or series to the watchlist
 * @param {Object} item
 */
export function addToWatchlist(item) {
  // Avoid duplicates
  if (!watchlist.find(w => w.id === item.id)) {
    watchlist.push(item);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
}

/**
 * Get the current watchlist
 * @returns {Array}
 */
export function getWatchlist() {
  return watchlist;
}

/**
 * Remove an item from the watchlist by ID
 * @param {number} id
 */
export function removeFromWatchlist(id) {
  watchlist = watchlist.filter(item => item.id !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}
