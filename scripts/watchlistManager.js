export function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

export function addToWatchlist(item) {
  const watchlist = getWatchlist();
  if (!watchlist.find(i => i.id === item.id)) {
    watchlist.push({ ...item, currentSeason: 1, currentEpisode: 1 });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
}

export function updateProgress(id, season, episode) {
  const watchlist = getWatchlist();
  const index = watchlist.findIndex(i => i.id === id);
  if (index !== -1) {
    watchlist[index].currentSeason = season;
    watchlist[index].currentEpisode = episode;
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
}
