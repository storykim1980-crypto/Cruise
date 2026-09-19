pageApp("photos", (root, { ships, photos, categories, terminals }) => {
  const t = I18N.t;
  const initQ = DS.qs("q") || "";
  const initCat = DS.qs("category") || "";
  const initSort = DS.qs("sort") || "newest";
  const initTerm = DS.qs("terminal") || "";

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "photos.html", label: t("nav.photos") },
        ])}
        <h1>${t("photosPageTitle")}</h1>
        <p>${t("photosPageDesc")}</p>
      </div>
    </div>
    <div class="container">
      <div class="chip-row" id="cat-chips">
        <button type="button" class="chip ${!initCat ? "active" : ""}" data-cat="">${t("all")}</button>
        ${categories
          .map(
            (c) =>
              `<button type="button" class="chip ${initCat === c.id ? "active" : ""}" data-cat="${DS.esc(c.id)}">${DS.esc(I18N.catName(c))}</button>`
          )
          .join("")}
      </div>
      <div class="toolbar">
        <input type="search" id="q" placeholder="${t("searchPlaceholder")}" value="${DS.esc(initQ)}">
        <select id="sort">
          <option value="newest" ${initSort === "newest" ? "selected" : ""}>${t("newest")}</option>
          <option value="popular" ${initSort === "popular" ? "selected" : ""}>${t("mostPopularSort")}</option>
          <option value="likes" ${initSort === "likes" ? "selected" : ""}>${t("mostLiked")}</option>
          <option value="az" ${initSort === "az" ? "selected" : ""}>${t("azName")}</option>
        </select>
        <select id="terminal">
          <option value="">${t("allTerminals")}</option>
          ${terminals
            .map(
              (term) =>
                `<option value="${term.id}" ${initTerm === term.id ? "selected" : ""}>${DS.esc(I18N.termShort(term))}</option>`
            )
            .join("")}
        </select>
        <span class="count" id="count"></span>
      </div>
      <div class="photo-grid" id="grid"></div>
    </div>
  `;

  const state = { q: initQ, category: initCat, sort: initSort, terminal: initTerm };
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");

  function apply() {
    let list = [...photos];
    if (state.category) list = list.filter((p) => p.category === state.category);
    if (state.terminal) list = list.filter((p) => p.terminal === state.terminal);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((p) => {
        const s = DS.ship(ships, p.shipId);
        return (
          p.title.toLowerCase().includes(q) ||
          String(p.imo).includes(state.q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (p.locationJa || "").includes(state.q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.descriptionJa || "").includes(state.q) ||
          (p.tags || []).some((tg) => tg.toLowerCase().includes(q)) ||
          (s?.nameJa || "").includes(state.q) ||
          (s?.name || "").toLowerCase().includes(q)
        );
      });
    }
    list = DS.sortPhotos(list, state.sort);
    count.textContent = I18N.tf("photoCount", list.length);
    grid.innerHTML = list.length
      ? list.map((p) => UI.photoThumb(p, { ships })).join("")
      : `<div class="muted-box" style="grid-column:1/-1">${t("noPhotosMatch")}</div>`;

    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category) params.set("category", state.category);
    if (state.sort !== "newest") params.set("sort", state.sort);
    if (state.terminal) params.set("terminal", state.terminal);
    const qs = params.toString();
    history.replaceState(null, "", qs ? `photos.html?${qs}` : "photos.html");
  }

  document.getElementById("q").addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    apply();
  });
  document.getElementById("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    apply();
  });
  document.getElementById("terminal").addEventListener("change", (e) => {
    state.terminal = e.target.value;
    apply();
  });
  document.getElementById("cat-chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    document.querySelectorAll("#cat-chips .chip").forEach((c) => c.classList.toggle("active", c === btn));
    apply();
  });

  apply();
  document.title = `${t("photosPageTitle")} | ${t("brand")}`;
});

/* max-upgrade: lightbox on thumbnail click */
(() => {
  const grid = document.getElementById("grid");
  if (!grid) return;
  let box = null;
  function close() { if (box) { box.remove(); box = null; document.body.style.overflow = ""; } }
  function open(p) {
    close();
    const ja = I18N.getLang() === "ja";
    const loc = ja ? p.locationJa || p.location : p.location || p.locationJa;
    box = document.createElement("div");
    box.className = "lb-overlay";
    box.innerHTML = `<button class="lb-close" aria-label="${I18N.t("closeLabel")}">&times;</button>
      <figure>
        <img src="${DS.esc(DS.asset(p.file))}" alt="${DS.esc(p.title)}">
        <figcaption>
          <strong>${DS.esc(p.title)}</strong>
          <span>${DS.esc(loc)} · ${I18N.formatDate(p.dateTaken)}</span>
          <a class="btn btn-primary btn-sm" href="photo.html?id=${DS.esc(p.id)}">${I18N.t("viewPhoto")} →</a>
        </figcaption>
      </figure>`;
    box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.closest(".lb-close")) close(); });
    document.body.appendChild(box);
    document.body.style.overflow = "hidden";
  }
  grid.addEventListener("click", (e) => {
    const wrap = e.target.closest(".thumb-link .img-wrap");
    if (!wrap) return;
    const link = wrap.closest(".photo-thumb")?.querySelector("a.thumb-link");
    if (!link) return;
    e.preventDefault();
    const id = new URLSearchParams((link.getAttribute("href") || "").split("?")[1] || "").get("id");
    DS.load("photos").then((ps) => { const p = ps.find((x) => String(x.id) === String(id)); if (p) open(p); });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
})();
