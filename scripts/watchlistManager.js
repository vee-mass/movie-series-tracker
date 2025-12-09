const WATCHLIST_KEY = "movieSeriesWatchlist";
let watchlist = JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];

export function addToWatchlist(item) {
  const index = watchlist.findIndex(
    w => w.id === item.id && w.media_type === item.media_type
  );
  if (index > -1) {
    // If already exists, remove it (toggle)
    watchlist.splice(index, 1);
  } else {
    watchlist.push(item);
  }
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

export function getWatchlist() {
  return watchlist;
}

export function removeFromWatchlist(item) {
  watchlist = watchlist.filter(
    w => !(w.id === item.id && w.media_type === item.media_type)
  );
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

export function isInWatchlist(item) {
  return watchlist.some(w => w.id === item.id && w.media_type === item.media_type);
}
