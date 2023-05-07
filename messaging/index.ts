import browserBoot from '~/browser-boot';
import spawnPage from '~/spawn-page';
import { store } from '../stores/appstore';

export default async function messaging() {
  return await new Promise<void>(async resolve => {
    store.dispatch('app.messaging.doReboot', false);

    await browserBoot(
      async browser => {
        store.dispatch('app.messaging.status', true);
        await spawnPage();
      }
    );

    if (store.get().messagingDoReboot) {
      store.dispatch('app.messaging.doReboot', false);
      await messaging();
    }

    resolve();
  })
}
