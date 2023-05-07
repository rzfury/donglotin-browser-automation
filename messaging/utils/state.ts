import { Browser } from 'puppeteer';
import UserAgent from 'user-agents';

class AppState {
  public static readonly APP_NAME = 'DONGLOTIN';

  public static fails: boolean = false;
  public static doReboot: boolean = false;

  private static _browser: Browser | null = null;
  public static browserRunning: boolean = false;
  public static getBrowser() {
    return this._browser as Browser;
  }
  public static setBrowser(browser: Browser) {
    this._browser = browser;
  }

  public static agents: Map<string, UserAgent> = new Map();

  public static urlHandle: string = '';
  public static getUrlHandle = () => {
    return new Promise((resolve) => {
      let timeout = setInterval(() => {
        if (AppState.urlHandle.length > 0) {
          const _urlHandle = AppState.urlHandle.slice();
          AppState.urlHandle = '';
          clearInterval(timeout);
          resolve(_urlHandle);
        }
      }, 100);
    });
  }
}

export default AppState;
