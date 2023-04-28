import { config } from 'dotenv';
import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';

config();

(() => {
  const agent = new UserAgent(/Mozilla.*Win64.*Chrome.*112/);
  // console.log(agent.toString())

  puppeteer.use(Stealth());
  puppeteer.launch({
    headless: false,
    args: ['--remote-debugging-port=16969'],
  }).then(async browser => {
    const page = await browser.newPage();
    await page.setUserAgent(agent.toString());
    await page.setViewport({width: 1336, height: 768});

    console.log('Loading Page...');
    await page.goto('https://www.facebook.com/');
    // await page.goto('https://arh.antoinevastel.com/bots/areyouheadless');
    await page.waitForNetworkIdle();

    await wait(1000000);
    
    console.log('Typing Cred...');
    await page.focus('#email');
    await wait(500);
    await page.keyboard.type(process.env.FACEBOOK_EMAIL!.trim(), { delay: 100 });
    await wait(500);
    await page.keyboard.press('Tab');
    await wait(500);
    await page.keyboard.type(process.env.FACEBOOK_PASS!.trim(), { delay: 100 });

    await wait(1000);

    console.log('Logging in...');
    await page.click('button[name="login"][type="submit"]');

    await page.waitForNetworkIdle();
  
    await ss(page);
  
    await browser.close();
  })
})();

function wait(ms: number) {
  return new Promise(y => setTimeout(y, ms));
}

async function ss(page: Page) {
  return await page.screenshot({
    path: `./${Date.now()}-debug.png`
  })
}
