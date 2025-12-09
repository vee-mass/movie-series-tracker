import { getOMDbData } from "../api/omdb.js";
import { isInWatchlist } from "../watchlistManager.js";

/**
 * Render movie/series cards into a container
 */
export async function renderCards(items, container, addHandler, cardClickHandler) {
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No items found.</p>';
    return;
  }

  for (const item of items) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = item.id;
    card.dataset.type = item.media_type;

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

    // Watchlist button text
    const inWatchlist = isInWatchlist(item);
    const buttonText = inWatchlist ? "Remove from Watchlist" : "Add to Watchlist";

    card.innerHTML = `
      <img src="${posterPath}" alt="${title} poster" />
      <div class="card-content">
        <h3>${title} (${year})</h3>
        <p>IMDb: ${imdbRating}</p>
        ${
          item.media_type === 'tv'
            ? `<div class="episode-controls">
                 <span class="label">Season:</span>
                 <button class="season-minus">-</button>
                 <span class="value season">${item.currentSeason || 1}</span>
                 <button class="season-plus">+</button>
               </div>
               <div class="episode-controls">
                 <span class="label">Episode:</span>
                 <button class="episode-minus">-</button>
                 <span class="value episode">${item.currentEpisode || 1}</span>
                 <button class="episode-plus">+</button>
               </div>`
            : ''
        }
        <button class="add-watchlist">${buttonText}</button>
      </div>
    `;

    // Add/remove from watchlist
    card.querySelector('.add-watchlist').addEventListener('click', () => addHandler(item));

    // Episode/season buttons
    if (item.media_type === 'tv') {
      const seasonSpan = card.querySelector('.season');
      const episodeSpan = card.querySelector('.episode');

      card.querySelector('.season-plus').addEventListener('click', () => {
        item.currentSeason = (item.currentSeason || 1) + 1;
        seasonSpan.textContent = item.currentSeason;
        addHandler(item);
      });
      card.querySelector('.season-minus').addEventListener('click', () => {
        if ((item.currentSeason || 1) > 1) item.currentSeason--;
        seasonSpan.textContent = item.currentSeason;
        addHandler(item);
      });
      card.querySelector('.episode-plus').addEventListener('click', () => {
        item.currentEpisode = (item.currentEpisode || 1) + 1;
        episodeSpan.textContent = item.currentEpisode;
        addHandler(item);
      });
      card.querySelector('.episode-minus').addEventListener('click', () => {
        if ((item.currentEpisode || 1) > 1) item.currentEpisode--;
        episodeSpan.textContent = item.currentEpisode;
        addHandler(item);
      });
    }

    // Optional card click handler
    if (cardClickHandler) {
      card.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        cardClickHandler(item);
      });
    }

    container.appendChild(card);
  }
}
