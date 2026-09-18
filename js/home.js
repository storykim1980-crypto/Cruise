pageApp("home", (root, { ships, photos, arrivals, categories, site, terminals }) => {
  const t = I18N.t;
  const popular = DS.sortPhotos(photos, "popular").slice(0, 8);
  const latest = DS.sortPhotos(photos, "newest").slice(0, 8);
  const upcoming = [...arrivals]
    .filter((a) => a.status === "scheduled" && a.date >= DS.todayISO())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const heroTitle =
    I18N.getLang() === "ja"
      ? `<span class="grad">${DS.esc(site.taglineJa || site.tagline)}</span>`
      : `<span class="grad">${DS.esc(site.tagline)}</span>`;

  const heroDesc = I18N.getLang() === "ja" ? (site.descriptionJa || site.description) : (site.description || site.descriptionJa);

  const catCards = categories
    .map((c) => {
      const sample = photos.find((p) => p.category === c.id);
      const n = photos.filter((p) => p.category === c.id).length;
      const countTxt = I18N.tf("photoCount", n);
      const sub = I18N.getLang() === "ja" ? countTxt : `${c.nameJa} · ${countTxt}`;
      return `
        <a class="cat-card" href="photos.html?category=${DS.esc(c.id)}">
          <div class="thumb">${sample ? `<img src="${DS.esc(DS.asset(sample.file))}" alt="" loading="lazy">` : ""}</div>
          <div class="lab">
            <strong>${DS.esc(I18N.catName(c))}</strong>
            <span>${DS.esc(sub)}</span>
          </div>
        </a>`;
    })
    .join("");

  root.innerHTML = `
    <section class="home-hero">
      <div class="hero-bg" style="background-image:url('${DS.asset("img/photo-qe-salute.jpg")}')"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="hero-eyebrow"><span class="dot"></span> ${t("heroEyebrow")}</div>
        <h1>${heroTitle}</h1>
        <p class="sub">${DS.esc(heroDesc)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="photos.html">${t("nav.photos")}</a>
          <a class="btn btn-ghost" href="schedule.html">${t("nav.schedule")}</a>
        </div>
        <div class="home-hero-stats">
          <div class="stat"><strong>${site.stats.photos}</strong><span>${t("heroStatsPhotos")}</span></div>
          <div class="stat"><strong>${site.stats.ships}</strong><span>${t("heroStatsShips")}</span></div>
          <div class="stat"><strong>${site.stats.portCalls}</strong><span>${t("heroStatsCalls")}</span></div>
          <div class="stat"><strong>${site.stats.photographers}</strong><span>${t("heroStatsPhotographers")}</span></div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="home-split">
        <div>
          <section class="section">
            <div class="section-head">
              <h2>${t("mostPopular")}<span class="en">${t("lastUploads")}</span></h2>
              <a href="photos.html?sort=popular">${t("viewMore")} →</a>
            </div>
            <div class="photo-grid">${popular.map((p) => UI.photoThumb(p, { ships })).join("")}</div>
          </section>

          <section class="section">
            <div class="section-head">
              <h2>${t("latestPhotos")}<span class="en">${t("newestFirst")}</span></h2>
              <a href="photos.html">${t("browseAll")} →</a>
            </div>
            <div class="photo-grid">${latest.map((p) => UI.photoThumb(p, { ships })).join("")}</div>
          </section>

          <section class="section">
            <div class="section-head">
              <h2>${t("categories")}<span class="en">${t("allCategories")}</span></h2>
              <a href="photos.html">${t("browseAll")} →</a>
            </div>
            <div class="cat-grid">${catCards}</div>
          </section>
        </div>

        <aside class="side-stack">
          <div class="side-box">
            <h3>${t("photoSearch")}</h3>
            <div class="body">
              <form id="side-search" class="side-search-row">
                <input type="search" name="q" placeholder="${t("searchPlaceholder")}">
                <button class="btn btn-primary btn-sm" type="submit">${t("go")}</button>
              </form>
              <p style="margin-top:0.75rem;font-size:0.78rem">${t("sideSearchHint")}</p>
            </div>
          </div>

          <div class="side-box">
            <h3>${t("upcomingCalls")}</h3>
            <div class="body">
              <ul class="list-compact">
                ${
                  upcoming.length
                    ? upcoming
                        .map((a) => {
                          const s = DS.ship(ships, a.shipId);
                          const term = DS.terminal(terminals, a.terminal);
                          return `<li>
                            <div class="t"><a href="ship.html?id=${DS.esc(a.shipId)}">${DS.esc(DS.shipName(s) || a.shipId)}</a></div>
                            <div class="m">${I18N.formatDate(a.date)} · ${a.eta} · ${DS.esc(I18N.termShort(term))}</div>
                          </li>`;
                        })
                        .join("")
                    : `<li class="m">${t("noUpcoming")}</li>`
                }
              </ul>
              <p style="margin-top:0.65rem"><a href="schedule.html">${t("fullSchedule")} →</a></p>
            </div>
          </div>

          <div class="side-box">
            <h3>${t("inspiredBy")}</h3>
            <div class="body">
              <a class="ref-item" href="${DS.esc(site.inspiredBy.url)}" target="_blank" rel="noopener">
                <strong>${DS.esc(site.inspiredBy.name)}</strong>
                <span>${DS.esc(I18N.getLang() === "ja" ? site.inspiredBy.noteJa || site.inspiredBy.note : site.inspiredBy.note)}</span>
              </a>
              ${site.references
                .slice(1, 4)
                .map(
                  (r) => `
                <a class="ref-item" href="${DS.esc(r.url)}" target="_blank" rel="noopener">
                  <strong>${DS.esc(r.name)}</strong>
                  <span>${DS.esc(I18N.getLang() === "ja" ? r.whyJa || r.why : r.why)}</span>
                </a>`
                )
                .join("")}
            </div>
          </div>

          <div class="side-box">
            <h3>${t("howArchive")}</h3>
            <div class="body" style="font-size:0.82rem">
              <p>${t("how1")}</p>
              <p>${t("how2")}</p>
              <p>${t("how3")}</p>
              <p>${t("how4")}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  document.getElementById("side-search")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    location.href = q ? `photos.html?q=${encodeURIComponent(q)}` : "photos.html";
  });

  document.title =
    I18N.getLang() === "ja"
      ? "東京クルーズログ | Tokyo Cruise Log — 船舶フォトアーカイブ"
      : "Tokyo Cruise Log | Tokyo Bay Cruise Ship Photo Archive";
});
