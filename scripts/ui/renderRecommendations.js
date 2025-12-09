import { getOMDbData } from "../api/omdb.js";
import { isInWatchlist } from "../watchlistManager.js";

export async function renderRecommendations(list, container, addHandler) {
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<p>No recommendations available.</p>';
    return;
  }

  for (const item of list) {
    const card = document.createElement('div');
    card.className = 'card';

    const posterPath = item.poster_path
      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    const title = item.title || item.name || 'Untitled';
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';

    // Fetch IMDb rating with TMDb fallback
    let imdbRating = 'N/A';
    try {
      const omdbYear = year;
      let omdbData = await getOMDbData(item.title || '', omdbYear);
      if (!omdbData && item.name) omdbData = await getOMDbData(item.name, omdbYear);
      if (omdbData && omdbData.imdbRating && omdbData.imdbRating !== "N/A") {
        imdbRating = omdbData.imdbRating;
      } else if (item.vote_average) {
        imdbRating = item.vote_average.toFixed(1);
      }
    } catch (err) {
      console.warn('OMDb fetch failed for', title);
      if (item.vote_average) imdbRating = item.vote_average.toFixed(1);
    }

    // Watchlist toggle
    const inWatchlist = isInWatchlist(item);
    const buttonText = inWatchlist ? "Remove from Watchlist" : "Add to Watchlist";

    card.innerHTML = `
      <img src="${posterPath}" alt="${title} poster">
      <div class="card-content">
        <h3>${title} (${year})</h3>
        <p>IMDb: ${imdbRating}</p>
        <button class="add-watchlist">${buttonText}</button>
      </div>
    `;

    card.querySelector('.add-watchlist').addEventListener('click', () => addHandler(item));

    container.appendChild(card);
  }
}
