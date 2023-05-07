import { Page } from 'puppeteer';
import { wait } from '~/utils';

export default async function doReplyError(page: Page, message: string) {
  await page.type('[data-pagelet="BizP13NInboxMessengerDetailView"] textarea[type="text"]', message);

  await wait(800);
  await page.click('[aria-label="Kirim"][role="button"]');

  await page.waitForNetworkIdle();
}
