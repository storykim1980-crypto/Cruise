/* Videos — YouTube-linked clip gallery */
(async () => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";
  const [videos, ships] = await Promise.all([DS.load("videos"), DS.load("ships")]);

  document.getElementById("app").innerHTML = `
    <section class="page-title-bar">
      <div class="container">
        <h1>${t("nav.videos")}</h1>
        <p>${t("videosDesc")}</p>
      </div>
    </section>
    <div class="container">
      <div class="vid-grid" id="vid-grid"></div>
    </div>
    <div class="vid-modal" id="vid-modal" hidden>
      <button class="lb-close" id="vid-close" aria-label="${t("closeLabel")}">&times;</button>
      <iframe class="vid-frame" id="vid-frame" title="YouTube" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;

  const grid = document.getElementById("vid-grid");
  const modal = document.getElementById("vid-modal");
  const frame = document.getElementById("vid-frame");

  grid.innerHTML = videos
    .map((v) => {
      const s = ships.find((x) => x.id === v.shipId);
      const shipLink = s
        ? `<a class="chip" href="ship.html?id=${DS.esc(s.id)}">${DS.esc(ja && s.nameJa ? s.nameJa : s.name)}</a>`
        : "";
      return `
      <article class="vid-card">
        <button class="vid-thumb" type="button" data-yt="${DS.esc(v.ytId)}" aria-label="YouTube">
          <img src="https://i.ytimg.com/vi/${DS.esc(v.ytId)}/hqdefault.jpg" alt="" loading="lazy">
          <span class="vid-play" aria-hidden="true"></span>
        </button>
        <div class="vid-body">
          <h3>${DS.esc(ja ? v.title : v.titleEn)}</h3>
          <div class="vid-meta">${DS.esc(v.channel)} · ${I18N.formatDate(v.date)} · ${DS.esc(ja ? v.location : v.locationEn)}</div>
          <div class="chip-row">${shipLink}
            <a class="btn btn-ghost btn-sm" href="https://www.youtube.com/watch?v=${DS.esc(v.ytId)}" target="_blank" rel="noopener">${t("watchOnYouTube")} ↗</a>
          </div>
        </div>
      </article>`;
    })
    .join("");

  function close() {
    modal.hidden = true;
    frame.src = "about:blank";
    document.body.style.overflow = "";
  }
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".vid-thumb");
    if (!btn) return;
    frame.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  });
  document.getElementById("vid-close").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
})();
