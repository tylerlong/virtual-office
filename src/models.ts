import localforage from 'localforage';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import {debounce} from 'lodash';
import RCV from 'ringcentral-video';

import {
  CODE,
  CODE_VERIFIER_KEY,
  REDIRECT_URI,
  TOKEN_INFO_KEY,
} from './constants';
import {checkSavedToken} from './utils';
import rc from './ringcentral';
import store from './store';
import {init3D} from './babylon';

export class Store {
  ready = false;
  hasToken = false;
  loginUrl = '';
  inMeeting = false;
  streamsReady = false;
  meetingId = process.env.RINGCENTRAL_SHORT_MEETING_ID ?? '';

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

  async joinMeeting() {
    store.inMeeting = true;
    const shortId = this.meetingId.match(/\b\d{9}\b/)![0];
    const rcv = new RCV(rc, shortId);
    const createVideoElement = (e: RTCTrackEvent) => {
      const videoElement = document.createElement('video') as HTMLVideoElement;
      videoElement.id = `video-${e.track.id}`;
      videoElement.autoplay = true;
      videoElement.setAttribute('width', '400');
      videoElement.setAttribute('class', 'video-element');
      document.body.appendChild(videoElement);
      videoElement.srcObject = e.streams[0];
      videoElement.style.display = 'none';
    };
    const removeVideoElement = (e: RTCTrackEvent) => {
      document.getElementById(`video-${e.track.id}`)?.remove();
    };
    const debouncedCreateMetaverse = debounce(
      () => {
        if (!this.streamsReady) {
          this.streamsReady = true;
          init3D();
        }
      },
      10000,
      {
        trailing: true,
        leading: false,
        maxWait: 60000,
      }
    );
    rcv.on('videoTrackEvent', (e: RTCTrackEvent) => {
      createVideoElement(e);
      debouncedCreateMetaverse();
      console.log(e.track.id, 'track');
      e.track.onmute = () => {
        console.log(e.track.id, 'mute');
        removeVideoElement(e);
        debouncedCreateMetaverse();
      };
      e.track.onunmute = () => {
        console.log(e.track.id, 'unmute');
        createVideoElement(e);
        debouncedCreateMetaverse();
      };
    });
    await rcv.join();
  }
}
