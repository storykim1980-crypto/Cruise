pageApp("photos", (root, data) => {
  const t = I18N.t;
  const { ships, photos, terminals, categories } = data;
  const id = DS.qs("id");
  const p = DS.photo(photos, id);

  if (!p) {
    root.innerHTML = `<div class="container muted-box" style="margin-top:2rem">${t("notFoundPhoto")} <a href="photos.html">${t("backToList")}</a></div>`;
    return;
  }

  const s = DS.ship(ships, p.shipId);
  const term = DS.terminal(terminals, p.terminal);
  const cat = DS.category(categories, p.category);
  const moreShip = DS.photosOfShip(photos, p.shipId).filter((x) => x.id !== p.id);
  const moreLoc = photos.filter((x) => x.terminal === p.terminal && x.id !== p.id).slice(0, 4);
  const lang = I18N.getLang();
  const primaryDesc = lang === "ja" ? p.descriptionJa || p.description : p.description || p.descriptionJa;
  const secondaryDesc = lang === "ja" ? p.description : p.descriptionJa;
  const locPrimary = lang === "ja" ? p.locationJa || p.location : p.location || p.locationJa;
  const locSecondary = lang === "ja" ? p.location : p.locationJa;

  document.title = `${p.title} · ${p.id} | ${t("brand")}`;

  root.innerHTML = `
    <div class="page-title-bar" style="padding:1rem 0 0.85rem">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "photos.html", label: t("nav.photos") },
          { href: `photos.html?category=${p.category}`, label: I18N.catName(cat) || p.category },
          { href: `photo.html?id=${p.id}`, label: p.id },
        ])}
      </div>
    </div>

    <div class="container">
      <div class="photo-detail-layout">
        <div>
          <article class="photo-main">
            <div class="photo-toolbar">
              <a href="photos.html">← ${t("gallery")}</a>
              <a href="ship.html?id=${DS.esc(p.shipId)}">${t("moreFromShip")}</a>
              <a href="photos.html?q=${encodeURIComponent(p.imo)}">IMO ${DS.esc(p.imo)}</a>
              <a href="photos.html?terminal=${DS.esc(p.terminal)}">${t("sameTerminal")}</a>
              <span style="margin-left:auto;color:var(--dim);font-family:var(--mono);font-size:0.75rem">ID ${DS.esc(p.id)}</span>
            </div>
            <div class="full-img">
              <img src="${DS.esc(DS.asset(p.file))}" alt="${DS.esc(p.title)}">
            </div>
            <div class="photo-info">
              <h1>${DS.esc(p.title)}</h1>
              <div class="title-ja">${s ? `${DS.esc(DS.shipNameSecondary(s))} · ${DS.esc(DS.operatorName(s))}` : ""}</div>
              <p class="desc">${DS.esc(primaryDesc)}</p>
              ${secondaryDesc && secondaryDesc !== primaryDesc ? `<p class="desc-secondary">${DS.esc(secondaryDesc)}</p>` : `<div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border)"></div>`}
              <dl class="dl-grid">
                <dt>${t("imo")}</dt>
                <dd>
                  <a href="ship.html?id=${DS.esc(p.shipId)}">${DS.esc(p.imo)}</a>
                  · <a href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(p.imo)}" target="_blank" rel="noopener">MarineTraffic ↗</a>
                </dd>
                <dt>${t("ship")}</dt>
                <dd><a href="ship.html?id=${DS.esc(p.shipId)}">${DS.esc(p.title)}</a>${s ? ` / ${DS.esc(DS.shipName(s))}` : ""}</dd>
                <dt>${t("photoDate")}</dt>
                <dd>${I18N.formatDateLong(p.dateTaken)}${p.timeTaken ? ` · ${DS.esc(p.timeTaken)}` : ""}</dd>
                <dt>${t("location")}</dt>
                <dd>${DS.esc(locPrimary)}${locSecondary && locSecondary !== locPrimary ? `<br><span style="color:var(--muted)">${DS.esc(locSecondary)}</span>` : ""}</dd>
                <dt>${t("terminal")}</dt>
                <dd><a href="terminals.html#${DS.esc(p.terminal)}">${DS.esc(I18N.termName(term) || p.terminal)}</a></dd>
                <dt>${t("category")}</dt>
                <dd><a href="photos.html?category=${DS.esc(p.category)}">${DS.esc(I18N.catName(cat) || p.categoryLabel)}</a></dd>
                <dt>${t("photographer")}</dt>
                <dd><a href="photographer.html?name=${encodeURIComponent(p.photographer)}">${DS.esc(p.photographer)}</a></dd>
                <dt>${t("gear")}</dt>
                <dd>${DS.esc(p.gear || "—")}</dd>
                <dt>${t("stats")}</dt>
                <dd>${t("views")} ${p.views.toLocaleString()} · ${t("likes")} ${p.likes} · ${t("comments")} ${p.comments}</dd>
                <dt>${t("tags")}</dt>
                <dd>${
                  (p.tags || [])
                    .map((tg) => `<a href="photos.html?q=${encodeURIComponent(tg)}" style="margin-right:0.55rem">#${DS.esc(tg)}</a>`)
                    .join("") || "—"
                }</dd>
              </dl>
            </div>
          </article>

          ${
            moreShip.length
              ? `<section class="section">
                  <div class="section-head">
                    <h2>${t("moreFromShip")}<span class="en">${DS.esc(p.title)}</span></h2>
                    <a href="ship.html?id=${DS.esc(p.shipId)}">${t("allPhotos")} →</a>
                  </div>
                  <div class="photo-grid">${moreShip.map((x) => UI.photoThumb(x, { ships })).join("")}</div>
                </section>`
              : ""
          }
        </div>

        <aside class="side-stack" style="position:sticky;top:calc(var(--header-h) + 1rem)">
          <div class="side-box">
            <h3>${t("vessel")}</h3>
            <div class="body">
              ${
                s
                  ? `<div class="ship-mini-specs">
                      <div><span>${t("name")}</span><span>${DS.esc(s.name)}</span></div>
                      <div><span>日本語</span><span>${DS.esc(s.nameJa)}</span></div>
                      <div><span>${t("operator")}</span><span>${DS.esc(DS.operatorName(s))}</span></div>
                      <div><span>${t("built")}</span><span>${s.built}</span></div>
                      <div><span>${t("grossTonnage")}</span><span>${DS.gtLabel(s.gt)}</span></div>
                      <div><span>${t("lengthBeam")}</span><span>${s.length} × ${s.beam} m</span></div>
                      <div><span>${t("passengers")}</span><span>${s.passengers.toLocaleString()}</span></div>
                      <div><span>${t("flag")}</span><span>${DS.esc(s.flag)}</span></div>
                      <div><span>${t("class")}</span><span>${DS.esc(s.class)}</span></div>
                    </div>
                    <p style="margin-top:0.9rem"><a class="btn btn-ghost btn-sm" href="ship.html?id=${DS.esc(s.id)}" style="width:100%">${t("shipPage")}</a></p>`
                  : `<p>—</p>`
              }
            </div>
          </div>

          <div class="side-box">
            <h3>${t("moreFromShip")}</h3>
            <div class="more-thumbs">
              ${
                moreShip.length
                  ? moreShip
                      .slice(0, 4)
                      .map((x) => `<a href="photo.html?id=${x.id}" title="${DS.esc(x.title)}"><img src="${DS.esc(DS.asset(x.file))}" alt="" loading="lazy"></a>`)
                      .join("")
                  : `<p class="body" style="grid-column:1/-1;color:var(--muted);font-size:0.82rem">${t("noPhotosYet")}</p>`
              }
            </div>
          </div>

          <div class="side-box">
            <h3>${t("sameTerminal")}</h3>
            <div class="more-thumbs">
              ${
                moreLoc.length
                  ? moreLoc
                      .map((x) => `<a href="photo.html?id=${x.id}" title="${DS.esc(x.title)}"><img src="${DS.esc(DS.asset(x.file))}" alt="" loading="lazy"></a>`)
                      .join("")
                  : `<p class="body" style="color:var(--muted);font-size:0.82rem">—</p>`
              }
            </div>
          </div>

          <div class="side-box">
            <h3>${t("links")}</h3>
            <div class="body" style="font-size:0.85rem">
              <p><a href="https://www.marinetraffic.com/en/ais/details/ships/imo:${DS.esc(p.imo)}" target="_blank" rel="noopener">MarineTraffic ↗</a></p>
              <p><a href="https://www.vesselfinder.com/?imo=${DS.esc(p.imo)}" target="_blank" rel="noopener">VesselFinder ↗</a></p>
              <p><a href="schedule.html">${t("nav.schedule")}</a></p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
});
