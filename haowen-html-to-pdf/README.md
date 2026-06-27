# haowen-html-to-pdf

Custom agent skill for generating PDFs from HTML files or URLs with headless Chromium.

## Install dependencies

```bash
cd /path/to/haowen-html-to-pdf
npm install
```

## Convert general HTML to PDF

```bash
node scripts/convert.mjs /path/to/page.html /path/to/page.pdf --mode print
```

## Convert a URL to PDF

```bash
node scripts/convert.mjs https://example.com example.pdf --mode print
```

## Convert an HTML slide deck to PDF

```bash
node scripts/convert.mjs /path/to/deck.html /path/to/deck.pdf --mode slides --selector 'section'
```

## Options

Run:

```bash
node scripts/convert.mjs --help
```

Common options include `--mode`, `--selector`, `--viewport`, `--format`, `--landscape`, `--margin`, and `--wait-ms`.
