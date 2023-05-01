import { config } from 'dotenv';
import { CronJob } from 'cron';
import AppState from '~/utils/state';
import browserBoot from '~/browser-boot';

config();

(() => {
  const job = new CronJob(
    '*/5 * * * *', //Every 5 minutes
    function() {
      if (AppState.browserRunning) {
        console.log('[CRONJOB] Browser still running, going to wait for next schedule.')
      }
      else {
        browserBoot();
      }
    },
    null,
    true,
    'Asia/Jakarta'
  );

  job.start();
})();
