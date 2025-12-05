import { getOMDbData } from "../api/omdb.js";
import { updateProgress } from "../watchlistManager.js";

export async function renderCards(items, container, addHandler) {
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  for (const item of items) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = item.title || item.name || "Untitled";
    const year = item.release_date ? item.release_date.split("-")[0] 
      : item.first_air_date ? item.first_air_date.split("-")[0] : "N/A";
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` 
      : "https://via.placeholder.com/300x450?text=No+Image";
    const type = item.media_type || (item.first_air_date ? "series" : "movie");

    // OMDb rating
    let imdbRating = "N/A";
    try {
      const omdbData = await getOMDbData(title);
      if (omdbData && omdbData.imdbRating) imdbRating = omdbData.imdbRating;
    } catch {}

    // Progress for series
    let seasonEpisode = "";
    if (type === "series") {
      const storedData = JSON.parse(localStorage.getItem("watchlist")) || [];
      const found = storedData.find(i => i.id === item.id);
      if (found) seasonEpisode = `S${found.currentSeason} • E${found.currentEpisode}`;
    }

    card.innerHTML = `
      <img src="${poster}" alt="${title}" class="card-poster" />
      <div class="card-info">
        <h3>${title}</h3>
        <p>Year: ${year}</p>
        <p>IMDb: ${imdbRating}</p>
        ${type === "series" && item.number_of_seasons ? `<p>Total Seasons: ${item.number_of_seasons}</p>` : ""}
        ${seasonEpisode ? `<p>Progress: ${seasonEpisode}</p>` : ""}
      </div>
      <button class="add-watchlist">Add to Watchlist</button>
    `;

    const addBtn = card.querySelector(".add-watchlist");
    addBtn.addEventListener("click", () => addHandler(item));

    // Season/Episode controls
    if (type === "series") {
      const progressDiv = document.createElement("div");
      progressDiv.classList.add("card-progress");
      progressDiv.innerHTML = `
        <button class="dec-season">-S</button>
        <button class="dec-episode">-E</button>
        <span>Season: ${seasonEpisode ? seasonEpisode.split(" • ")[0].slice(1) : 1}</span>
        <span>Episode: ${seasonEpisode ? seasonEpisode.split(" • ")[1].slice(1) : 1}</span>
        <button class="inc-season">+S</button>
        <button class="inc-episode">+E</button>
      `;
      card.querySelector(".card-info").appendChild(progressDiv);

      progressDiv.querySelector(".inc-season").addEventListener("click", () => {
        updateProgress(item.id, (item.currentSeason || 1) + 1, item.currentEpisode || 1);
        renderCards(items, container, addHandler);
      });
      progressDiv.querySelector(".inc-episode").addEventListener("click", () => {
        updateProgress(item.id, item.currentSeason || 1, (item.currentEpisode || 1) + 1);
        renderCards(items, container, addHandler);
      });
    }

    container.appendChild(card);
  }
}
