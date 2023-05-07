import { ElementHandle, Page } from 'puppeteer';
import { SELECTORS } from './selectors';
import { dumpstr, getDateForFilename, wait } from '~/utils';
import { parseMessageForUrl } from './parse-message';
import { cdnExtractor } from '~/utils/extractor';
import doReply from './do-reply';
import moveToDone from './move-to-done';
import doReplyError from './do-reply-error';

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
  console.log('[EVALUATING INBOX] Sender identified as: ', inboxSender.name);

  try {
    await inbox.click();

    await page.waitForNetworkIdle();

    if (inboxSender.desc.includes('mengirim sebuah grup')) {
      console.log('[EVALUATING INBOX] Sender probably send a group video, this is not quite working. Adding to log and move on.');
      await dumpstr(JSON.stringify(inboxSender), `failures/${inboxSender.name}_-_${getDateForFilename()}.txt`);
      throw 'group-post';
    }

    if (!(
      inboxSender.desc.includes('mengirimkan sebuah') ||
      inboxSender.desc.includes('mengirim lampiran') ||
      inboxSender.desc.includes('facebook.com')
    )) {
      console.log('[EVALUATING INBOX] Sender just chatting, move chat to done and move on.');
      await moveToDone(page);
      return;
    }

    const annoyingBtn = await page.$('[data-pagelet="BizInboxMessengerMessageListContainer"] button[type="button"][aria-disabled="false"]');
    const isItTidak = await annoyingBtn?.evaluate(el => el.textContent === 'Tidak');
    if (isItTidak) {
      await annoyingBtn?.click();
      await page.waitForNetworkIdle();
    }

    console.log('[EVALUATING INBOX] Parsing Url...');
    const supposedUrl = await parseMessageForUrl(page);

    if (supposedUrl?.startsWith('https://www.facebook.com') || supposedUrl?.startsWith('https://m.facebook.com')) {
      console.log('[EVALUATING INBOX] Extracting CDN...');
      const cdn = await cdnExtractor(supposedUrl);

      console.log('[EVALUATING INBOX] Replying...');
      await doReply(page, cdn);

      console.log('[EVALUATING INBOX] [SUCCESS] Message has been sent to ' + inboxSender.name + '!');
      await moveToDone(page);
      return;
    }

    // TODO: handle weird cases...

    console.log('[EVALUATING INBOX] Weird case is not handled!');
  }
  catch (err) {
    await page.bringToFront();

    console.log('[EVALUATING INBOX] [ERROR] An error occured while processing message from ' + inboxSender.name);
    console.error(err);

    console.log('[EVALUATING INBOX] Telling sender...');
    await doReplyError(page, 'Tidak bisa mendapatkan download link untuk postingan ini.');

    console.log('[EVALUATING INBOX] [SUCCESS] Message has been sent to ' + inboxSender.name + '!');
    await moveToDone(page);

    console.log('[EVALUATING INBOX] Moving on.');
    return;
  }
}
