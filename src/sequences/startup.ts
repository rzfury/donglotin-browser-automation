import { Page } from "puppeteer";
import { ss } from "~/utils";
import { loginAndSaveCookies } from "~/utils/login";
import AppState from "~/utils/state";

export default async function startup(page: Page) {
  console.log('Loading Page...');

  await page.goto('https://business.facebook.com/latest/inbox/all?asset_id=118785594522963');

  if (await page.waitForSelector('#loginbutton', { timeout: 10000 }).catch(() => {})) {
    await loginAndSaveCookies(page)
      .then(() => {
        console.log('[LOGIN] Login Success!!');
      })
      .catch(async () => {
        await ss(page);
        console.log('[LOGIN] Failed to login.');
        AppState.fatalFails = true;
      });
  }
}