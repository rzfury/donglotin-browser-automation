import { config } from 'dotenv';
import browserBoot from '~/browser-boot';
import spawnPage from '~/spawn-page';
import AppState from '~/utils/state';

config();

async function app() {
  await messaging();
}

async function messaging() {
  await browserBoot(
    async browser => {
      setTimeout(() => {
        browser.emit('RZF_DANGER_REBOOT');
      }, 1000 * 60 * 30);
      await spawnPage();
    }
  );

  if (AppState.doReboot) {
    AppState.doReboot = false;
    await messaging();
  }
}

app();
