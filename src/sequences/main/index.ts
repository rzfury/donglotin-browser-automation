import { Page } from "puppeteer";
import evaluateInboxes from "./evaluate-inboxes";
import { SELECTORS } from "./selectors";

export default async function mainSequence(page: Page) {
  console.log('[MAIN SEQUENCE] Starting sequences...')

  console.log('[MAIN SEQUENCE] Evaluating Inboxes...');
  
  let lastInboxInList;
  while (true) {
    lastInboxInList = await page.$(`${SELECTORS.InboxContainer} > ${SELECTORS.InboxItemLast}`);
    if (lastInboxInList !== null) {
      await evaluateInboxes(page, lastInboxInList);
      await page.waitForNetworkIdle();
      continue;
    }
    break;
  }

  console.log('[MAIN SEQUENCE] No more inbox to process!');
}
