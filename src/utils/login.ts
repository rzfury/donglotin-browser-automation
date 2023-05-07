import { promises as fs, existsSync } from 'node:fs';
import { Page } from "puppeteer";
import { wait } from ".";

export async function loginAndSaveCookies(page: Page, attempts: number = 0) {
  console.log(`[BROWSER.LOGIN] Attempting to login (Attempts: ${attempts})`);
  return new Promise<boolean>(async (resolve, reject) => {

    console.log('[BROWSER.LOGIN] Typing Cred...');
    await page.focus('#email');
    await wait(500);
    await page.keyboard.type(process.env.FACEBOOK_EMAIL!.trim(), { delay: 100 });
    await wait(500);
    await page.keyboard.press('Tab');
    await wait(500);
    await page.keyboard.type(process.env.FACEBOOK_PASS!.trim(), { delay: 100 });
    await wait(1000);

    console.log('[BROWSER.LOGIN] Logging in...');
    await page.click('#loginbutton');

    console.log('[BROWSER.LOGIN] Waiting for Element [data-pagelet="BizKitPresenceSelector"]');
    if (await page.waitForSelector('[data-pagelet="BizKitPresenceSelector"]')) {
      const kueh = await page.cookies();
      if (!existsSync('./stores')) await fs.mkdir('./stores'); 
      await fs.writeFile('./stores/cookies.json', JSON.stringify(kueh, null, 2));
      resolve(true);
    }
    else {
      if (attempts < 3) {
        await loginAndSaveCookies(page, ++attempts).catch(reject);
      }
      else {
        reject();
      }
    }
  })
}