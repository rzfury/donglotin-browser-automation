import { Page } from "puppeteer";
import evaluateInboxes from "./evaluate-inboxes";
import { SELECTORS } from "./selectors";
import { wait } from "~/utils";
import AppState from "~/utils/state";

export default async function mainSequence(page: Page) {
  console.log('[BROWSER.MAIN] Starting sequences...')

  console.log('[BROWSER.MAIN] Evaluating Inboxes...');
  
  let lastInboxInList;
  while (!AppState.needToClose) {
    lastInboxInList = await page.$(`${SELECTORS.InboxContainer} > ${SELECTORS.InboxItemLast}`);
    if (lastInboxInList !== null) {
      await evaluateInboxes(page, lastInboxInList);
      await page.waitForNetworkIdle();
      continue;
    }
    await wait(10_000);
  }
}
