import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import AppState from '~/utils/state';

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
    AppState.setBrowser(browser);

    browser.once('RZF_FATAL_CLOSE', event => {
      console.log('[BROWSER.ERROR] Browser encountered a fatal error and need to be closed!');
      AppState.fails = true;
      browser.close();
    });

    browser.once('RZF_DANGER_REBOOT', event => {
      console.log('[BROWSER.ERROR] Browser encountered an error and need to be rebooted!');
      AppState.fails = true;
      AppState.doReboot = true;
      browser.close();
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
