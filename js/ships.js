/* Cruise ship directory — registry */
pageApp("ships", (root, { ships, photos }) => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";
  const initQ = DS.qs("q") || "";
  const initOp = DS.qs("operator") || "";

  const operators = [...new Set(ships.map((s) => s.operator))].sort();

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "ships.html", label: t("nav.ships") },
        ])}
        <h1>${t("shipsDirectoryTitle")}</h1>
        <p>${t("shipsDirectoryDesc")}</p>
        <div class="dir-count" id="count"></div>
      </div>
    </div>
    <div class="container">
      <div class="toolbar">
        <input type="search" id="q" placeholder="${t("shipSearch")}" value="${DS.esc(initQ)}">
        <select id="operator">
          <option value="">${t("allOperators")}</option>
          ${operators.map((o) => `<option value="${DS.esc(o)}" ${initOp === o ? "selected" : ""}>${DS.esc(o)}</option>`).join("")}
        </select>
        <select id="sort">
          <option value="name">${t("sortNameAZ")}</option>
          <option value="newest">${t("sortNewest")}</option>
          <option value="oldest">${t("sortOldest")}</option>
          <option value="gt">${t("sortGT")}</option>
          <option value="pax">${t("sortPax")}</option>
        </select>
        <button type="button" class="chip" id="only-photos">${t("onlyWithPhotos")}</button>
      </div>
      <div class="dir-list" id="list"></div>
    </div>
  `;

  const state = { q: initQ, operator: initOp, sort: "name", onlyPhotos: false };
  const list = document.getElementById("list");
  const count = document.getElementById("count");
  const onlyBtn = document.getElementById("only-photos");

  const shipIconSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18l4-2.5 3 1.2 3-2 3 1.2 3-1 4 2.1V20H2v-2zm1-4L7 12l3 1 3-2 3 1 3-1 2 .9V9L12 5 3 9v5z"/></svg>`;

  function apply() {
    let arr = [...ships];
    if (state.operator) arr = arr.filter((s) => s.operator === state.operator);
    if (state.onlyPhotos) arr = arr.filter((s) => photos.some((p) => p.shipId === s.id));
    if (state.q) {
      const q = state.q.toLowerCase();
      arr = arr.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameJa.includes(state.q) ||
          s.operator.toLowerCase().includes(q) ||
          (s.operatorJa || "").includes(state.q) ||
          String(s.imo).includes(state.q)
      );
    }
    const cmp = {
      name: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => b.built - a.built || a.name.localeCompare(b.name),
      oldest: (a, b) => a.built - b.built || a.name.localeCompare(b.name),
      gt: (a, b) => b.gt - a.gt,
      pax: (a, b) => b.passengers - a.passengers,
    }[state.sort];
    arr.sort(cmp);

    count.textContent = I18N.tf("registeredShips", arr.length);

    list.innerHTML = arr.length
      ? arr
          .map((s) => {
            const ps = DS.photosOfShip(photos, s.id);
            const cover = ps[0];
            const q = s.imo || s.name;
            return `
            <article class="dir-card">
              <a class="dir-thumb" href="ship.html?id=${DS.esc(s.id)}">
                ${
                  cover
                    ? `<img src="${DS.esc(DS.asset(cover.file))}" alt="${DS.esc(s.name)}" loading="lazy">`
                    : `<div class="dir-placeholder">${shipIconSVG}<span>${t("noPhoto")}</span></div>`
                }
                ${cover ? `<span class="badge views">${ps.length} ${t("photos")}</span>` : ""}
              </a>
              <div class="dir-body">
                <div class="dir-title-row">
                  <h3><a href="ship.html?id=${DS.esc(s.id)}">${DS.esc(DS.shipName(s))}</a></h3>
                  <span class="dir-name-alt">${DS.esc(DS.shipNameSecondary(s))}</span>
                </div>
                <div class="dir-line">
                  <a href="ships.html?operator=${encodeURIComponent(s.operator)}">${DS.esc(DS.operatorName(s))}</a>
                  ${s.imo ? `<span>· IMO ${DS.esc(s.imo)}</span>` : `<span>· IMO ${ja ? "登録待ち" : "pending"}</span>`}
                  <span>· ${DS.esc(s.flag)}</span>
                </div>
                <div class="dir-specs">
                  <div><span class="k">${t("built")}</span><span class="v">${I18N.tf("builtAge", s.built)}</span></div>
                  <div><span class="k">${t("passengers")}</span><span class="v">${s.passengers.toLocaleString()}</span></div>
                  <div><span class="k">${t("grossTonnage")}</span><span class="v">${s.gt.toLocaleString()} GT</span></div>
                  <div><span class="k">${t("lengthBeam")}</span><span class="v">${s.length} × ${s.beam} m</span></div>
                </div>
                <div class="dir-actions">
                  <a class="btn btn-sm btn-primary" href="ship.html?id=${DS.esc(s.id)}">${t("shipDirectory")}</a>
                  <a class="btn btn-sm btn-ghost" href="photos.html?q=${encodeURIComponent(q)}">${t("photos")} ${ps.length}</a>
                  <a class="btn btn-sm btn-ghost" href="schedule.html?q=${encodeURIComponent(s.name)}">${t("itineraries")}</a>
                  ${
                    s.imo
                      ? `<a class="btn btn-sm btn-ghost" href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(s.imo)}" target="_blank" rel="noopener">${t("trackAIS")} ↗</a>`
                      : ""
                  }
                </div>
              </div>
            </article>`;
          })
          .join("")
      : `<div class="muted-box">${t("directoryEmpty")}</div>`;

    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.operator) params.set("operator", state.operator);
    const qs = params.toString();
    history.replaceState(null, "", qs ? `ships.html?${qs}` : "ships.html");
  }

  document.getElementById("q").addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    apply();
  });
  document.getElementById("operator").addEventListener("change", (e) => {
    state.operator = e.target.value;
    apply();
  });
  document.getElementById("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    apply();
  });
  onlyBtn.addEventListener("click", () => {
    state.onlyPhotos = !state.onlyPhotos;
    onlyBtn.classList.toggle("active", state.onlyPhotos);
    apply();
  });

  apply();
  document.title = `${t("shipsDirectoryTitle")} | ${t("brand")}`;
});
