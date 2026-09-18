/* Header / footer — rebuilt on language change */
const Layout = (() => {
  function esc(s) {
    return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function footerTermLinks(terminals) {
    const ids = ["tokyo-international", "harumi", "takeshiba"];
    if (Array.isArray(terminals) && terminals.length) {
      return ids
        .map((id) => {
          const term = terminals.find((x) => x.id === id);
          return term ? `<a href="terminals.html#${id}">${esc(I18N.termShort(term))}</a>` : "";
        })
        .join("");
    }
    const ft = I18N.t("footerTerms");
    return `<a href="terminals.html#tokyo-international">${ft.intl}</a>
            <a href="terminals.html#harumi">${ft.harumi}</a>
            <a href="terminals.html#takeshiba">${ft.takeshiba}</a>`;
  }

  function shipIcon() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18l4-2.5 3 1.2 3-2 3 1.2 3-1 4 2.1V20H2v-2zm1-4L7 12l3 1 3-2 3 1 3-1 2 .9V9L12 5 3 9v5z"/></svg>`;
  }

  function render(data) {
    const t = I18N.t;
    const lang = I18N.getLang();
    const brandMain = t("brand");
    const brandSub = t("brandEn");

    const headerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="index.html">
          <div class="logo-mark">${shipIcon()}</div>
          <div class="logo-text">
            <strong>${brandMain}</strong>
            <span>${brandSub}</span>
          </div>
        </a>
        <form class="header-search" id="header-search" role="search">
          <input type="search" name="q" placeholder="${t("searchPlaceholder")}" aria-label="${t("searchAria")}">
          <button type="submit">${t("searchBtn")}</button>
        </form>
        <nav class="nav" id="main-nav">
          <a href="index.html" data-nav="home">${t("nav.home")}</a>
          <a href="photos.html" data-nav="photos">${t("nav.photos")}</a>
          <a href="ships.html" data-nav="ships">${t("nav.ships")}</a>
          <a href="photographers.html" data-nav="photographers">${t("nav.photographers")}</a>
          <a href="schedule.html" data-nav="schedule">${t("nav.schedule")}</a>
          <a href="terminals.html" data-nav="terminals">${t("nav.terminals")}</a>
          <a href="about.html" data-nav="about">${t("nav.about")}</a>
        </nav>
        <div class="lang-switch" role="group" aria-label="Language / 言語">
          <a href="${I18N.altUrl("ja")}" class="${lang === "ja" ? "active" : ""}" hreflang="ja" lang="ja">日本語</a>
          <a href="${I18N.altUrl("en")}" class="${lang === "en" ? "active" : ""}" hreflang="en" lang="en">English</a>
        </div>
        <button class="menu-toggle" type="button" aria-label="${t("menu")}" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;

    const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="logo" href="index.html">
              <div class="logo-mark">${shipIcon()}</div>
              <div class="logo-text">
                <strong>${brandMain}</strong>
                <span>${brandSub}</span>
              </div>
            </a>
            <p>${t("footerTagline")}</p>
          </div>
          <div class="footer-col">
            <h4>${t("footerBrowse")}</h4>
            <a href="photos.html">${t("footerLatest")}</a>
            <a href="photos.html?sort=popular">${t("footerPopular")}</a>
            <a href="ships.html">${t("footerShips")}</a>
            <a href="photographers.html">${t("contributors")}</a>
            <a href="photos.html">${t("footerCats")}</a>
          </div>
          <div class="footer-col">
            <h4>${t("footerPort")}</h4>
            ${footerTermLinks(data?.terminals)}
            <a href="schedule.html">${t("footerSchedule")}</a>
          </div>
          <div class="footer-col">
            <h4>${t("footerRefs")}</h4>
            <a href="https://www.shipspotting.com/" target="_blank" rel="noopener">ShipSpotting.com</a>
            <a href="https://www.cruisemapper.com/" target="_blank" rel="noopener">CruiseMapper</a>
            <a href="https://www.marinetraffic.com/" target="_blank" rel="noopener">MarineTraffic</a>
            <a href="about.html">${t("footerAbout")}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>${t("footerCopy")}</span>
        </div>
      </div>
    </footer>`;

    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.innerHTML = headerHTML;
    if (f) f.innerHTML = footerHTML;
  }

  return { render };
})();

// Initial paint
Layout.render();
