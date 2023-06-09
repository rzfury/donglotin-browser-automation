import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import AppState from '~/utils/state';
import { wait } from './utils';

export default async function browserBoot(onBooted: (browser: Browser) => Promise<void>) {
  const agent = new UserAgent(/Mozilla.*Win64.*Chrome.*112/);
  AppState.agents.set('default', agent);

  puppeteer.use(Stealth());
  await puppeteer.launch({
    headless: process.env.ENVIRONMENT === 'development' ? false : 'new',
    args: ['--remote-debugging-port=16969', '--disable-notifications'],
  }).then(async browser => {
    console.log('[BROWSER] Browser booted!');

    AppState.fails = false;
    AppState.needToClose = false;
    AppState.setBrowser(browser);

    browser.once('RZF_FATAL_CLOSE', async event => {
      console.log('[BROWSER.ERROR] Browser encountered a fatal error and need to be closed!');
      AppState.fails = true;
      AppState.needToClose = true;

      await wait(3000);

      await browser.close();
    });

    browser.once('RZF_DANGER_REBOOT', async event => {
      console.log('[BROWSER.ERROR] Browser need to be rebooted!');
      AppState.doReboot = true;
      AppState.needToClose = true;

      await wait(3000);

      await browser.close();
    });

    browser.defaultBrowserContext().overridePermissions(
      'https://www.facebook.com',
      [
        'notifications',
        'clipboard-read',
        'clipboard-write'
      ]
    );

    browser.defaultBrowserContext().overridePermissions(
      'https://m.facebook.com',
      [
        'notifications',
        'clipboard-read',
        'clipboard-write'
      ]
    );

    await onBooted(browser);
  });

  Promise.resolve();
};
