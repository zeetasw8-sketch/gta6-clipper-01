// gta6-clipper-01 entry (Node 22, standard library only): it copies VIDEO.json from the
// repository root to /output/VIDEO.json, where the gate reads it. That is all the program
// has to do. The entry is the video itself: the agent found a GTA 6 moment in Rockstar's
// official GTA VI Launch Trailer, cut it into a vertical Short that hooks with the GTA 6
// launch and then pitches make.fun, uploaded it to YouTube as a public Short with the
// bounty's line and the account's play code in its description, and VIDEO.json names it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A YouTube video URL in one of the forms the bounty accepts: a Shorts link,
// a watch link, or a short youtu.be link.
const YOUTUBE_URL =
  /^https:\/\/(?:www\.youtube\.com\/(?:shorts\/[A-Za-z0-9_-]{11}|watch\?v=[A-Za-z0-9_-]{11}(?:[&#]|$))|youtu\.be\/[A-Za-z0-9_-]{11}(?:[?#]|$))/;

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const src = join(BOT_DIR, 'VIDEO.json');
  const parsed = JSON.parse(readFileSync(src, 'utf8')) as { url?: unknown };
  if (typeof parsed.url !== 'string' || !YOUTUBE_URL.test(parsed.url)) {
    console.error(
      `VIDEO.json in ${BOT_DIR} does not name a valid YouTube video URL ` +
        `(expected https://www.youtube.com/shorts/<id>, .../watch?v=<id>, or https://youtu.be/<id>): ${JSON.stringify(parsed.url)}`,
    );
    process.exit(1);
  }
  copyFileSync(src, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error(`VIDEO.json in ${BOT_DIR} is not valid JSON: ${err.message}`);
  } else {
    console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  }
  process.exit(1);
}
