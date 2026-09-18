pageApp("ships", (root, { ships, photos }) => {
  const t = I18N.t;

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "ships.html", label: t("nav.ships") },
        ])}
        <h1>${t("shipsPageTitle")}</h1>
        <p>${t("shipsPageDesc")}</p>
      </div>
    </div>
    <div class="container">
      <div class="toolbar">
        <input type="search" id="q" placeholder="${t("shipSearch")}">
        <span class="count" id="count"></span>
      </div>
      <div class="photo-grid cols-3" id="grid"></div>
    </div>
  `;

  const grid = document.getElementById("grid");
  const count = document.getElementById("count");

  function paint(q = "") {
    let list = [...ships];
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(qq) ||
          s.nameJa.includes(q) ||
          s.operator.toLowerCase().includes(qq) ||
          s.operatorJa.includes(q) ||
          String(s.imo).includes(q)
      );
    }
    count.textContent = I18N.tf("shipCount", list.length);
    grid.innerHTML = list
      .map((s) => {
        const ps = DS.photosOfShip(photos, s.id);
        const cover = ps[0];
        return `
          <article class="photo-thumb">
            <a class="thumb-link" href="ship.html?id=${DS.esc(s.id)}">
              <div class="img-wrap">
                ${cover ? `<img src="${DS.esc(DS.asset(cover.file))}" alt="${DS.esc(s.name)}" loading="lazy">` : `<div style="height:100%;background:var(--bg-3)"></div>`}
                <div class="badge-row">
                  <span class="badge">IMO ${DS.esc(s.imo)}</span>
                  <span class="badge views">${ps.length} ${t("photos")}</span>
                </div>
              </div>
              <div class="caption">
                <div class="ship-name">${DS.esc(DS.shipName(s))}</div>
                <div class="meta-line"><span>${DS.esc(DS.shipNameSecondary(s))}</span></div>
                <div class="meta-line"><span>${DS.esc(DS.operatorName(s))}</span><span>${DS.gtLabel(s.gt)}</span></div>
              </div>
            </a>
          </article>`;
      })
      .join("");
  }

  document.getElementById("q").addEventListener("input", (e) => paint(e.target.value.trim()));
  paint();
  document.title = `${t("shipsPageTitle")} | ${t("brand")}`;
});
