class AppState {
  public static browserRunning: boolean = false;

  public static fatalFails: boolean = false;

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
