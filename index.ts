import { config } from 'dotenv';
import server from '~express/index';
import messaging from '~messaging/index';

config();

async function app() {
  server();
  await messaging();
}

app();
