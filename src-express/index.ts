import express from 'express';
import AppState from '~/utils/state';

export default function server() {
  return new Promise<void>(resolve => {
    const app = express();

    app.get('/ping', (req, res) => {
      res.json({ pong: req.header('date') });
    });

    app.get('/state', (_, res) => {
      try {
        console.log('[EXPRESS] Test on accessing app state, value should be "Donglotin"');

        if (AppState.APP_NAME === 'DONGLOTIN')
          res.json({ APP_NAME: AppState.APP_NAME });

        throw 0;
      }
      catch(err) {
        res.json({ error: 'Cannot get app state.' });
      }
    })

    app.listen(7000);

    console.log('[EXPRESS] Server is listening to 7000...')

    resolve();
  })
}
