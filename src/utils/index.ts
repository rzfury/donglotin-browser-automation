export { load as cheerio } from 'cheerio';

import type { Page } from 'puppeteer';
import { promises as fs } from 'node:fs';

export async function wait(ms: number) {
  return new Promise(y => setTimeout(y, ms));
}

export async function ss(page: Page) {
  return await page.screenshot({
    path: `./screenshots/${new Date().toISOString()}-debug.png`
  })
}

export async function dumpstr(str: string, filename?: string) {
  const name = filename || `dump-${getDateForFilename()}`;
  await fs.writeFile(`./dumpstr/${name}.txt`, `${str}`);
}

export function getDateForFilename() {
  return (new Date()).toISOString().replaceAll(':', '_');
}
