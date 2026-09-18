/* Tokyo Cruise Log — data layer + shared UI */
const DS = (() => {
  const cache = {};

  async function load(name) {
    if (cache[name]) return cache[name];
    const res = await fetch(`${I18N.base()}data/${name}.json`);
    if (!res.ok) throw new Error(`Failed to load ${name}.json`);
    cache[name] = await res.json();
    return cache[name];
  }

  /** Resolve shared asset paths (img/…) for both / and /en/ pages */
  function asset(path) {
    if (!path) return path;
    if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) return path;
    return I18N.base() + path;
  }

  async function all() {
    const [ships, arrivals, photos, terminals, categories, site, logs] = await Promise.all([
      load("ships"),
      load("arrivals"),
      load("photos"),
      load("terminals"),
      load("categories"),
      load("site"),
      load("logs").catch(() => []),
    ]);
    return { ships, arrivals, photos, terminals, categories, site, logs };
  }

  const ship = (ships, id) => ships.find((s) => s.id === id);
  const photo = (photos, id) => photos.find((p) => p.id === id);
  const terminal = (terminals, id) => terminals.find((t) => t.id === id);
  const category = (cats, id) => cats.find((c) => c.id === id);

  function photosOfShip(photos, shipId) {
    return photos
      .filter((p) => p.shipId === shipId)
      .sort((a, b) => b.dateTaken.localeCompare(a.dateTaken) || (b.timeTaken || "").localeCompare(a.timeTaken || ""));
  }

  function gtLabel(gt) {
    return gt == null ? "—" : gt.toLocaleString("en-US") + " GT";
  }

  function todayISO() {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }

  function sortPhotos(photos, mode = "newest") {
    const list = [...photos];
    if (mode === "popular") return list.sort((a, b) => b.views - a.views || b.likes - a.likes);
    if (mode === "likes") return list.sort((a, b) => b.likes - a.likes);
    if (mode === "az") return list.sort((a, b) => a.title.localeCompare(b.title));
    return list.sort(
      (a, b) => b.dateTaken.localeCompare(a.dateTaken) || (b.timeTaken || "").localeCompare(a.timeTaken || "")
    );
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Ship display name by language */
  function shipName(s) {
    if (!s) return "";
    return I18N.getLang() === "ja" ? s.nameJa || s.name : s.name || s.nameJa;
  }

  function shipNameSecondary(s) {
    if (!s) return "";
    return I18N.getLang() === "ja" ? s.name : s.nameJa;
  }

  function operatorName(s) {
    if (!s) return "";
    return I18N.getLang() === "ja" ? s.operatorJa || s.operator : s.operator || s.operatorJa;
  }

  return {
    load,
    all,
    asset,
    ship,
    photo,
    terminal,
    category,
    photosOfShip,
    gtLabel,
    todayISO,
    sortPhotos,
    qs,
    esc,
    shipName,
    shipNameSecondary,
    operatorName,
  };
})();

const UI = (() => {
  let activeNav = "home";

  function initNav(active) {
    activeNav = active || activeNav;
    bindChrome();
  }

  function bindChrome() {
    document.querySelectorAll(".nav a[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === activeNav);
    });
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.onclick = () => {
        nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
      };
    }
    const form = document.getElementById("header-search");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const q = form.querySelector("input").value.trim();
        location.href = q ? `photos.html?q=${encodeURIComponent(q)}` : "photos.html";
      };
    }
  }

  function photoThumb(p, { ships, showStats = true } = {}) {
    const loc = I18N.getLang() === "ja" ? p.locationJa || p.location : p.location || p.locationJa;
    const s = Array.isArray(ships) ? ships.find((x) => x.id === p.shipId) : null;
    const jaSub =
      I18N.getLang() === "ja" && s && s.nameJa && s.nameJa !== p.title
        ? `<div class="ship-ja">${DS.esc(s.nameJa)}</div>`
        : "";
    return `
      <article class="photo-thumb">
        <a class="thumb-link" href="photo.html?id=${DS.esc(p.id)}">
          <div class="img-wrap">
            <img src="${DS.esc(DS.asset(p.file))}" alt="${DS.esc(p.title)}" loading="lazy" width="400" height="300">
            <div class="badge-row">
              <span class="badge">${I18N.formatDate(p.dateTaken)}</span>
              ${showStats ? `<span class="badge views">${p.views.toLocaleString()}</span>` : ""}
            </div>
          </div>
          <div class="caption">
            <div class="ship-name">${DS.esc(p.title)}</div>
            ${jaSub}
            <div class="meta-line">
              <a class="imo" href="ship.html?id=${DS.esc(p.shipId)}" onclick="event.stopPropagation()">IMO ${DS.esc(p.imo)}</a>
              <span>${DS.esc(loc)}</span>
            </div>
            ${
              showStats
                ? `<div class="stats-line">
                    <span>★ ${p.likes}</span>
                    <span>💬 ${p.comments}</span>
                    <span>${DS.esc(p.photographer)}</span>
                  </div>`
                : ""
            }
          </div>
        </a>
      </article>`;
  }

  function crumb(parts) {
    return `<div class="breadcrumb">${parts
      .map((p, i) =>
        i < parts.length - 1
          ? `<a href="${p.href}">${DS.esc(p.label)}</a><span class="sep">/</span>`
          : `<span>${DS.esc(p.label)}</span>`
      )
      .join("")}</div>`;
  }

  return { initNav, bindChrome, photoThumb, crumb, get activeNav() { return activeNav; } };
})();

/** Page bootstrap: load data, render, re-render on language change */
function pageApp(active, renderFn) {
  const root = document.getElementById("app");
  let data = null;

  async function boot() {
    UI.initNav(active);
    root.innerHTML = `<div class="loading">${I18N.t("loading")}</div>`;
    try {
      data = await DS.all();
      paint();
    } catch (e) {
      root.innerHTML = `<div class="container muted-box">${I18N.t("loadError")}: ${DS.esc(e.message)}</div>`;
    }
  }

  function paint() {
    Layout.render(data);
    UI.initNav(active);
    renderFn(root, data);
  }

  I18N.onChange(() => {
    if (data) paint();
    else boot();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}
