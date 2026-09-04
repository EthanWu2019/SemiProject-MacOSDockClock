#!/usr/bin/env python3
"""Mac Mini clock — React/Vite SPA static HTTP server.

Build: `npm run build` → produces dist/index.html + dist/assets/*
Serve: this server hosts dist/ at the root. Unknown paths fall back to
index.html so client-side routing / refreshes never 404.

Routes:
    GET /            -> dist/index.html
    GET /healthz     -> "ok" (launchd keepalive)
    GET /assets/*    -> static files in dist/assets/
    GET /favicon.svg -> dist/favicon.svg (fallback)
"""
from __future__ import annotations
import argparse
import mimetypes
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
INDEX_FILE = DIST / "index.html"
INDEX_BYTES = INDEX_FILE.read_bytes() if INDEX_FILE.exists() else b""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Quiet: one line per request.
        sys.stderr.write(f"[clock] {self.address_string()} {fmt % args}\n")

    def do_GET(self):
        if self.path in ("/healthz", "/health"):
            self._send(b"ok\n", 200, "text/plain; charset=utf-8", cache="no-store")
            return
        # Strip query string
        path = self.path.split("?", 1)[0]

        # try the on-disk file under dist/
        rel = path.lstrip("/")
        candidate = DIST / rel
        try:
            # prevent path traversal
            candidate = candidate.resolve()
            dist_root = DIST.resolve()
            if not str(candidate).startswith(str(dist_root)):
                raise ValueError("path traversal")
            if candidate.is_file():
                data = candidate.read_bytes()
                ctype, _ = mimetypes.guess_type(str(candidate))
                if ctype is None:
                    ctype = "application/octet-stream"
                # long-cache hashed assets
                cache = "public, max-age=31536000, immutable" if "/assets/" in path else "public, max-age=300"
                self._send(data, 200, ctype, cache=cache)
                return
        except (FileNotFoundError, ValueError, OSError):
            pass

        # SPA fallback — everything else returns the index
        self._send(INDEX_BYTES, 200, "text/html; charset=utf-8", cache="no-store")

    def do_HEAD(self):
        if self.path in ("/healthz", "/health"):
            self._send(b"ok\n", 200, "text/plain; charset=utf-8", cache="no-store", head_only=True)
            return
        path = self.path.split("?", 1)[0]
        rel = path.lstrip("/")
        candidate = DIST / rel
        try:
            candidate = candidate.resolve()
            if not str(candidate).startswith(str(DIST.resolve())):
                raise ValueError("path traversal")
            if candidate.is_file():
                data = candidate.read_bytes()
                ctype, _ = mimetypes.guess_type(str(candidate))
                if ctype is None:
                    ctype = "application/octet-stream"
                cache = "public, max-age=31536000, immutable" if "/assets/" in path else "public, max-age=300"
                self._send(data, 200, ctype, cache=cache, head_only=True)
                return
        except (FileNotFoundError, ValueError, OSError):
            pass
        self._send(INDEX_BYTES, 200, "text/html; charset=utf-8", cache="no-store", head_only=True)

    def _send(self, body: bytes, status: int, ctype: str, cache: str, head_only: bool = False):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        self.end_headers()
        if not head_only:
            self.wfile.write(body)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8771)
    ap.add_argument("--bind", default="127.0.0.1")
    args = ap.parse_args()

    if not INDEX_FILE.exists():
        sys.stderr.write(f"[clock] WARN: {INDEX_FILE} not found — run `npm run build` first\n")

    addr = (args.bind, args.port)
    httpd = ThreadingHTTPServer(addr, Handler)
    sys.stderr.write(f"[clock] serving dist/ on http://{args.bind}:{args.port}\n")
    sys.stderr.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.stderr.write("[clock] shutting down\n")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()