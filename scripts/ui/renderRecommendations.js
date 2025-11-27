export function renderRecommendations(list, container, addHandler) {
  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title || item.name} poster">
      <div class="card-content">
        <h3>${item.title || item.name} (${item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'})</h3>
        <p>Rating: N/A</p>
        <button class="add-watchlist">Add to Watchlist</button>
      </div>
    `;
    card.querySelector('.add-watchlist').addEventListener('click', () => addHandler(item));
    container.appendChild(card);
  });
}
