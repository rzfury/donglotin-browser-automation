import { ElementHandle, Page } from 'puppeteer';
import { SELECTORS } from './selectors';
import { dumpstr, getDateForFilename, wait } from '~/utils';
import { parseMessageForUrl } from './parse-message';
import { cdnExtractor } from '~/utils/extractor';
import doReply from './do-reply';
import moveToDone from './move-to-done';

export default async function evaluateInboxes(page: Page, inbox: ElementHandle<Element>) {
  await page.waitForNetworkIdle();

  const inboxSender = { name: '', desc: '' };
  await inbox.$(SELECTORS.InboxItemName)
    .then(async nameEl => {
      inboxSender.name = await nameEl?.evaluate((el) => el.textContent) || '';
    });
  await inbox.$(SELECTORS.InboxItemAttachmentDesc)
    .then(async descEl => {
      inboxSender.desc = await descEl?.evaluate((el) => el.textContent) || '';
    });
  console.log('[MAIN SEQUENCE] Sender identified as: ', inboxSender.name);

  if (inboxSender.desc.includes('mengirim sebuah grup')) {
    console.log('[MAIN SEQUENCE] Sender send probably a group video, this is not quite working. Adding to log and move on.');
    await dumpstr(JSON.stringify(inboxSender), `failures/${inboxSender.name}_-_${getDateForFilename()}.txt`);
    const checkBtn = await inbox.$(SELECTORS.InboxItemMoveToDoneBtn);
    await checkBtn?.click();
    return;
  }

  if (!(
    inboxSender.desc.includes('mengirimkan sebuah') ||
    inboxSender.desc.includes('mengirim lampiran') ||
    inboxSender.desc.includes('facebook.com')
  )) {
    console.log('[MAIN SEQUENCE] Sender just chatting, move chat to done and move on.');
    await inbox.$eval(SELECTORS.InboxItemMoveToDoneBtn, el => (el as HTMLElement).click());
    return;
  }

  await inbox.click();

  await page.waitForNetworkIdle();

  const annoyingBtn = await page.$('[data-pagelet="BizInboxMessengerMessageListContainer"] button[type="button"][aria-disabled="false"]');
  const isItTidak = await annoyingBtn?.evaluate(el => el.textContent === 'Tidak');
  if (isItTidak) {
    await annoyingBtn?.click();
    await page.waitForNetworkIdle();
  }

  try {
    console.log('[MAIN SEQUENCE] Parsing Url...');
    const supposedUrl = await parseMessageForUrl(page);

    if (supposedUrl?.startsWith('https://www.facebook.com')) {
      console.log('[MAIN SEQUENCE] Extracting CDN...');
      const cdn = await cdnExtractor(supposedUrl);

      console.log('[MAIN SEQUENCE] Replying...');
      await doReply(page, cdn);

      console.log('[MAIN SEQUENCE] [SUCCESS] Message has been sent to ' + inboxSender.name + '!');
      await moveToDone(page);
      return;
    }

    // TODO: handle weird cases...
  }
  catch (err) {
    console.log('[MAIN SEQUENCE] [ERROR] An error occured while processing message from ' + inboxSender.name);
    console.error(err);
    console.log('[MAIN SEQUENCE] Moving on for now.');
    return;
  }
}
