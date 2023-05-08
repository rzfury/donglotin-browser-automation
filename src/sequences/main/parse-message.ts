import { ElementHandle, Page } from 'puppeteer';
import { SELECTORS } from './selectors';
import { wait } from '~/utils';

export async function parseMessageForUrl(page: Page) {
  const messageContainer = await page.$(SELECTORS.MessageContainer);

  if (messageContainer) {
    const messageCell = await messageContainer?.$(SELECTORS.MessageLastMessageInList2);
    let supposedUrl: string = await messageCell?.evaluate(el => el.textContent) || '';

    console.log('[BROWSER.MAIN.MSG_URL_PARSER] Supposed URL: ' + supposedUrl);

    if (supposedUrl?.includes('facebook.com') || supposedUrl?.includes('fb.watch')) {
      console.log('[BROWSER.MAIN.MSG_URL_PARSER] Latest chat is direct link.');
      console.log('[BROWSER.MAIN.MSG_URL_PARSER] ' + supposedUrl);
      return supposedUrl;
    }

    console.log('[BROWSER.MAIN.MSG_URL_PARSER] Latest chat is a card, getting the card\'s url...');

    const messageCellVideo = await messageContainer?.$(`${SELECTORS.MessageLastMessageInList2} a`) as (ElementHandle<HTMLAnchorElement> | null | undefined);

    let messageCellVideoHref = await messageCellVideo?.evaluate(el => el.href) || '';
    if (messageCellVideoHref.includes('https://l.facebook.com/l.php')) {
      const url = new URL(messageCellVideoHref);
      messageCellVideoHref = url.searchParams.get('u') || '';
    }

    if (messageCellVideoHref.length == 0) {
      await messageCellVideo?.click();
      await wait(5000);

      const pages = await page.browser().pages();
      supposedUrl = pages[2].url();
      await pages[2].close();

      return supposedUrl;
    }

    if (messageCellVideoHref.includes('facebook.com')) {
      if (messageCellVideoHref.startsWith('https://www.facebook.comhttps/business')) {
        supposedUrl = messageCellVideoHref.replace('facebook.comhttps/business.', '');

        const page2 = await page.browser().newPage();
        await page2.bringToFront();
        await page2.goto(supposedUrl);
        await wait(5000);
        supposedUrl = page2.url();
        await page2.close();
      }
      else {
        await messageCellVideo?.click();
        await wait(5000);

        const pages = await page.browser().pages();
        supposedUrl = pages[2].url();
        await pages[2].close();
      }

      await page.bringToFront();
    }

    if (supposedUrl?.startsWith('https://www.facebook.com')) {
      return supposedUrl;
    }
  }
}
