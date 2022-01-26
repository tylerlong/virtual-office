import localforage from 'localforage';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';

import {
  CODE,
  CODE_VERIFIER_KEY,
  REDIRECT_URI,
  TOKEN_INFO_KEY,
} from './constants';
import {checkSavedToken} from './utils';
import rc from './ringcentral';

export class Store {
  ready = false;
  hasToken = false;
  loginUrl = '';
  inMeeting = false;
  meetingId = process.env.RINGCENTRAL_MEETING_ID ?? '';

  get isMeetingIdValid() {
    return /\b\d{9}\b/.test(this.meetingId);
  }

  // right after page loaded
  async init() {
    if (CODE === null) {
      this.hasToken = await checkSavedToken();
      this.ready = true;
    } else {
      await this.authorize();
      await localforage.setItem(TOKEN_INFO_KEY, rc.token);
      window.location.replace(REDIRECT_URI);
    }
  }

  // user click login button
  async login() {
    if (this.loginUrl === '') {
      const authorizeUriExtension = new AuthorizeUriExtension();
      await rc.installExtension(authorizeUriExtension);
      this.loginUrl = authorizeUriExtension.buildUri({
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
      });
      const codeVerifier = authorizeUriExtension.codeVerifier;
      await localforage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    }
    window.location.replace(this.loginUrl);
  }

  // user click logout button
  async logout() {
    await localforage.removeItem(TOKEN_INFO_KEY);
    window.location.replace(REDIRECT_URI);
  }

  // user redirected back from RC login page
  async authorize() {
    await rc.authorize({
      code: CODE!,
      redirect_uri: REDIRECT_URI,
      code_verifier:
        (await localforage.getItem<string>(CODE_VERIFIER_KEY)) ??
        'fake-code-verifier',
    });
  }

  async joinMeeting() {}
}