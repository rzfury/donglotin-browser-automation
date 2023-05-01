import { Page } from 'puppeteer';
import { wait } from '~/utils';

export default async function doReply(page: Page, cdnUrl: any) {
  // let responseMessage: string[] = [];
  // if (typeof (cdnUrl.hdSrc) === 'string') {
  //   responseMessage.push('Kualitas: HD dan Standar.');
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push(`HD: ${cdnUrl.hdSrc}`);
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push(`Standar: ${cdnUrl.sdSrcNoRateLimit}`);
  // }
  // else {
  //   responseMessage.push('Kualitas: HD dan Standar.');
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push('NEW_LINE');
  //   responseMessage.push(`Standar: ${cdnUrl.sdSrcNoRateLimit}`);
  // }

  // for(const msg of responseMessage) {
  //   if (msg === 'NEW_LINE') {
  //     await page.keyboard.down('Shift');
  //     await page.keyboard.press('Enter');
  //     await page.keyboard.up('Shift');
  //     continue;
  //   }
  //   await page.type('[data-pagelet="BizP13NInboxMessengerDetailView"] textarea[type="text"]', msg, { delay: 1 });
  // }

  const n = String.fromCharCode(13);
  let responseMessage = '';
  if (typeof (cdnUrl.hdSrc) === 'string') {
    responseMessage = `Kualitas: HD dan Standar.${n}${n}HD: ${cdnUrl.hdSrc}${n}${n}Standar: ${cdnUrl.sdSrcNoRateLimit}`;
  }
  else {
    responseMessage = `Kualitas: Standar.${n}${n}${cdnUrl.sdSrcNoRateLimit}`;
  }

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
  }, responseMessage);

  await page.click('[data-pagelet="BizP13NInboxMessengerDetailView"] textarea[type="text"]');
  await page.keyboard.down('ControlLeft');
  await page.keyboard.press('V');
  await page.keyboard.up('ControlLeft');

  await wait(800);
  await page.click('[aria-label="Kirim"][role="button"]');

  await page.waitForNetworkIdle();
}
