// Validates every card in cards/ and builds cards.json for the page.
//
//   node scripts/build.mjs          validate, then write cards.json
//   node scripts/build.mjs --check  validate only (used on pull requests)
//
// No dependencies. Needs Node 18 or newer.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cardsDir = join(root, 'cards');
const checkOnly = process.argv.includes('--check');

const REQUIRED = ['name', 'year', 'major', 'hometown', 'photo', 'linkedin'];
const OPTIONAL = ['title'];
const ALLOWED = new Set([...REQUIRED, ...OPTIONAL]);

const FILE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*\.json$/;
const PHOTO_PATH = /^photos\/[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$/i;
const LINKEDIN_URL = /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/?#]+\/?$/i;
const MAX_TEXT = 80;
const MAX_PHOTO_BYTES = 1024 * 1024;

const errors = [];
const cards = [];

const files = existsSync(cardsDir)
  ? readdirSync(cardsDir).filter((f) => !f.startsWith('.')).sort()
  : [];

for (const file of files) {
  const where = `cards/${file}`;
  const fail = (msg) => errors.push(`${where}: ${msg}`);

  if (!file.endsWith('.json')) {
    fail('only .json files belong in cards/');
    continue;
  }
  if (!FILE_NAME.test(file)) {
    fail('name the file like first-last.json (lowercase letters, numbers, dashes)');
    continue;
  }

  let card;
  try {
    card = JSON.parse(readFileSync(join(cardsDir, file), 'utf8'));
  } catch (err) {
    fail(`not valid JSON (${err.message})`);
    continue;
  }
  if (card === null || typeof card !== 'object' || Array.isArray(card)) {
    fail('must be a single JSON object');
    continue;
  }

  for (const key of Object.keys(card)) {
    if (!ALLOWED.has(key)) fail(`unknown field "${key}" (allowed: ${[...ALLOWED].join(', ')})`);
  }

  for (const key of REQUIRED) {
    const value = card[key];
    if (typeof value !== 'string' || value.trim() === '') {
      fail(`"${key}" is required and must be text`);
    } else if (value.length > MAX_TEXT) {
      fail(`"${key}" is longer than ${MAX_TEXT} characters`);
    }
  }

  if ('title' in card) {
    if (typeof card.title !== 'string') fail('"title" must be text');
    else if (card.title.length > MAX_TEXT) fail(`"title" is longer than ${MAX_TEXT} characters`);
  }

  if (typeof card.photo === 'string' && card.photo.trim() !== '') {
    if (!PHOTO_PATH.test(card.photo)) {
      fail('"photo" must look like photos/first-last.jpg (.jpg, .jpeg, .png or .webp)');
    } else {
      const photoFile = join(root, card.photo);
      if (!existsSync(photoFile)) {
        fail(`photo file ${card.photo} does not exist. Add it in the same pull request`);
      } else if (statSync(photoFile).size > MAX_PHOTO_BYTES) {
        fail(`photo ${card.photo} is over 1 MB. Resize it to about 600x600`);
      }
    }
  }

  if (typeof card.linkedin === 'string' && card.linkedin.trim() !== '') {
    if (!LINKEDIN_URL.test(card.linkedin)) {
      fail('"linkedin" must be your profile URL, like https://www.linkedin.com/in/your-handle');
    }
  }

  const entry = { id: file.replace(/\.json$/, '') };
  for (const key of [...REQUIRED, ...OPTIONAL]) {
    const value = card[key];
    if (typeof value === 'string' && value.trim() !== '') entry[key] = value.trim();
  }
  cards.push(entry);
}

if (errors.length > 0) {
  console.error(`Found ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

cards.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

if (checkOnly) {
  console.log(`OK: ${cards.length} card${cards.length === 1 ? '' : 's'} valid.`);
} else {
  writeFileSync(join(root, 'cards.json'), JSON.stringify(cards, null, 2) + '\n');
  console.log(`Wrote cards.json with ${cards.length} card${cards.length === 1 ? '' : 's'}.`);
}
