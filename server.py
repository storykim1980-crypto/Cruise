#!/usr/bin/env python3
"""개발/미리보기용 서버 — 모든 응답에 no-cache 헤더 (모바일 구캐시 방지)"""
import http.server
import socketserver

PORT = 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, must-revalidate, max-age=0")
        self.send_header("Expires", "0")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"serving on 0.0.0.0:{PORT} with no-cache headers")
    httpd.serve_forever()
