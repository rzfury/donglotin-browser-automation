import { Page } from 'puppeteer';
import { SELECTORS } from './selectors';

// Get Name
// 'div[role="presentation"] > div > div + div > div > div > div > div > div + div > span'
// Move to done
// 'div[role="presentation"] > div > div + div > div + div > div + div > div > a'
// Get description
// 'div[role="presentation"] > div > div + div > div > div + div > div > span > span + span'

export default async function collectInboxes(page: Page) {
  return page.$$(`${SELECTORS.InboxContainer} > ${SELECTORS.InboxItems}`);
}
