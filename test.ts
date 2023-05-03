import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import { cdnExtractor } from '~/utils/extractor';

//https://www.facebook.com/sandi.ptr.108/videos/147216521487976?idorvanity=215896559747844

async function app() {
  const ua = new UserAgent({ deviceCategory: 'mobile', platform: 'iPhone' }).toString();
  console.log('USER-AGENT: ', ua);

  const testUrl = 'https://www.facebook.com/sandi.ptr.108/videos/147216521487976?idorvanity=215896559747844';

  await axios.get(testUrl)
    .then(async res => {
      const html = res.data;
      const $ = cheerio.load(html);

      const cdn = await cdnExtractor(testUrl);

      console.log(cdn);

      // fs.writeFileSync('html-dump-reels.html', html)
    });
}

app();
