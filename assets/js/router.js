let app = document.getElementById("app");
let links = document.querySelectorAll(".header_button");

let routes = {
  "things-to-do": "pages/things-to-do.html",
  "travel-guide": "pages/travel-guide.html",
  tours: "pages/tour.html",
};

let cache = new Map();

function getCurrentPage() {
  let hash = (location.hash || "").replace("#", "").trim();
  return routes[hash] ? hash : "things-to-do";
}

function setActive(page) {
  links.forEach((link) =>
    link.classList.toggle("active", link.dataset.page === page)
  );
}

function showLoading() {
  app.innerHTML = `<div style="padding:16px;color:#84878b">Loading...</div>`;
}

async function fetchPage(url) {
  if (cache.has(url)) return cache.get(url);
  let res = await fetch(`${url}?v=${Date.now()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let html = await res.text();
  cache.set(url, html);
  return html;
}

async function loadPage(page) {
  setActive(page);
  showLoading();
  try {
    let html = await fetchPage(routes[page]);
    app.innerHTML = html;
  } catch (err) {
    console.error("Error loading page:", err);
    app.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:80vh;color:#84878b">
    <h1>404</h1>  
    <p>Không tìm thấy trang <b>${page}</b>.</p>
    </div>`;
    setActive(null);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", () => loadPage(getCurrentPage()));
window.addEventListener("DOMContentLoaded", () => {
  let initial = getCurrentPage();
  loadPage(initial);

  Object.entries(routes).forEach(([p, url]) => {
    if (p !== initial) fetchPage(url).catch(() => {});
  });
});
