/* Single photographer profile + full photo set */
pageApp("photographers", (root, data) => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";
  const { photographers, photos, ships } = data;
  const name = DS.qs("name") || "";
  const ph = (photographers || []).find((x) => x.name === name);
  const mine = DS.sortPhotos(photos.filter((p) => p.photographer === name), "newest");

  if (!ph && !mine.length) {
    root.innerHTML = `<div class="container muted-box" style="margin-top:2rem">${t("notFoundPhotographer")} <a href="photographers.html">${t("backToList")}</a></div>`;
    return;
  }

  const profile = ph || {
    name,
    initial: (name[0] || "?").toUpperCase(),
    color: "#38bdf8",
    joined: "—",
    based: "Tokyo",
    basedEn: "Tokyo",
    bioJa: "",
    bioEn: "",
    gear: "—",
  };
  const shipCount = new Set(mine.map((p) => p.shipId)).size;
  const views = mine.reduce((a, p) => a + p.views, 0);
  const likes = mine.reduce((a, p) => a + p.likes, 0);
  const others = (photographers || []).filter((x) => x.name !== profile.name);

  document.title = `${profile.name} | ${t("photographersPageTitle")} | ${t("brand")}`;

  root.innerHTML = `
    <div class="page-title-bar" style="padding:1rem 0 0.85rem">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "photographers.html", label: t("nav.photographers") },
          { href: `photographer.html?name=${encodeURIComponent(profile.name)}`, label: profile.name },
        ])}
      </div>
    </div>

    <div class="container">
      <header class="ph-hero">
        <span class="avatar xl" style="--av:${DS.esc(profile.color)}">${DS.esc(profile.initial)}</span>
        <div class="ph-hero-main">
          <h1>${DS.esc(profile.name)}</h1>
          <p class="ph-sub">${DS.esc(ja ? profile.based : profile.basedEn)} · ${t("joined")} ${DS.esc(profile.joined)} · ${DS.esc(profile.gear)}</p>
          <p class="ph-bio">${DS.esc(ja ? profile.bioJa : profile.bioEn)}</p>
        </div>
        <div class="ph-stats wide">
          <div><dt>${t("photosTaken")}</dt><dd>${mine.length}</dd></div>
          <div><dt>${t("shipsShot")}</dt><dd>${shipCount}</dd></div>
          <div><dt>${t("totalViews")}</dt><dd>${views.toLocaleString()}</dd></div>
          <div><dt>${t("totalLikes")}</dt><dd>${likes}</dd></div>
        </div>
      </header>

      <section class="section">
        <div class="section-head">
          <h2>${t("allPhotos")}<span class="en">${DS.esc(profile.name)}</span></h2>
          <a href="photographers.html">← ${t("photographersPageTitle")}</a>
        </div>
        <div class="photo-grid">
          ${mine.length ? mine.map((p) => UI.photoThumb(p, { ships })).join("") : `<div class="muted-box" style="grid-column:1/-1">${t("noPhotosYet")}</div>`}
        </div>
      </section>

      ${
        others.length
          ? `<section class="section">
              <div class="section-head"><h2>${t("otherPhotographers")}</h2></div>
              <div class="chip-row">
                ${others
                  .map(
                    (o) =>
                      `<a class="chip" href="photographer.html?name=${encodeURIComponent(o.name)}">${DS.esc(o.name)}</a>`
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
    </div>
  `;
});
