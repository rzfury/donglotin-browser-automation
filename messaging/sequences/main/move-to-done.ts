// [style="min-height: 0px;"] [aria-busy="false"][tabindex="0"]

import { Page } from 'puppeteer';

export default async function moveToDone(page: Page) {
  await page.click('[style="min-height: 0px;"] [aria-busy="false"][tabindex="0"]');
  await page.waitForSelector('[class*="uiContextualLayerParent"] [role="menu"]');
  await page.click('[class*="uiContextualLayerParent"] [role="menu"] > :last-child [role="menuitem"]');
  await page.waitForNetworkIdle();
}
