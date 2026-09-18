pageApp("about", (root, { site }) => {
  const t = I18N.t;
  const ja = I18N.getLang() === "ja";

  const body = ja
    ? `
      <h2>ShipSpotting.com を参考にした点</h2>
      <p>本サイトは <a href="https://www.shipspotting.com/" target="_blank" rel="noopener">ShipSpotting.com</a> のアーカイブ設計に強く影響を受けています。</p>
      <p><strong>1. 写真が主役</strong> — 1枚ごとに固有 ID・船名・IMO・撮影日・場所・カテゴリ・撮影者を持つ。</p>
      <p><strong>2. More from this ship</strong> — 同一 IMO / shipId でその船の他写真へ横断リンク。</p>
      <p><strong>3. カテゴリ分類</strong> — メガ / 当代 / ラグジュアリー / 国内 などクルーズ特化カテゴリ。</p>
      <p><strong>4. 検索</strong> — 船名だけでなく IMO・撮影地・タグでもヒット。</p>
      <p><strong>5. 船舶ページ</strong> — スペック＋写真一覧＋寄港ログを1隻に集約。</p>
      <p><strong>6. 日英切替</strong> — ヘッダーの JA / EN でメニューと UI を切り替え（設定はブラウザに保存）。</p>

      <h2>参考サイト</h2>
      ${site.references.map((r) => `<p><a href="${DS.esc(r.url)}" target="_blank" rel="noopener"><strong>${DS.esc(r.name)}</strong></a> — ${DS.esc(r.whyJa || r.why)}</p>`).join("")}

      <h2>データの追加方法（JSON）</h2>
      <p>写真を追加するときは <code>data/photos.json</code> にオブジェクトを足し、画像を <code>img/</code> に置きます。</p>
      <pre>{
  "id": "4019011",
  "title": "SHIP NAME",
  "shipId": "spectrum-of-the-seas",
  "imo": "9774341",
  "file": "img/your-photo.jpg",
  "dateTaken": "2026-09-01",
  "location": "Tokyo International Cruise Terminal",
  "locationJa": "東京国際クルーズターミナル",
  "terminal": "tokyo-international",
  "photographer": "TokyoBaySpotter",
  "category": "cruise-mega",
  "description": "English description…",
  "descriptionJa": "日本語の説明…",
  "views": 0, "likes": 0, "comments": 0,
  "tags": ["arrival"]
}</pre>
      <p>船舶は <code>ships.json</code>、寄港は <code>arrivals.json</code>。<code>shipId</code> と <code>imo</code> を一致させてください。</p>

      <h2>Contact</h2>
      <p>${DS.esc(site.author)} · ${DS.esc(site.location)} · ${DS.esc(site.email)}</p>
    `
    : `
      <h2>What we borrowed from ShipSpotting.com</h2>
      <p>This archive is strongly influenced by the design of <a href="https://www.shipspotting.com/" target="_blank" rel="noopener">ShipSpotting.com</a>.</p>
      <p><strong>1. Photos first</strong> — every frame has an ID, ship name, IMO, date, location, category and photographer.</p>
      <p><strong>2. More from this ship</strong> — same IMO / shipId links every photo of that vessel.</p>
      <p><strong>3. Categories</strong> — mega, contemporary, luxury and domestic cruise groupings.</p>
      <p><strong>4. Search</strong> — hit on name, IMO, place or tags.</p>
      <p><strong>5. Ship pages</strong> — specs, photo set and Tokyo call log in one place.</p>
      <p><strong>6. JA / EN switch</strong> — toggle the full UI from the header (preference saved in your browser).</p>

      <h2>Reference sites</h2>
      ${site.references.map((r) => `<p><a href="${DS.esc(r.url)}" target="_blank" rel="noopener"><strong>${DS.esc(r.name)}</strong></a> — ${DS.esc(r.why)}</p>`).join("")}

      <h2>How to add data (JSON)</h2>
      <p>Drop an image into <code>img/</code> and append an object to <code>data/photos.json</code>.</p>
      <pre>{
  "id": "4019011",
  "title": "SHIP NAME",
  "shipId": "spectrum-of-the-seas",
  "imo": "9774341",
  "file": "img/your-photo.jpg",
  "dateTaken": "2026-09-01",
  "location": "Tokyo International Cruise Terminal",
  "locationJa": "東京国際クルーズターミナル",
  "terminal": "tokyo-international",
  "photographer": "TokyoBaySpotter",
  "category": "cruise-mega",
  "description": "English description…",
  "descriptionJa": "日本語の説明…",
  "views": 0, "likes": 0, "comments": 0,
  "tags": ["arrival"]
}</pre>
      <p>Ships live in <code>ships.json</code>, calls in <code>arrivals.json</code>. Keep <code>shipId</code> and <code>imo</code> in sync.</p>

      <h2>Contact</h2>
      <p>${DS.esc(site.author)} · ${DS.esc(site.location)} · ${DS.esc(site.email)}</p>
    `;

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "about.html", label: t("nav.about") },
        ])}
        <h1>${t("aboutTitle")}</h1>
        <p>${DS.esc(I18N.getLang() === "ja" ? (site.descriptionJa || site.description) : (site.description || site.descriptionJa))}</p>
      </div>
    </div>
    <div class="container prose">
      ${body}
      <p style="margin-top:2rem">
        <a class="btn btn-primary" href="photos.html">${t("nav.photos")}</a>
        <a class="btn btn-ghost" href="index.html" style="margin-left:0.5rem">${t("nav.home")}</a>
      </p>
    </div>
  `;

  document.title = `${t("aboutTitle")} | ${t("brand")}`;
});
