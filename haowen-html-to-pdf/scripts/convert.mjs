#!/usr/bin/env node
/**
 * Convert HTML files or URLs to PDF with Puppeteer.
 *
 * Modes:
 *   print  - use Chromium's native print-to-PDF for general web pages
 *   slides - render each slide element to an image and assemble a PDF
 *   auto   - use slides mode when slide elements exist, otherwise print mode
 */

import { accessSync, constants, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, extname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'os';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function importDependency(name, installHint) {
  try {
    return await import(name);
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find package/.test(error?.message || '')) {
      console.error(`Missing dependency: ${name}`);
      console.error(installHint);
      process.exit(1);
    }
    throw error;
  }
}

function usage() {
  console.log(`Usage:
  node scripts/convert.mjs <input.html|url> [output.pdf] [options]

Options:
  --mode <auto|print|slides>        Rendering mode (default: auto)
  --selector <css>                  Slide selector for slides mode (default: section[data-slide], section.slide, .slide)
  --viewport <WxH>                  Browser viewport in CSS pixels (default: 1280x720)
  --device-scale <number>           Device scale for slide screenshots (default: 2)
  --format <name>                   Print PDF format, e.g. A4, Letter (default: A4)
  --landscape                       Print PDF in landscape orientation
  --print-background <bool>         Include CSS backgrounds in print mode (default: true)
  --margin <css-length>             Print margin on all sides, e.g. 0, 10mm (default: 0)
  --wait-ms <number>                Extra wait after load before rendering (default: 1000)
  --browser-executable <path>       Browser executable to use instead of Puppeteer's bundled Chromium
  --no-system-browser-fallback      Do not retry with installed Chrome/Chromium if bundled Chromium fails
  --help                            Show this help

Examples:
  node scripts/convert.mjs page.html page.pdf
  node scripts/convert.mjs https://example.com example.pdf --format Letter
  node scripts/convert.mjs deck.html deck.pdf --mode slides --selector 'section'
  node scripts/convert.mjs page.html page.pdf --browser-executable /path/to/chrome
`);
}

function parseArgs(argv) {
  const opts = {
    mode: 'auto',
    selector: 'section[data-slide], section.slide, .slide',
    viewport: '1280x720',
    deviceScale: 2,
    format: 'A4',
    landscape: false,
    printBackground: true,
    margin: '0',
    waitMs: 1000,
    systemBrowserFallback: true,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--landscape') opts.landscape = true;
    else if (arg === '--no-system-browser-fallback') opts.systemBrowserFallback = false;
    else if (arg === '--mode') opts.mode = argv[++i];
    else if (arg === '--selector') opts.selector = argv[++i];
    else if (arg === '--viewport') opts.viewport = argv[++i];
    else if (arg === '--device-scale') opts.deviceScale = Number(argv[++i]);
    else if (arg === '--format') opts.format = argv[++i];
    else if (arg === '--print-background') opts.printBackground = argv[++i] !== 'false';
    else if (arg === '--margin') opts.margin = argv[++i];
    else if (arg === '--wait-ms') opts.waitMs = Number(argv[++i]);
    else if (arg === '--browser-executable') opts.browserExecutable = argv[++i];
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }

  opts.input = positional[0];
  opts.output = positional[1];
  return opts;
}

function isUrl(input) {
  return /^https?:\/\//i.test(input);
}

function inputToUrl(input) {
  if (isUrl(input)) return input;
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`Input file not found: ${inputPath}`);
  return pathToFileURL(inputPath).href;
}

function defaultOutput(input) {
  if (isUrl(input)) {
    const slug = new URL(input).hostname.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
    return resolve(process.cwd(), `${slug || 'output'}.pdf`);
  }
  const inputPath = resolve(process.cwd(), input);
  return extname(inputPath) ? inputPath.replace(/\.[^.]+$/, '.pdf') : `${inputPath}.pdf`;
}

