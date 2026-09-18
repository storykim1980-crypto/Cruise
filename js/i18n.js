/* Bilingual UI: Japanese (main site) + English (/en/ version).
   Language is decided by URL — root pages are always Japanese,
   pages under /en/ are always English. No localStorage needed. */
const I18N = (() => {
  const IS_EN = /(^|\/)en\//.test(location.pathname);
  const BASE = IS_EN ? "../" : "";

  const dict = {
    ja: {
      langName: "日本語",
      htmlLang: "ja",
      brand: "東京クルーズログ",
      brandEn: "Tokyo Cruise Log",
      heroEyebrow: "東京湾 · クルーズ客船フォトアーカイブ",
      footerTerms: { intl: "東京国際CT", harumi: "晴海", takeshiba: "竹芝" },
      searchPlaceholder: "船名 / IMO / 撮影地…",
      searchAria: "写真検索",
      searchBtn: "検索",
      nav: {
        home: "ホーム",
        photos: "写真",
        ships: "船舶",
        schedule: "スケジュール",
        terminals: "ターミナル",
        photographers: "撮影者",
        about: "概要",
      },
      menu: "メニュー",
      footerBrowse: "閲覧",
      footerPort: "東京港",
      footerRefs: "リンク",
      refShipspotting: "世界の船舶写真アーカイブ",
      refCruisemapper: "クルーズスケジュールと船舶データ",
      refMarinetraffic: "AIS位置情報とIMO検索",
      footerLatest: "最新の写真",
      footerPopular: "人気の写真",
      footerShips: "船舶データベース",
      footerCats: "カテゴリ",
      footerSchedule: "入港スケジュール",
      footerAbout: "このサイトについて",
      footerTagline:
        "東京に寄港するクルーズ客船のフォトアーカイブ。1枚の写真に IMO・撮影地・カテゴリを紐づけて記録します。",
      footerCopy: "© 2026 東京クルーズログ · 趣味のアーカイブ",
      loading: "読み込み中…",
      loadError: "データの読み込みに失敗しました",
      photos: "写真",
      photo: "写真",
      ships: "船舶",
      ship: "船舶",
      views: "閲覧",
      likes: "いいね",
      comments: "コメント",
      photographer: "撮影者",
      imo: "IMO",
      moreFromShip: "この船の他の写真",
      sameTerminal: "同じターミナル",
      gallery: "ギャラリー",
      allPhotos: "すべての写真",
      viewMore: "もっと見る",
      browseAll: "すべて見る",
      mostPopular: "人気の写真",
      latestPhotos: "最新の写真",
      categories: "カテゴリ",
      upcomingCalls: "今後の入港",
      photoSearch: "写真検索",
      fullSchedule: "フルスケジュール",
      howArchive: "アーカイブの仕組み",
      how1: "① 写真ごとに IMO / 船名 / 撮影日 / 場所 を付与",
      how2: "② 同一 IMO で「この船の他の写真」を連結",
      how3: "③ カテゴリ・ターミナルで絞り込み",
      how4: "④ data/photos.json を編集するだけで追加",
      sideSearchHint: "船名または IMO で同一船舶の写真を横断検索できます。",
      noUpcoming: "直近の予定はありません",
      heroStatsPhotos: "写真",
      heroStatsShips: "船舶",
      heroStatsCalls: "寄港記録",
      heroStatsPhotographers: "撮影者",
      lastUploads: "アップロード順の人気",
      newestFirst: "新しい順",
      allCategories: "すべてのカテゴリ",
      photosPageTitle: "フォトギャラリー",
      photosPageDesc: "船名 / IMO / 撮影地 / カテゴリで検索。サムネイルから写真詳細へ。",
      all: "すべて",
      newest: "新しい順",
      mostPopularSort: "人気順",
      mostLiked: "いいね順",
      azName: "船名 A–Z",
      allTerminals: "すべてのターミナル",
      noPhotosMatch: "条件に一致する写真がありません",
      photoCount: (n) => `${n} 枚`,
      shipCount: (n) => `${n} 隻`,
      callCount: (n) => `${n} 件`,
      shipsPageTitle: "クルーズ客船ディレクトリ",
      shipsPageDesc: "東京に寄港するクルーズ客船の登録簿。運航会社・建造年・トン数で絞り込めます。※デモ用サンプルデータ",
      shipSearch: "船名 / IMO / 船社…",
      schedulePageTitle: "東京港 入港スケジュール",
      schedulePageDesc: "撮影計画用の寄港一覧。記録済みは写真アーカイブとリンクします。※デモ用サンプル。",
      allStatus: "すべての状態",
      scheduled: "予定",
      logged: "記録済み",
      date: "日付",
      etaEtd: "入港 → 出港",
      terminal: "ターミナル",
      route: "航路",
      status: "状態",
      terminalsPageTitle: "東京クルーズターミナル",
      terminalsPageDesc: "撮影スポットと橋梁制限。各ターミナルの写真はギャラリーから絞り込めます。",
      bridgeLimit: "橋梁制限あり",
      megaCapable: "超大型対応",
      spottingLocations: "おすすめ撮影スポット",
      photosAtTerminal: "このターミナルの写真",
      recentPhotos: "最近の写真",
      upcoming: "今後の入港",
      noPhotosYet: "まだ写真がありません",
      aboutTitle: "このサイトについて",
      vessel: "船舶情報",
      shipPage: "船舶ページ",
      photoDate: "撮影日",
      location: "撮影地",
      category: "カテゴリ",
      gear: "機材",
      stats: "統計",
      tags: "タグ",
      built: "建造",
      grossTonnage: "総トン数",
      lengthBeam: "全長 × 幅",
      passengers: "定員",
      flag: "船籍",
      class: "船級",
      homeport: "母港",
      tokyoPhotos: "東京の写真",
      tokyoCalls: "東京への寄港",
      scheduleLog: "スケジュールログ",
      filterGallery: "ギャラリーで絞る",
      noShipPhotos: "まだ写真がありません。data/photos.json に追加してください。",
      noCalls: "寄港記録なし",
      notFoundPhoto: "写真が見つかりません。",
      notFoundShip: "船舶が見つかりません。",
      backToList: "一覧へ",
      backToShips: "船舶一覧へ",
      trackAIS: "AISで追跡",
      operator: "運航会社",
      name: "船名",
      links: "リンク",
      opened: "開業",
      capacity: "対応規模",
      berths: "バース",
      access: "アクセス",
      go: "検索",
      potd: "今日の一枚",
      viewPhoto: "写真を見る",
      contributors: "撮影者",
      contributorsHint: "プロフィールと全写真を閲覧できます",
      shipsDirectoryTitle: "クルーズ客船ディレクトリ",
      shipsDirectoryDesc: "東京に寄港するクルーズ客船の登録簿。運航会社・建造年・トン数で絞り込めます。※デモ用サンプルデータ",
      registeredShips: (n) => `登録船舶 ${n} 隻`,
      allOperators: "すべての運航会社",
      sortShips: "並び替え",
      sortNameAZ: "船名 A–Z",
      sortNewest: "新しい船順",
      sortOldest: "古い船順",
      sortGT: "総トン数順",
      sortPax: "定員順",
      onlyWithPhotos: "写真ありのみ",
      noPhoto: "写真未登録",
      builtAge: (y) => `建造 ${y}年 · 船齢 ${new Date().getFullYear() - y}`,
      itineraries: "寄港歴",
      shipDirectory: "船舶ページ",
      photographersPageTitle: "撮影者",
      photographersPageDesc: "東京クルーズログに写真を提供する撮影者。プロフィールと全写真を閲覧できます。",
      photosTaken: "撮影写真",
      shipsShot: "撮影船舶",
      totalViews: "総閲覧数",
      totalLikes: "総いいね",
      joined: "参加",
      based: "拠点",
      mainGear: "機材",
      photographerProfile: "撮影者プロフィール",
      otherPhotographers: "他の撮影者",
      notFoundPhotographer: "撮影者が見つかりません。",
      directoryEmpty: "条件に一致する船舶がありません",
    },
    en: {
      langName: "English",
      htmlLang: "en",
      brand: "Tokyo Cruise Log",
      brandEn: "東京クルーズログ",
      heroEyebrow: "Tokyo Bay · Cruise Ship Photo Archive",
      footerTerms: { intl: "Tokyo Intl CT", harumi: "Harumi", takeshiba: "Takeshiba" },
      searchPlaceholder: "Ship name / IMO / Location…",
      searchAria: "Search photos",
      searchBtn: "Search",
      nav: {
        home: "Home",
        photos: "Photos",
        ships: "Ships",
        schedule: "Schedule",
        terminals: "Terminals",
        photographers: "Photographers",
        about: "About",
      },
      menu: "Menu",
      footerBrowse: "Browse",
      footerPort: "Tokyo Port",
      footerRefs: "Links",
      refShipspotting: "Global ship photo archive",
      refCruisemapper: "Cruise schedules and ship data",
      refMarinetraffic: "AIS positions and IMO lookup",
      footerLatest: "Latest photos",
      footerPopular: "Most popular",
      footerShips: "Ship database",
      footerCats: "Categories",
      footerSchedule: "Call schedule",
      footerAbout: "About this site",
      footerTagline:
        "A photo archive of cruise ships calling at Tokyo. Each image is tagged with IMO, location and category.",
      footerCopy: "© 2026 Tokyo Cruise Log · Hobby archive",
      loading: "Loading…",
      loadError: "Failed to load data",
      photos: "photos",
      photo: "Photo",
      ships: "ships",
      ship: "Ship",
      views: "Views",
      likes: "Likes",
      comments: "Comments",
      photographer: "Photographer",
      imo: "IMO",
      moreFromShip: "More from this ship",
      sameTerminal: "Same terminal",
      gallery: "Gallery",
      allPhotos: "All photos",
      viewMore: "View more",
      browseAll: "Browse all",
      mostPopular: "Most popular",
      latestPhotos: "Latest photos",
      categories: "Categories",
      upcomingCalls: "Upcoming calls · Tokyo",
      photoSearch: "Photo search",
      fullSchedule: "Full schedule",
      howArchive: "How this archive works",
      how1: "① Each photo carries IMO / name / date / location",
      how2: "② Same IMO links “more from this ship”",
      how3: "③ Filter by category and terminal",
      how4: "④ Add entries by editing data/photos.json",
      sideSearchHint: "Search by ship name or IMO to find every frame of the same vessel.",
      noUpcoming: "No upcoming sample calls",
      heroStatsPhotos: "photos",
      heroStatsShips: "ships",
      heroStatsCalls: "port calls",
      heroStatsPhotographers: "photographer",
      lastUploads: "By popularity",
      newestFirst: "Newest first",
      allCategories: "All categories",
      photosPageTitle: "Photo gallery",
      photosPageDesc: "Search by ship name, IMO, location or category. Open a thumbnail for full metadata.",
      all: "All",
      newest: "Newest",
      mostPopularSort: "Most popular",
      mostLiked: "Most liked",
      azName: "A–Z ship name",
      allTerminals: "All terminals",
      noPhotosMatch: "No photos match these filters",
      photoCount: (n) => `${n} photo${n === 1 ? "" : "s"}`,
      shipCount: (n) => `${n} ship${n === 1 ? "" : "s"}`,
      callCount: (n) => `${n} call${n === 1 ? "" : "s"}`,
      shipsPageTitle: "Cruise ship directory",
      shipsPageDesc: "Cruise ships calling at Tokyo. Filter by line, build year and tonnage. Sample demo data.",
      shipSearch: "Name / IMO / Operator…",
      schedulePageTitle: "Tokyo port call schedule",
      schedulePageDesc: "Plan your spotting. Logged calls link to the photo archive. Sample timetable for demo.",
      allStatus: "All status",
      scheduled: "Scheduled",
      logged: "Logged",
      date: "Date",
      etaEtd: "ETA–ETD",
      terminal: "Terminal",
      route: "Route",
      status: "Status",
      terminalsPageTitle: "Tokyo cruise terminals",
      terminalsPageDesc: "Spotting locations and bridge limits. Filter the gallery by terminal.",
      bridgeLimit: "Bridge limit",
      megaCapable: "Mega capable",
      spottingLocations: "Spotting locations",
      photosAtTerminal: "Photos at this terminal",
      recentPhotos: "Recent photos",
      upcoming: "Upcoming",
      noPhotosYet: "No photos yet",
      aboutTitle: "About this archive",
      vessel: "Vessel",
      shipPage: "Ship page",
      photoDate: "Photo date",
      location: "Location",
      category: "Category",
      gear: "Gear",
      stats: "Stats",
      tags: "Tags",
      built: "Built",
      grossTonnage: "Gross tonnage",
      lengthBeam: "Length × beam",
      passengers: "Passengers",
      flag: "Flag",
      class: "Class",
      homeport: "Homeport",
      tokyoPhotos: "Tokyo photos",
      tokyoCalls: "Tokyo port calls",
      scheduleLog: "Schedule log",
      filterGallery: "Filter gallery",
      noShipPhotos: "No photos yet. Add entries in data/photos.json.",
      noCalls: "No port calls recorded",
      notFoundPhoto: "Photo not found.",
      notFoundShip: "Ship not found.",
      backToList: "Back to gallery",
      backToShips: "Back to ships",
      trackAIS: "Track AIS",
      operator: "Operator",
      name: "Name",
      links: "Links",
      opened: "Opened",
      capacity: "Capacity",
      berths: "Berths",
      access: "Access",
      go: "Go",
      potd: "Photo of the Day",
      viewPhoto: "View photo",
      contributors: "Contributors",
      contributorsHint: "Open a profile for the full photo set",
      shipsDirectoryTitle: "Cruise ship directory",
      shipsDirectoryDesc: "Cruise ships calling at Tokyo. Filter by line, build year and tonnage. Sample demo data.",
      registeredShips: (n) => `${n} passenger ships in database`,
      allOperators: "All cruise lines",
      sortShips: "Sort",
      sortNameAZ: "Name A–Z",
      sortNewest: "Newest built",
      sortOldest: "Oldest built",
      sortGT: "Gross tonnage",
      sortPax: "Passengers",
      onlyWithPhotos: "With photos only",
      noPhoto: "No photo yet",
      builtAge: (y) => `Built ${y} · Age ${new Date().getFullYear() - y}`,
      itineraries: "Calls",
      shipDirectory: "Ship page",
      photographersPageTitle: "Photographers",
      photographersPageDesc: "Contributors uploading to the Tokyo archive. Profiles with full photo sets.",
      photosTaken: "Photos",
      shipsShot: "Ships shot",
      totalViews: "Total views",
      totalLikes: "Total likes",
      joined: "Joined",
      based: "Based in",
      mainGear: "Gear",
      photographerProfile: "Photographer profile",
      otherPhotographers: "Other contributors",
      notFoundPhotographer: "Photographer not found.",
      directoryEmpty: "No ships match these filters",
    },
  };

  function getLang() {
    return IS_EN ? "en" : "ja";
  }

  function setLang(lang) {
    if (lang !== "ja" && lang !== "en") return;
    document.documentElement.lang = dict[lang].htmlLang;
    document.documentElement.dataset.lang = lang;
  }

  /** Path prefix for shared assets (data/, img/) when running under /en/ */
  function base() {
    return BASE;
  }

  /** URL of the same page in the other language version */
  function altUrl(lang) {
    const file = location.pathname.split("/").pop() || "index.html";
    const search = location.search || "";
    if (lang === "en") return IS_EN ? file + search : "en/" + file + search;
    return IS_EN ? "../" + file + search : file + search;
  }

  function t(key) {
    const lang = getLang();
    const table = dict[lang] || dict.ja;
    const val = key.split(".").reduce((o, k) => (o == null ? o : o[k]), table);
    if (val == null) {
      const fb = key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict.en);
      return fb == null ? key : fb;
    }
    return val;
  }

  function tf(key, ...args) {
    const val = t(key);
    return typeof val === "function" ? val(...args) : val;
  }

  /** Pick bilingual field from data objects */
  function field(obj, base, lang = getLang()) {
    if (!obj) return "";
    if (lang === "ja") return obj[base + "Ja"] || obj[base] || obj[base + "En"] || "";
    return obj[base] || obj[base + "En"] || obj[base + "Ja"] || "";
  }

  function catName(cat) {
    if (!cat) return "";
    return getLang() === "ja" ? cat.nameJa || cat.name : cat.name || cat.nameJa;
  }

  function termName(term) {
    if (!term) return "";
    return getLang() === "ja" ? term.name : term.nameEn || term.name;
  }

  function termShort(term) {
    if (!term) return "";
    if (getLang() === "ja") return term.short || term.name;
    const map = {
      国際CT: "Intl CT",
      晴海: "Harumi",
      竹芝: "Takeshiba",
      日の出: "Hinode",
    };
    return map[term.short] || term.nameEn || term.short;
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T12:00:00");
    const loc = getLang() === "ja" ? "ja-JP" : "en-GB";
    return d.toLocaleDateString(loc, { year: "numeric", month: "short", day: "numeric" });
  }

  function formatDateLong(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T12:00:00");
    const loc = getLang() === "ja" ? "ja-JP" : "en-GB";
    return d.toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  }

  function onChange(fn) {
    window.addEventListener("tcl:lang", fn);
  }

  function emit() {
    window.dispatchEvent(new CustomEvent("tcl:lang", { detail: { lang: getLang() } }));
  }

  function toggle() {
    location.href = altUrl(getLang() === "ja" ? "en" : "ja");
  }

  // init
  setLang(getLang());

  return {
    dict,
    getLang,
    setLang,
    base,
    altUrl,
    t,
    tf,
    field,
    catName,
    termName,
    termShort,
    formatDate,
    formatDateLong,
    onChange,
    emit,
    toggle,
  };
})();
