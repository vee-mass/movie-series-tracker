import { getOMDbData } from "../api/omdb.js";

/**
 * Render movie/series cards into a container
 * @param {Array} items - list of movies/series from TMDb
 * @param {HTMLElement} container - HTML element to render cards into
 * @param {Function} addHandler - function to call when "Add to Watchlist" button is clicked
 * @param {Function} [cardClickHandler] - optional function for clicking a card (e.g., recommendations)
 */
export async function renderCards(items, container, addHandler, cardClickHandler) {
  container.innerHTML = ''; // clear container

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
    const year = item.release_date
      ? item.release_date.split('-')[0]
      : item.first_air_date
      ? item.first_air_date.split('-')[0]
      : 'N/A';

    let imdbRating = 'N/A';
    try {
      const omdbData = await getOMDbData(title);
      if (omdbData && omdbData.imdbRating) imdbRating = omdbData.imdbRating;
    } catch (err) {
      console.warn('OMDb fetch failed for', title);
    }

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
        <button class="add-watchlist">Add to Watchlist</button>
      </div>
    `;

    // Add to watchlist
    card.querySelector('.add-watchlist').addEventListener('click', () => {
      addHandler(item);
    });

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

    // Optional card click handler for recommendations
    if (cardClickHandler) {
      card.addEventListener('click', (e) => {
        // Ignore clicks on buttons inside the card
        if (e.target.tagName.toLowerCase() === 'button') return;
        cardClickHandler(item);
      });
    }

    container.appendChild(card);
  }
}
