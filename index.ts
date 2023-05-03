import { config } from 'dotenv';
import browserBoot from '~/browser-boot';
import spawnPage from '~/spawn-page';
import AppState from '~/utils/state';
import server from './src-express';

config();

async function app() {
  server();

  await browserBoot(
    async browser => {
      await spawnPage();
    }
  );

  if (AppState.doReboot) {
    AppState.doReboot = false;
    await app();
  }
}

app();
