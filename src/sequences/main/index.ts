import { Page } from "puppeteer";
import evaluateInboxes from "./evaluate-inboxes";
import { SELECTORS } from "./selectors";
import { wait } from "~/utils";

export default async function mainSequence(page: Page) {
  console.log('[BROWSER.MAIN] Starting sequences...')

  console.log('[BROWSER.MAIN] Evaluating Inboxes...');
  
  let lastInboxInList;
  while (true) {
    lastInboxInList = await page.$(`${SELECTORS.InboxContainer} > ${SELECTORS.InboxItemLast}`);
    if (lastInboxInList !== null) {
      await evaluateInboxes(page, lastInboxInList);
      await page.waitForNetworkIdle();
      continue;
    }

    console.log('[BROWSER.MAIN] No more inbox to process, will wait for 30 secs.');
    await wait(30_000);
  }
}
