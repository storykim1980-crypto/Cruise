pageApp("schedule", (root, { ships, arrivals, terminals, photos }) => {
  const t = I18N.t;

  root.innerHTML = `
    <div class="page-title-bar">
      <div class="container">
        ${UI.crumb([
          { href: "index.html", label: t("nav.home") },
          { href: "schedule.html", label: t("nav.schedule") },
        ])}
        <h1>${t("schedulePageTitle")}</h1>
        <p>${t("schedulePageDesc")}</p>
      </div>
    </div>
    <div class="container">
      <div class="toolbar">
        <input type="search" id="q" placeholder="${t("shipSearch")}">
        <select id="terminal">
          <option value="">${t("allTerminals")}</option>
          ${terminals.map((term) => `<option value="${term.id}">${DS.esc(I18N.termName(term))}</option>`).join("")}
        </select>
        <select id="status">
          <option value="">${t("allStatus")}</option>
          <option value="scheduled">${t("scheduled")}</option>
          <option value="logged">${t("logged")}</option>
        </select>
        <span class="count" id="count"></span>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>${t("date")}</th>
              <th>${t("ship")}</th>
              <th>${t("imo")}</th>
              <th>${t("etaEtd")}</th>
              <th>${t("terminal")}</th>
              <th>${t("route")}</th>
              <th>${t("status")}</th>
              <th>${t("photos")}</th>
            </tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>
  `;

  const state = { q: "", terminal: "", status: "" };
  const rows = document.getElementById("rows");

  function apply() {
    let list = [...arrivals];
    if (state.terminal) list = list.filter((a) => a.terminal === state.terminal);
    if (state.status) list = list.filter((a) => a.status === state.status);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((a) => {
        const s = DS.ship(ships, a.shipId);
        return (s?.name || "").toLowerCase().includes(q) || (s?.nameJa || "").includes(state.q);
      });
    }
    list.sort((a, b) => b.date.localeCompare(a.date) || a.eta.localeCompare(b.eta));
    document.getElementById("count").textContent = I18N.tf("callCount", list.length);

    rows.innerHTML = list
      .map((a) => {
        const s = DS.ship(ships, a.shipId);
        const term = DS.terminal(terminals, a.terminal);
        const nPhotos = photos.filter((p) => p.shipId === a.shipId).length;
        return `<tr>
          <td>${I18N.formatDate(a.date)}</td>
          <td>
            <a href="ship.html?id=${DS.esc(a.shipId)}"><strong>${DS.esc(DS.shipName(s) || a.shipId)}</strong></a>
            <div style="font-size:0.75rem;color:var(--muted)">${DS.esc(DS.shipNameSecondary(s) || "")}</div>
          </td>
          <td style="font-family:var(--mono);font-size:0.8rem">
            <a href="photos.html?q=${s?.imo || ""}">${DS.esc(s?.imo || "—")}</a>
          </td>
          <td style="white-space:nowrap;font-variant-numeric:tabular-nums">${a.eta} → ${a.etd}</td>
          <td><a href="terminals.html#${a.terminal}">${DS.esc(I18N.termShort(term))}</a></td>
          <td style="font-size:0.82rem">${DS.esc(a.lastPort)} → ${DS.esc(a.nextPort)}</td>
          <td><span class="status ${a.status}">${a.status === "logged" ? t("logged") : t("scheduled")}</span></td>
          <td>${nPhotos ? `<a href="ship.html?id=${a.shipId}">${nPhotos}</a>` : "—"}</td>
        </tr>`;
      })
      .join("");
  }

  document.getElementById("q").addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    apply();
  });
  document.getElementById("terminal").addEventListener("change", (e) => {
    state.terminal = e.target.value;
    apply();
  });
  document.getElementById("status").addEventListener("change", (e) => {
    state.status = e.target.value;
    apply();
  });

  apply();
  document.title = `${t("schedulePageTitle")} | ${t("brand")}`;
});
