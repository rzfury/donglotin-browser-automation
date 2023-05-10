import { config } from 'dotenv';
import browserBoot from '~/browser-boot';
import spawnPage from '~/spawn-page';
import AppState from '~/utils/state';
import server from './src-express';

config();

async function app() {
  server();
  await messaging();
}

async function messaging() {
  await browserBoot(
    async browser => {
      await spawnPage();
      setTimeout(() => {
        browser.emit('RZF_DANGER_REBOOT');
      }, 1000 * 60 * 30);
    }
  );

  if (AppState.doReboot) {
    AppState.doReboot = false;
    await messaging();
  }
}

app();
