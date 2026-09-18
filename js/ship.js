pageApp("ships", (root, data) => {
  const t = I18N.t;
  const { ships, photos, arrivals, terminals } = data;
  const id = DS.qs("id");
  const s = DS.ship(ships, id);

  if (!s) {
    root.innerHTML = `<div class="container muted-box" style="margin-top:2rem">${t("notFoundShip")} <a href="ships.html">${t("backToShips")}</a></div>`;
    return;
  }

  const shipPhotos = DS.photosOfShip(photos, s.id);
  const cover = shipPhotos[0];
  const calls = [...arrivals].filter((a) => a.shipId === s.id).sort((a, b) => b.date.localeCompare(a.date));

  document.title = `${s.name} · IMO ${s.imo} | ${t("brand")}`;

  root.innerHTML = `
    <div class="page-title-bar" style="padding:1rem 0 0.85rem">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "ships.html", label: t("nav.ships") },
          { href: `ship.html?id=${s.id}`, label: DS.shipName(s) },
        ])}
      </div>
    </div>
    <div class="container">
      <header class="ship-header">
        <div class="cover">
          ${cover ? `<a href="photo.html?id=${cover.id}"><img src="${DS.esc(DS.asset(cover.file))}" alt="${DS.esc(s.name)}"></a>` : ""}
        </div>
        <div>
          <h1>${DS.esc(I18N.getLang() === "ja" ? s.nameJa : s.name)}</h1>
          <div class="aka">${DS.esc(I18N.getLang() === "ja" ? s.name : s.nameJa)} · ${DS.esc(DS.operatorName(s))}</div>
          <div class="imo-big">
            IMO ${DS.esc(s.imo)}
            · <a href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(s.imo)}" target="_blank" rel="noopener">${t("trackAIS")} ↗</a>
            · <a href="photos.html?q=${encodeURIComponent(s.imo)}">${shipPhotos.length} ${t("photos")}</a>
          </div>
          <p style="color:var(--muted);font-size:0.92rem;margin-bottom:1rem;line-height:1.65">${DS.esc(s.notes)}</p>
          <div class="ship-specs-table">
            <div class="cell"><span class="k">${t("built")}</span><span class="v">${s.built}</span></div>
            <div class="cell"><span class="k">${t("grossTonnage")}</span><span class="v">${DS.gtLabel(s.gt)}</span></div>
            <div class="cell"><span class="k">${t("lengthBeam")}</span><span class="v">${s.length} × ${s.beam} m</span></div>
            <div class="cell"><span class="k">${t("passengers")}</span><span class="v">${s.passengers.toLocaleString()}</span></div>
            <div class="cell"><span class="k">${t("flag")}</span><span class="v">${DS.esc(s.flag)}</span></div>
            <div class="cell"><span class="k">${t("class")}</span><span class="v">${DS.esc(s.class)}</span></div>
            <div class="cell"><span class="k">${t("homeport")}</span><span class="v">${DS.esc(s.homeport)}</span></div>
            <div class="cell"><span class="k">${t("tokyoPhotos")}</span><span class="v">${shipPhotos.length}</span></div>
          </div>
        </div>
      </header>

      <section class="section">
        <div class="section-head">
          <h2>${t("moreFromShip")}<span class="en">${DS.esc(s.name)}</span></h2>
          <a href="photos.html?q=${encodeURIComponent(s.imo)}">${t("filterGallery")} →</a>
        </div>
        <div class="photo-grid">
          ${
            shipPhotos.length
              ? shipPhotos.map((p) => UI.photoThumb(p, { ships })).join("")
              : `<div class="muted-box" style="grid-column:1/-1">${t("noShipPhotos")}</div>`
          }
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2>${t("tokyoCalls")}<span class="en">${t("scheduleLog")}</span></h2>
          <a href="schedule.html">${t("fullSchedule")} →</a>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th>${t("date")}</th>
                <th>${t("etaEtd")}</th>
                <th>${t("terminal")}</th>
                <th>${t("route")}</th>
                <th>${t("status")}</th>
              </tr>
            </thead>
            <tbody>
              ${
                calls.length
                  ? calls
                      .map((a) => {
                        const term = DS.terminal(terminals, a.terminal);
                        return `<tr>
                          <td>${I18N.formatDate(a.date)}</td>
                          <td>${a.eta} → ${a.etd}</td>
                          <td><a href="terminals.html#${a.terminal}">${DS.esc(I18N.termShort(term))}</a></td>
                          <td style="font-size:0.85rem">${DS.esc(a.lastPort)} → ${DS.esc(a.nextPort)}</td>
                          <td><span class="status ${a.status}">${a.status === "logged" ? t("logged") : t("scheduled")}</span></td>
                        </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="5" style="text-align:center;color:var(--muted)">${t("noCalls")}</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
});
