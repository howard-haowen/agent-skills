---
name: haowen-html-to-pdf
description: Convert HTML files or web pages to PDF using headless Chromium. Use when asked to generate a PDF from HTML, export an HTML page or slide deck to PDF, print a local HTML file to PDF, or preserve browser-rendered CSS, fonts, backgrounds, and layouts in a PDF. Supports general web pages and slide-style HTML decks.
---

# HTML to PDF

Use this skill to generate PDFs from local HTML files or URLs. The included Node.js script supports two rendering strategies:

- **Print mode** for general HTML pages and web pages, using Chromium's native PDF output.
- **Slides mode** for HTML presentations, rendering each slide element as a full-bleed PDF page.

When running commands from an agent, resolve the skill directory dynamically instead of hard-coding a user-specific path. In examples below, replace `/path/to/haowen-html-to-pdf` with this skill directory.

## Requirements

The helper script requires Node.js and installs its dependencies locally in this skill directory.

```bash
cd /path/to/haowen-html-to-pdf
npm install
```

Dependencies are declared in `package.json`:

- `puppeteer` for headless Chromium rendering
- `pdf-lib` for assembling slide screenshots into a multi-page PDF

## Browser Selection

By default, the script tries Puppeteer's bundled Chromium first. If that browser fails to launch, it automatically retries with installed Chrome/Chromium-compatible browsers discovered on the current system:

- macOS: Google Chrome, Chrome Canary, Chromium, Microsoft Edge, Brave
- Linux: `google-chrome`, `google-chrome-stable`, `chromium`, `chromium-browser`, Microsoft Edge, Brave, Snap Chromium
- Windows: Chrome, Edge, and Brave in common per-user and Program Files locations
- Any platform: browser executables found on `PATH`

You can override browser selection explicitly:

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs input.html output.pdf \
  --browser-executable /path/to/chrome-or-chromium
```

Or use Puppeteer's standard environment variable:

```bash
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome-or-chromium \
  node /path/to/haowen-html-to-pdf/scripts/convert.mjs input.html output.pdf
```

Disable automatic system-browser fallback when you specifically want to test Puppeteer's bundled Chromium:

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs input.html output.pdf \
  --no-system-browser-fallback
```

## Pre-flight Check

Optional checks before converting:

```bash
# Confirm Node.js is available
node --version

# Confirm dependencies are installed
cd /path/to/haowen-html-to-pdf && npm ls puppeteer pdf-lib

# Confirm at least one browser is available on PATH, if bundled Chromium is not usable
command -v google-chrome || command -v chromium || command -v chromium-browser || command -v chrome || command -v msedge || true
```

On macOS, this additional check is useful:

```bash
ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" && echo "System Chrome OK"
```

## Quick Start

From the skill directory:

```bash
npm run convert -- /path/to/input.html /path/to/output.pdf
```

Or run the script directly from any working directory:

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs input.html output.pdf
```

If the output path is omitted, the script writes a `.pdf` beside the input file.

## General HTML Pages

Use print mode for ordinary pages, reports, invoices, documentation, or URLs:

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs page.html page.pdf --mode print
node /path/to/haowen-html-to-pdf/scripts/convert.mjs https://example.com example.pdf --mode print
```

Useful print options:

```bash
--format A4              # Chromium paper format; also supports Letter, Legal, etc.
--landscape              # Landscape page orientation
--margin 10mm            # Same margin on all sides
--print-background true  # Include CSS backgrounds; true by default
--wait-ms 2000           # Extra wait for fonts, charts, or async content
```

## HTML Slide Decks

Use slides mode for slide decks where each slide is an element such as `<section>`, `<section data-slide>`, or `.slide`:

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs deck.html deck.pdf --mode slides --selector 'section'
```

Slides mode isolates each matched slide, captures it at the configured viewport size, and assembles the captures into a PDF. This avoids scroll-snap and viewport clipping problems common in HTML presentations.

Useful slide options:

```bash
--selector 'section[data-slide]'
--viewport 1280x720
--device-scale 2
--wait-ms 1000
```

## Auto Mode

`--mode auto` is the default. It uses slides mode when slide elements matching the selector exist; otherwise it uses print mode.

```bash
node /path/to/haowen-html-to-pdf/scripts/convert.mjs input.html
```

## Troubleshooting

- **Missing dependency**: run `npm install` in this skill directory.
- **`dlopen` / missing `Frameworks` on macOS (Apple Silicon)**: Puppeteer's bundled Chromium may be incomplete. The script should automatically retry with installed Chrome/Chromium. If needed, pass `--browser-executable /path/to/browser` or set `PUPPETEER_EXECUTABLE_PATH=/path/to/browser`.
- **`Failed to launch the browser process`**: install Chrome/Chromium, pass `--browser-executable`, or inspect the launch attempts printed by the script.
- **Testing original bundled Chromium failure**: add `--no-system-browser-fallback` to disable the automatic retry.
- **Fonts or charts missing**: increase `--wait-ms`.
- **Backgrounds missing**: ensure `--print-background true` is set.
- **Wrong slide detection**: pass a specific `--selector` such as `'main > section'` or `'.slide'`.
- **Content clipped in slides mode**: adjust `--viewport` to match the deck's intended aspect ratio.
