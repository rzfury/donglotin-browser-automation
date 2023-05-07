import { StoreonStore, createStoreon } from 'storeon';
import { idgen } from '~/utils/idgen';

interface AppStoreState {
  sessionId: string;

  serverOnline: boolean;
  serverBootTime: number;

  mentionOnline: boolean;
  mentionBootTIme: number;

  messagingOnline: boolean;
  messagingBootTime: number;
  messagingLogs: string[];
  messagingReports: string[];
  messagingDoReboot: boolean;
}

interface AppStoreEvents {
  'app.server.status': boolean;
  'app.server.bootTime': number;

  'app.mention.status': boolean;
  'app.mention.bootTime': number;

  'app.messaging.status': boolean;
  'app.messaging.bootTime': number;
  'app.messaging.logs': string;
  'app.messaging.reports': string;
  'app.messaging.doReboot': boolean;
}

type AppStore = StoreonStore<AppStoreState, AppStoreEvents>;

function appstate(store: AppStore) {
  store.on('@init', () => {
    const sessionId = idgen();
    const time = Date.now();

    return {
      sessionId,
      serverOnline: false,
      serverBootTime: time,
      
      mentionOnline: false,
      mentionBootTime: time,

      messagingOnline: false,
      messagingBootTime: time,
      messagingLogs: [],
      messagingReports: []
    };
  });

  // server

  store.on('app.server.status', (_, serverOnline) => {
    return ({ serverOnline });
  });

  // mention

  store.on('app.mention.status', (_, mentionOnline) => {
    return ({ mentionOnline });
  });

  // messaging

  store.on('app.messaging.status', (_, messagingOnline) => {
    return ({ messagingOnline });
  });

  store.on('app.messaging.logs', ({ messagingLogs }, newLog) => {
    const logs = messagingLogs.slice();
    if (messagingLogs.length > 100)
      logs.shift();
    logs.push(newLog);
    return { messagingLogs: logs };
  });

  store.on('app.messaging.reports', ({ messagingReports }, report) => {
    const reports = messagingReports.slice();
    reports.push(report);
    return { messagingReports: reports };
  });
}

export const store = createStoreon<AppStoreState, AppStoreEvents>([appstate])