function parseViewport(value) {
  const match = /^(\d+)x(\d+)$/i.exec(value);
  if (!match) throw new Error(`Invalid viewport '${value}'. Use WIDTHxHEIGHT, e.g. 1280x720.`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

function isExecutable(path) {
  if (!path) return false;
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function findOnPath(command) {
  try {
    const lookup = platform() === 'win32' ? 'where' : 'which';
    return execFileSync(lookup, [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function systemBrowserCandidates() {
  const candidates = [];
  const os = platform();

  if (os === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
    );
  } else if (os === 'linux') {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge',
      '/usr/bin/brave-browser',
      '/snap/bin/chromium'
    );
  } else if (os === 'win32') {
    const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']].filter(Boolean);
    for (const prefix of prefixes) {
      candidates.push(
        `${prefix}\\Google\\Chrome\\Application\\chrome.exe`,
        `${prefix}\\Microsoft\\Edge\\Application\\msedge.exe`,
        `${prefix}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`
      );
    }
  }

  for (const command of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome', 'msedge', 'microsoft-edge', 'brave-browser', 'brave']) {
    candidates.push(...findOnPath(command));
  }

  return [...new Set(candidates)].filter(isExecutable);
}

function launchCandidates(opts) {
  if (opts.browserExecutable) {
    return [{ label: opts.browserExecutable, executablePath: opts.browserExecutable, explicit: true }];
  }

  const candidates = [];
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    candidates.push({ label: process.env.PUPPETEER_EXECUTABLE_PATH, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH });
  }

  candidates.push({ label: 'Puppeteer bundled Chromium', executablePath: undefined });

  if (opts.systemBrowserFallback) {
    for (const executablePath of systemBrowserCandidates()) {
      candidates.push({ label: executablePath, executablePath });
    }
  }

  const seen = new Set();
  return candidates.filter(candidate => {
    const key = candidate.executablePath || '<bundled>';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function browserLaunchHints() {
  return [
    'Install dependencies from the skill directory: npm install',
    'If bundled Chromium is incomplete, install Chrome/Chromium or pass --browser-executable /path/to/browser.',
    'You can also set PUPPETEER_EXECUTABLE_PATH=/path/to/browser.',
  ].join('\n');
}

async function launchBrowser(puppeteer, opts) {
  const baseLaunchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  const candidates = launchCandidates(opts);
  const errors = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    try {
      const launchOptions = { ...baseLaunchOptions };
      if (candidate.executablePath) launchOptions.executablePath = candidate.executablePath;
      const browser = await puppeteer.launch(launchOptions);
      if (candidate.executablePath) console.error(`Using browser: ${candidate.executablePath}`);
      return browser;
    } catch (error) {
      errors.push({ candidate, error });
      if (candidate.explicit) break;
      if (index < candidates.length - 1) console.error(`Browser launch failed with ${candidate.label}; trying next candidate.`);
    }
  }

  const summary = errors
    .map(({ candidate, error }) => `- ${candidate.label}: ${error?.message || error}`)
    .join('\n');
  throw new Error(`Could not launch a browser.\n${summary}\n\n${browserLaunchHints()}`);
}

async function waitForPageReady(page, waitMs) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  if (waitMs > 0) await new Promise(resolve => setTimeout(resolve, waitMs));
}

async function countSlides(page, selector) {
  return page.evaluate(sel => document.querySelectorAll(sel).length, selector);
}

async function renderPrintPdf(page, outputPath, opts) {
  await page.pdf({
    path: outputPath,
    format: opts.format,
    landscape: opts.landscape,
    printBackground: opts.printBackground,
    margin: {
      top: opts.margin,
      right: opts.margin,
      bottom: opts.margin,
      left: opts.margin,
    },
    preferCSSPageSize: true,
  });
}

async function renderSlidesPdf(page, outputPath, opts, viewport) {
  const { PDFDocument } = await importDependency(
    'pdf-lib',
    `Install dependencies from the skill directory:\n  cd ${resolve(__dirname, '..')} && npm install`
  );

  const slideCount = await countSlides(page, opts.selector);
  if (slideCount === 0) throw new Error(`No slides found with selector: ${opts.selector}`);

  const pdfDoc = await PDFDocument.create();

  for (let index = 0; index < slideCount; index += 1) {
    await page.evaluate((sel, i) => {
      const slides = [...document.querySelectorAll(sel)];
      slides.forEach(slide => { slide.style.display = 'none'; });
      const target = slides[i];
      target.style.cssText = [
        'display: flex !important',
        'position: fixed !important',
        'inset: 0 !important',
        'width: 100vw !important',
        'height: 100vh !important',
        'z-index: 9999 !important',
        'overflow: hidden !important',
      ].join('; ');
      target.querySelectorAll('.reveal, [data-fragment]').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
      });
    }, opts.selector, index);

    await new Promise(resolve => setTimeout(resolve, opts.waitMs));
    const jpeg = await page.screenshot({
      clip: { x: 0, y: 0, width: viewport.width, height: viewport.height },
      type: 'jpeg',
      quality: 92,
    });
    const image = await pdfDoc.embedJpg(jpeg);
    const pdfPage = pdfDoc.addPage([viewport.width, viewport.height]);
    pdfPage.drawImage(image, { x: 0, y: 0, width: viewport.width, height: viewport.height });
    process.stdout.write(`Rendered slide ${index + 1}/${slideCount}\n`);
  }

  writeFileSync(outputPath, await pdfDoc.save());
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.input) {
    usage();
    process.exit(opts.help ? 0 : 1);
  }
  if (!['auto', 'print', 'slides'].includes(opts.mode)) throw new Error('--mode must be auto, print, or slides');

  const viewport = parseViewport(opts.viewport);
  const outputPath = resolve(process.cwd(), opts.output || defaultOutput(opts.input));
  const url = inputToUrl(opts.input);

  const { default: puppeteer } = await importDependency(
    'puppeteer',
    `Install dependencies from the skill directory:\n  cd ${resolve(__dirname, '..')} && npm install`
  );

  const browser = await launchBrowser(puppeteer, opts);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: opts.deviceScale });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
    await waitForPageReady(page, opts.waitMs);

    let mode = opts.mode;
    if (mode === 'auto') mode = (await countSlides(page, opts.selector)) > 0 ? 'slides' : 'print';

    console.log(`Input : ${opts.input}`);
    console.log(`Output: ${outputPath}`);
    console.log(`Mode  : ${mode}`);

    if (mode === 'slides') await renderSlidesPdf(page, outputPath, opts, viewport);
    else await renderPrintPdf(page, outputPath, opts);
  } finally {
    await browser.close();
  }

  console.log(`Saved PDF: ${outputPath}`);
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
