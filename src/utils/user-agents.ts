import UserAgent from 'user-agents';

export function random() {
  return new UserAgent().toString();
}

export function ios() {  
  return new UserAgent({ deviceCategory: 'mobile', platform: 'iPhone' }).toString();
}

export function macos_specific_a() {
  return new UserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15').toString();
}

export function ios_specific_a() {
  return new UserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1').toString();
}

export function win_specific_a() {
  return new UserAgent('Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.13 (KHTML, like Gecko) Chrome/24.0.1290.1 Safari/537.13').toString()
}
