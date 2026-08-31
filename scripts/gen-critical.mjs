import { generate } from 'critical';
import { readFileSync, writeFileSync, unlinkSync, renameSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TARGET_HTML = 'index.critical.html';
const CSS_DIR = 'assets/css';
const PLAIN_LINK = '  <link rel="stylesheet" href="assets/css/site.css">\n';

// Make re-runs safe: if a previous run already split the stylesheet
// (inline <style> + async link + noscript fallback), undo that first so
// this always starts from a single plain blocking <link>. Requires
// `npm run build:css` to have regenerated the full (un-extracted) site.css.
{
  const html = readFileSync('index.html', 'utf8');
  if (!html.includes(PLAIN_LINK)) {
    const reverted = html
      .replace(/<style>[\s\S]*?<\/style>\n  <link rel="stylesheet" href="assets\/css\/site\.css" media="print" onload="this\.media='all'">\n/, PLAIN_LINK)
      .replace('  <noscript><link rel="stylesheet" href="assets/css/site.css"></noscript>\n', '');
    if (reverted === html) {
      throw new Error('could not find plain <link> or a previous critical split to revert — inspect index.html manually');
    }
    writeFileSync('index.html', reverted);
  }
}

const result = await generate({
  base: process.cwd(),
  src: 'index.html',
  css: [`${CSS_DIR}/site.css`],
  inline: true,
  extract: true,
  dimensions: [
    { width: 390, height: 844 },
    { width: 1440, height: 900 }
  ],
  penthouse: { timeout: 60000 }
});
writeFileSync(TARGET_HTML, result.html);

// critical writes the non-critical remainder as a content-hashed file
// (assets/css/site.<hash>.css); fold it back into the stable site.css name.
const hashed = readdirSync(CSS_DIR).find((f) => /^site\.[0-9a-f]{6,}\.css$/.test(f));
if (!hashed) throw new Error('extracted hashed css file not found');
renameSync(join(CSS_DIR, hashed), join(CSS_DIR, 'site.css'));

const html = readFileSync('index.html', 'utf8');
const critHtml = readFileSync(TARGET_HTML, 'utf8');
const styleMatch = critHtml.match(/<style>[\s\S]*?<\/style>/);
if (!styleMatch) throw new Error('no inlined <style> found in critical output');

const oldLink = '  <link rel="stylesheet" href="assets/css/site.css">\n';
if (!html.includes(oldLink)) {
  throw new Error('expected plain blocking <link rel="stylesheet" href="assets/css/site.css"> not found — has this already been run?');
}
let out = html.replace(
  oldLink,
  `${styleMatch[0]}\n  <link rel="stylesheet" href="assets/css/site.css" media="print" onload="this.media='all'">\n`
);
const noscript = '  <noscript><link rel="stylesheet" href="assets/css/site.css"></noscript>\n';
out = out.replace('</body>', `${noscript}</body>`);

writeFileSync('index.html', out);
unlinkSync(TARGET_HTML);

console.log(`critical CSS inlined (${styleMatch[0].length} bytes), async site.css (${readFileSync(join(CSS_DIR, 'site.css'), 'utf8').length} bytes)`);
