/* Ship detail — full-bleed hero + specs, photos, calls */
pageApp("ships", (root, data) => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";
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

  document.title = `${s.name} · IMO ${s.imo || "—"} | ${t("brand")}`;

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

    <section class="ship-hero ${cover ? "" : "no-cover"}" ${cover ? `style="background-image:url('${DS.asset(cover.file)}')"` : ""}>
      <div class="ship-hero-overlay"></div>
      <div class="container ship-hero-inner">
        <div class="ship-hero-kicker">
          ${s.imo ? `<span class="imo-pill">IMO ${DS.esc(s.imo)}</span>` : `<span class="imo-pill">${ja ? "IMO 登録待ち" : "IMO pending"}</span>`}
          <span>${DS.esc(DS.operatorName(s))}</span>
          <span>${DS.esc(s.flag)}</span>
          <span>${DS.esc(s.class)}</span>
        </div>
        <h1>${DS.esc(ja ? s.nameJa : s.name)}</h1>
        <div class="aka">${DS.esc(ja ? s.name : s.nameJa)} · ${t("homeport")}: ${DS.esc(s.homeport)}</div>
        <div class="spec-chips">
          <span><b>${t("grossTonnage")}</b>${s.gt.toLocaleString()} GT</span>
          <span><b>${t("lengthBeam")}</b>${s.length} × ${s.beam} m</span>
          <span><b>${t("built")}</b>${s.built}</span>
          <span><b>${t("passengers")}</b>${s.passengers.toLocaleString()}</span>
        </div>
        <div class="ship-hero-actions">
          <a class="btn btn-primary" href="#ship-photos">${t("photos")} ${shipPhotos.length}</a>
          <a class="btn btn-ghost" href="#ship-calls">${t("itineraries")} ${calls.length}</a>
          ${
            s.imo
              ? `<a class="btn btn-ghost" href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(s.imo)}" target="_blank" rel="noopener">${t("trackAIS")} ↗</a>`
              : ""
          }
        </div>
      </div>
    </section>

    <div class="container">
      <div class="ship-body-grid">
        <div>
          <section class="section" id="ship-photos">
            <div class="section-head">
              <h2>${t("moreFromShip")}<span class="en">${DS.esc(s.name)}</span></h2>
              <a href="photos.html?q=${encodeURIComponent(s.imo || s.name)}">${t("filterGallery")} →</a>
            </div>
            <div class="photo-grid">
              ${
                shipPhotos.length
                  ? shipPhotos.map((p) => UI.photoThumb(p, { ships })).join("")
                  : `<div class="muted-box" style="grid-column:1/-1">${t("noShipPhotos")}</div>`
              }
            </div>
          </section>

          <section class="section" id="ship-calls">
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

        <aside class="side-stack" style="position:sticky;top:calc(var(--header-h) + 1rem)">
          <div class="side-box">
            <h3>${t("vessel")}</h3>
            <div class="body">
              <div class="ship-mini-specs">
                <div><span>${t("name")}</span><span>${DS.esc(s.name)}</span></div>
                <div><span>日本語</span><span>${DS.esc(s.nameJa)}</span></div>
                <div><span>${t("operator")}</span><span>${DS.esc(DS.operatorName(s))}</span></div>
                <div><span>${t("built")}</span><span>${s.built}</span></div>
                <div><span>${t("grossTonnage")}</span><span>${DS.gtLabel(s.gt)}</span></div>
                <div><span>${t("lengthBeam")}</span><span>${s.length} × ${s.beam} m</span></div>
                <div><span>${t("passengers")}</span><span>${s.passengers.toLocaleString()}</span></div>
                <div><span>${t("flag")}</span><span>${DS.esc(s.flag)}</span></div>
                <div><span>${t("class")}</span><span>${DS.esc(s.class)}</span></div>
                <div><span>${t("homeport")}</span><span>${DS.esc(s.homeport)}</span></div>
                <div><span>${t("imo")}</span><span>${s.imo ? DS.esc(s.imo) : "—"}</span></div>
              </div>
              <p style="margin-top:0.9rem;color:var(--muted);font-size:0.84rem;line-height:1.6">${DS.esc(s.notes)}</p>
              ${
                s.imo
                  ? `<p style="margin-top:0.7rem">
                      <a href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(s.imo)}" target="_blank" rel="noopener">MarineTraffic ↗</a> ·
                      <a href="https://www.vesselfinder.com/?imo=${DS.esc(s.imo)}" target="_blank" rel="noopener">VesselFinder ↗</a>
                    </p>`
                  : ""
              }
            </div>
          </div>

          <div class="side-box">
            <h3>${t("photoDate")} — ${t("moreFromShip")}</h3>
            <div class="more-thumbs">
              ${
                shipPhotos.length
                  ? shipPhotos
                      .slice(0, 4)
                      .map((x) => `<a href="photo.html?id=${x.id}" title="${DS.esc(x.title)}"><img src="${DS.esc(DS.asset(x.file))}" alt="" loading="lazy"></a>`)
                      .join("")
                  : `<p class="body" style="grid-column:1/-1;color:var(--muted);font-size:0.82rem">${t("noPhotosYet")}</p>`
              }
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
});
