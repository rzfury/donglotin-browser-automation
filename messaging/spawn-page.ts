import { promises as fs, existsSync } from 'node:fs';
import mainSequence from './sequences/main';
import { loginAndSaveCookies } from './utils/login';
import AppState from './utils/state';
import { wait } from './utils';

export default async function spawnPage() {
  const browser = AppState.getBrowser();
  const agent = AppState.agents.get('default')!;

  const page = await browser.newPage();
  await page.setUserAgent(agent.toString());
  await page.setViewport({ width: 1336, height: 768 });

  if (existsSync('./stores/cookies.json')) {
    const cookiesString = await fs.readFile('./stores/cookies.json');
    const cookies = JSON.parse(cookiesString.toString());
    await page.setCookie(...cookies);
  }

  await page.goto('https://business.facebook.com/latest/inbox/all?asset_id=118785594522963');

  if (await page.waitForSelector('#loginbutton', { timeout: 5000 }).catch(() => {})) {
    await loginAndSaveCookies(page)
      .then(() => {
        console.log('[LOGIN] Login Success!!');
      })
      .catch(async () => {
        console.log('[BROWSER.PAGE] Cannot login, gonna try again later');
        browser.emit('RZF_DANGER_REBOOT');
      });
  }

  if (AppState.fails) return;

  await wait(5000);

  await mainSequence(page);
}
