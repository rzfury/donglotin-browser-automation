import { Page } from 'puppeteer';
import { wait } from '~/utils';

export default async function doReply(page: Page, message: string) {
  await page.evaluate((responseMessage) => {
    const text = responseMessage;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
    }
    else {
      const cb = (cbe: ClipboardEvent) => {
        cbe.preventDefault()
        cbe.clipboardData?.setData('text/plain', text)
      }
      document.addEventListener('copy', cb)
      document.execCommand('copy')
      document.removeEventListener('copy', cb)
    }
  }, message);

  await page.click('[data-pagelet="BizP13NInboxMessengerDetailView"] textarea[type="text"]');
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('V');
  await page.keyboard.up('ControlLeft');

  await wait(800);
  await page.click('[aria-label="Kirim"][role="button"]');

  await page.waitForNetworkIdle();
}
