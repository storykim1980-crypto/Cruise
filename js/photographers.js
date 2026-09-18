/* Contributors list — photographer profiles */
pageApp("photographers", (root, { photographers, photos }) => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";

  const withStats = (photographers || []).map((ph) => {
    const mine = photos.filter((p) => p.photographer === ph.name);
    return {
      ...ph,
      n: mine.length,
      shipCount: new Set(mine.map((p) => p.shipId)).size,
      views: mine.reduce((a, p) => a + p.views, 0),
      likes: mine.reduce((a, p) => a + p.likes, 0),
      thumbs: DS.sortPhotos(mine, "popular").slice(0, 3),
    };
  });

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "photographers.html", label: t("nav.photographers") },
        ])}
        <h1>${t("photographersPageTitle")}</h1>
        <p>${t("photographersPageDesc")}</p>
      </div>
    </div>
    <div class="container">
      <div class="ph-grid">
        ${withStats
          .map(
            (ph) => `
          <article class="ph-card">
            <a class="ph-head" href="photographer.html?name=${encodeURIComponent(ph.name)}">
              <span class="avatar lg" style="--av:${DS.esc(ph.color)}">${DS.esc(ph.initial)}</span>
              <span>
                <h2>${DS.esc(ph.name)}</h2>
                <span class="ph-sub">${DS.esc(ja ? ph.based : ph.basedEn)} · ${t("joined")} ${DS.esc(ph.joined)}</span>
              </span>
            </a>
            <p class="ph-bio">${DS.esc(ja ? ph.bioJa : ph.bioEn)}</p>
            <dl class="ph-stats">
              <div><dt>${t("photosTaken")}</dt><dd>${ph.n}</dd></div>
              <div><dt>${t("shipsShot")}</dt><dd>${ph.shipCount}</dd></div>
              <div><dt>${t("totalViews")}</dt><dd>${ph.views.toLocaleString()}</dd></div>
              <div><dt>${t("totalLikes")}</dt><dd>${ph.likes}</dd></div>
            </dl>
            <div class="ph-thumbs">
              ${ph.thumbs.map((p) => `<a href="photo.html?id=${p.id}"><img src="${DS.esc(DS.asset(p.file))}" alt="" loading="lazy"></a>`).join("")}
            </div>
            <div class="ph-foot">
              <span style="font-size:0.76rem;color:var(--dim)">${DS.esc(ph.gear)}</span>
              <a class="btn btn-sm btn-ghost" href="photographer.html?name=${encodeURIComponent(ph.name)}">${t("photographerProfile")} →</a>
            </div>
          </article>`
          )
          .join("")}
      </div>
    </div>
  `;

  document.title = `${t("photographersPageTitle")} | ${t("brand")}`;
});
