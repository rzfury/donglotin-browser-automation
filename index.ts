import { config } from 'dotenv';
import { promises as fs } from 'node:fs';
import puppeteer from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import mainSequence from '~/sequences/main';
import startup from '~/sequences/startup';
import { ss } from '~/utils';

config();

(() => {
  const agent = new UserAgent(/Mozilla.*Win64.*Chrome.*112/);

  puppeteer.use(Stealth());
  puppeteer.launch({
    headless: false,
    args: ['--remote-debugging-port=16969', '--disable-notifications'],
  }).then(async browser => {
    let fails: boolean = false;

    browser.defaultBrowserContext().overridePermissions(
      'https://www.facebook.com',
      [
        'notifications',
        'clipboard-read',
        'clipboard-write'
      ]
    );

    const page = await browser.newPage();
    await page.setUserAgent(agent.toString());
    await page.setViewport({ width: 1336, height: 768 });
    
    const cookiesString = await fs.readFile('./stores/cookies.json');
    const cookies = JSON.parse(cookiesString.toString());
    await page.setCookie(...cookies);

    // APP SEQUENCES

    await startup(page);
    await page.waitForNetworkIdle();
    await mainSequence(page);

    // CLEANUPS

    if (fails) {
      await ss(page);
      await browser.close();

      return;
    }

    await browser.close();
  })
})();
