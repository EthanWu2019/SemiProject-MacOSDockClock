# SemiProject-MacOSDockClock

A Vite + React single-page app that draws an iOS-StandBy-style flip
clock for the macOS Dock.  Favourite theme + font, second-precision,
theme-aware.  No backend.

> Originally written because macOS doesn't ship a turnkey 12/24h
> flip clock for the Dock and the third-party options all want a
> subscription.  This is one page, one font picker, one theme
> picker, and a `server.py` if you want to host it on your LAN.

## Run

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # → dist/
```

If you'd rather just serve the built bundle locally:

```bash
python3 server.py --port 8000
```

Deployed at clock.ethanshermes.com.

## Tech

- Vite, React, TypeScript
- Framer Motion (digit flip)
- Plain CSS variables (themes)

## License

MIT
