import { Page } from 'puppeteer';
import { SELECTORS } from './selectors';
import { wait } from '~/utils';

export async function parseMessageForUrl(page: Page) {
  const messageContainer = await page.$(SELECTORS.MessageContainer);

  if (messageContainer) {
    const messageListContainer = await messageContainer.$('div > div > div + div');
    const messageList: string[] = await messageListContainer?.evaluate((el) => {
      return Array.from(el.children).map(ch => ch.getAttribute('class') || '');
    }) as string[];

    let lastMessageIndex = messageList.length - 1;
    while(messageList[lastMessageIndex] === '') {
      lastMessageIndex--;
      if (lastMessageIndex < 0) {
        return;
      }
    }

    lastMessageIndex++;

    const messageCellSelector = SELECTORS.MessageLastMessageInList.replace('REPLACE_LAST', lastMessageIndex.toString());
    const messageCell = await messageListContainer?.$(messageCellSelector);
    let supposedUrl: string = await messageCell?.evaluate(el => el.textContent) || '';

    if (supposedUrl?.startsWith('https://www.facebook.com') || supposedUrl?.startsWith('https://m.facebook.com')) {
      return supposedUrl;
    }

    const messageCellVideoSelector = `${messageCellSelector} a[role="button"]`;
    const messageCellVideo = await messageListContainer?.$(messageCellVideoSelector);
    await messageCellVideo?.click();
    await wait(5000);
    
    const pages = await page.browser().pages();
    supposedUrl = pages[2].url();
    await pages[2].close();
    console.log();

    await page.bringToFront();

    if (supposedUrl?.startsWith('https://www.facebook.com')) {
      return supposedUrl;
    }
  }
}
