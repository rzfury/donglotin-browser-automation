import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import UserAgent from 'user-agents';
import { cdnExtractor } from '~/utils/extractor';

//https://www.facebook.com/reel/242188625030504

async function app() {
  const ua = new UserAgent({ deviceCategory: 'mobile', platform: 'iPhone' }).toString();
  console.log('USER-AGENT: ', ua);

  const testUrl = 'https://m.facebook.com/reel/242188625030504';

  await axios.get(testUrl)
    .then(async res => {
      const html = res.data;
      const $ = cheerio.load(html);

      const act = $('form#login_form').attr('action')!;

      const url = decodeURIComponent(act.replace('/login/device-based/regular/login/?next=', ''));

      const cdn = await cdnExtractor(url);

      console.log(cdn);

      // fs.writeFileSync('html-dump-reels.html', html)
    });
}

app();
