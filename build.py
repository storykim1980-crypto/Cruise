#!/usr/bin/env python3
"""
 Tokyo Cruise Log — auto cache-bust builder
 · HTML의 css/js 링크와 tcl-build 메타태그에 버전 스탬프 자동 부여
 · sw.js(서비스워커)를 동일 버전으로 재생성
 사용법:  python3 build.py
"""
import re
import json
import hashlib
import datetime
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SKIP_PARTS = (".git", "sw.js", "build.py", "server.py", "deploy-work")

SW_TEMPLATE = '''/* Tokyo Cruise Log service worker — build @V@ */
const CACHE = "tcl-@V@";
const CORE = @CORE@;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  // HTML navigation: network-first (always fresh), offline fallback to cache
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        })
        .catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // assets: cache-first + background revalidate (versioned URLs are immutable)
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fresh = fetch(e.request)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
'''


def content_hash() -> str:
    h = hashlib.sha256()
    for f in sorted(ROOT.rglob("*")):
        if not f.is_file():
            continue
        if any(p in str(f) for p in SKIP_PARTS):
            continue
        if f.suffix in (".html", ".css", ".js", ".json"):
            h.update(f.read_bytes())
    return h.hexdigest()[:6]


VERSION = datetime.datetime.now().strftime("%y%m%d%H%M") + "." + content_hash()

# ---- stamp HTML ----
stamped = 0
for html in sorted(list(ROOT.glob("*.html")) + list(ROOT.glob("en/*.html"))):
    s = html.read_text(encoding="utf-8")
    orig = s
    s = re.sub(
        r'(<meta name="tcl-build" content=")[^"]*(")',
        lambda m: m.group(1) + VERSION + m.group(2),
        s,
    )
    s = re.sub(r'(\.(?:css|js)\?v=)[^"&\s]+', lambda m: m.group(1) + VERSION, s)
    s = s.replace("__BUILD__", VERSION)
    if s != orig:
        html.write_text(s, encoding="utf-8")
        stamped += 1

# ---- generate sw.js ----
core = [
    "./",
    "./index.html",
    "./en/",
    "./css/styles.css?v=" + VERSION,
    "./js/i18n.js?v=" + VERSION,
    "./js/layout.js?v=" + VERSION,
    "./js/data.js?v=" + VERSION,
]
sw = SW_TEMPLATE.replace("@V@", VERSION).replace("@CORE@", json.dumps(core))
(ROOT / "sw.js").write_text(sw, encoding="utf-8")

print("build " + VERSION + ": stamped " + str(stamped) + " html files, sw.js regenerated")
