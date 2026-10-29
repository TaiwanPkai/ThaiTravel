const state = { category: "all", area: "all", query: "" };
let places = [];

const categoryNames = { attraction: "景點", hotel: "住宿", food: "美食" };
const categoryIcons = { attraction: "📍", hotel: "🛏️", food: "🍜" };
const $ = (selector) => document.querySelector(selector);

async function init() {
  try {
    const response = await fetch("data/places.json");
    if (!response.ok) throw new Error("無法讀取推薦資料");
    places = await response.json();
    renderAreaFilters();
    renderCards();
    bindEvents();
  } catch (error) {
    $("#cards").innerHTML = '<p class="load-error">推薦資料載入失敗。請確認網站根目錄中有 data/places.json，並透過 GitHub Pages 或本機伺服器開啟網站。</p>';
  }
}

function bindEvents() {
  $("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    $("#clearSearch").hidden = !state.query;
    renderCards();
  });
  $("#clearSearch").addEventListener("click", () => {
    $("#searchInput").value = "";
    state.query = "";
    $("#clearSearch").hidden = true;
    renderCards();
    $("#searchInput").focus();
  });
  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      state.area = "all";
      document.querySelectorAll("[data-category]").forEach(item => item.classList.toggle("active", item === button));
      renderAreaFilters();
      renderCards();
    });
  });
  $("#resetFilters").addEventListener("click", () => {
    state.category = "all";
    state.area = "all";
    state.query = "";
    $("#searchInput").value = "";
    $("#clearSearch").hidden = true;
    document.querySelectorAll("[data-category]").forEach(item => item.classList.toggle("active", item.dataset.category === "all"));
    renderAreaFilters();
    renderCards();
  });
}

function filteredPlaces() {
  return places.filter(place => {
    const categoryMatch = state.category === "all" || place.category === state.category;
    const areaMatch = state.area === "all" || place.area === state.area;
    const searchable = [place.name, place.english, place.area, place.description, ...(place.tags || [])].join(" ").toLowerCase();
    return categoryMatch && areaMatch && searchable.includes(state.query);
  });
}

function renderAreaFilters() {
  const available = places.filter(place => state.category === "all" || place.category === state.category);
  const areas = [...new Set(available.map(place => place.area))].sort((a,b) => a.localeCompare(b, "zh-Hant"));
  if (state.area !== "all" && !areas.includes(state.area)) state.area = "all";
  const wrapper = $("#areaFilters");
  wrapper.innerHTML = "";
  const allButton = makeAreaButton("全部區域", "all");
  wrapper.appendChild(allButton);
  areas.forEach(area => wrapper.appendChild(makeAreaButton(area, area)));
}
function makeAreaButton(label, value) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "area-chip" + (state.area === value ? " active" : "");
  button.textContent = label;
  button.addEventListener("click", () => {
    state.area = value;
    renderAreaFilters();
    renderCards();
  });
  return button;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}
function renderCards() {
  const list = filteredPlaces();
  $("#countAll").textContent = places.length;
  $("#resultCount").textContent = `${list.length} 個推薦`;
  $("#resultsTitle").textContent = state.category === "all" ? "推薦清單" : categoryNames[state.category] + "推薦";
  $("#emptyState").hidden = list.length !== 0;
  $("#cards").hidden = list.length === 0;
  $("#cards").innerHTML = list.map(place => {
    const mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.mapQuery || `${place.name} ${place.area} Bangkok`);
    const official = place.officialUrl ? `<a class="button button-light" href="${escapeHtml(place.officialUrl)}" target="_blank" rel="noopener noreferrer">官方資訊 ↗</a>` : "";
    return `<article class="place-card">
      <div class="card-art" style="--art:${escapeHtml(place.color || "#e1e9df")}">
        <span class="card-icon" aria-hidden="true">${escapeHtml(place.icon || categoryIcons[place.category])}</span>
        <span class="category-tag">${escapeHtml(categoryNames[place.category])}</span>
      </div>
      <div class="card-body">
        <div class="card-topline"><span class="area-label">📍 ${escapeHtml(place.area)}</span></div>
        <h3>${escapeHtml(place.name)}</h3>
        <p class="place-en">${escapeHtml(place.english || "")}</p>
        <p class="card-desc">${escapeHtml(place.description)}</p>
        <div class="tags">${(place.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="card-actions"><a class="button button-dark" href="${mapUrl}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>${official}</div>
      </div>
    </article>`;
  }).join("");
}

init();
