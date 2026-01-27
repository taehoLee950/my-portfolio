import fs from 'node:fs';
import path from 'node:path';

const TARGET_EXTS = new Set(['.js', '.json', '.env']);

function stripUtf8Bom(text) {
  return text.replace(/^\uFEFF/, '');
}

function stripZeroWidth(text) {
  return text.replace(/^[\u200B-\u200D\u2060\uFEFF]+/, '');
}

function bufferLooksUtf16LE(buf) {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return true;
  let zeros = 0;
  const sampleLen = Math.min(buf.length, 2000);
  for (let i = 1; i < sampleLen; i += 2) {
    if (buf[i] === 0x00) zeros++;
  }
  return zeros > sampleLen / 8;
}

function bufferLooksUtf16BE(buf) {
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) return true;
  let zeros = 0;
  const sampleLen = Math.min(buf.length, 2000);
  for (let i = 0; i < sampleLen; i += 2) {
    if (buf[i] === 0x00) zeros++;
  }
  return zeros > sampleLen / 8;
}

function decodeToText(buf) {
  if (bufferLooksUtf16LE(buf)) return buf.toString('utf16le');
  if (bufferLooksUtf16BE(buf)) return buf.toString('utf16be');
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.slice(3).toString('utf8');
  }
  return buf.toString('utf8');
}

function shouldProcess(filePath) {
  const ext = path.extname(filePath);
  if (TARGET_EXTS.has(ext)) return true;
  return path.basename(filePath) === '.env';
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules') continue;
      walk(p, out);
    } else if (ent.isFile()) {
      if (shouldProcess(p)) out.push(p);
    }
  }
  return out;
}

const apiRoot = path.resolve(process.cwd());
const files = walk(apiRoot);

let changed = 0;
for (const filePath of files) {
  try {
    const buf = fs.readFileSync(filePath);
    let text = decodeToText(buf);
    const original = text;
    text = stripUtf8Bom(text);
    text = stripZeroWidth(text);
    text = text.replace(/\r\n/g, '\n');

    if (text !== original) {
      fs.writeFileSync(filePath, text, { encoding: 'utf8' });
      changed++;
      process.stdout.write(`fixed: ${path.relative(apiRoot, filePath)}\n`);
    }
  } catch (e) {
    process.stderr.write(`skip: ${filePath} (${e.message})\n`);
  }
}

process.stdout.write(`\nDone. Changed files: ${changed}/${files.length}\n`);

