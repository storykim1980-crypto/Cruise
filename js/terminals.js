pageApp("terminals", (root, { terminals, photos, arrivals, ships }) => {
  const t = I18N.t;

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "terminals.html", label: t("nav.terminals") },
        ])}
        <h1>${t("terminalsPageTitle")}</h1>
        <p>${t("terminalsPageDesc")}</p>
      </div>
    </div>
    <div class="container">
      ${terminals
        .map((term) => {
          const tPhotos = photos.filter((p) => p.terminal === term.id).slice(0, 4);
          const upcoming = arrivals
            .filter((a) => a.terminal === term.id && a.status === "scheduled" && a.date >= DS.todayISO())
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);
          return `
          <article class="term-card" id="${term.id}">
            <div style="display:flex;flex-wrap:wrap;gap:0.55rem;align-items:center;margin-bottom:0.25rem">
              <h2 style="margin:0">${DS.esc(I18N.termName(term))}</h2>
              ${
                term.bridgeLimit
                  ? `<span class="status scheduled">${t("bridgeLimit")}</span>`
                  : `<span class="status logged">${t("megaCapable")}</span>`
              }
            </div>
            <div class="en">${I18N.getLang() === "ja" ? DS.esc(term.area) : `${DS.esc(term.name)} · ${DS.esc(term.area)}`}</div>
            <p>${DS.esc(term.notes)}</p>
            <div class="term-grid-inner">
              <div>
                <dl class="dl-grid">
                  <dt>${t("opened")}</dt><dd>${DS.esc(term.opened)}</dd>
                  <dt>${t("capacity")}</dt><dd>${DS.esc(term.capacity)}</dd>
                  <dt>${t("berths")}</dt><dd>${DS.esc(term.berths)}</dd>
                  <dt>${t("access")}</dt><dd>${DS.esc(term.access)}</dd>
                </dl>
                <h3 style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim);margin:1.15rem 0 0.5rem;font-weight:800">${t("spottingLocations")}</h3>
                <ul class="spot-list">${term.spotting.map((s) => `<li>${DS.esc(s)}</li>`).join("")}</ul>
                <p style="margin-top:0.9rem"><a href="photos.html?terminal=${term.id}">${t("photosAtTerminal")} →</a></p>
              </div>
              <div>
                <h3 style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim);margin-bottom:0.55rem;font-weight:800">${t("recentPhotos")}</h3>
                <div class="more-thumbs" style="padding:0;margin-bottom:1.15rem">
                  ${
                    tPhotos.length
                      ? tPhotos
                          .map(
                            (p) =>
                              `<a href="photo.html?id=${p.id}"><img src="${DS.esc(DS.asset(p.file))}" alt="${DS.esc(p.title)}" loading="lazy"></a>`
                          )
                          .join("")
                      : `<span style="color:var(--muted);font-size:0.85rem">${t("noPhotosYet")}</span>`
                  }
                </div>
                <h3 style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--dim);margin-bottom:0.55rem;font-weight:800">${t("upcoming")}</h3>
                <ul class="list-compact">
                  ${
                    upcoming.length
                      ? upcoming
                          .map((a) => {
                            const s = DS.ship(ships, a.shipId);
                            return `<li>
                              <div class="t"><a href="ship.html?id=${a.shipId}">${DS.esc(DS.shipName(s) || a.shipId)}</a></div>
                              <div class="m">${I18N.formatDate(a.date)} · ${a.eta}</div>
                            </li>`;
                          })
                          .join("")
                      : `<li class="m">—</li>`
                  }
                </ul>
              </div>
            </div>
          </article>`;
        })
        .join("")}
    </div>
  `;

  document.title = `${t("terminalsPageTitle")} | ${t("brand")}`;
});
