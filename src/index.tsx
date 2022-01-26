import React from 'react';
import ReactDOM from 'react-dom';
import RingCentral from '@rc-ex/core';
import RCV from 'ringcentral-video';

import './index.css';

import {init} from './babylon';

class App extends React.Component {
  render() {
    return <canvas id="canvas"></canvas>;
  }

  componentDidMount() {
    init();
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App />, container);

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });

  const createVideoElement = (e: RTCTrackEvent) => {
    const videoElement = document.createElement('video') as HTMLVideoElement;
    videoElement.id = `video-${e.track.id}`;
    videoElement.autoplay = true;
    videoElement.setAttribute('width', '400');
    document.body.appendChild(videoElement);
    videoElement.srcObject = e.streams[0];
  };
  const removeVideoElement = (e: RTCTrackEvent) => {
    document.getElementById(`video-${e.track.id}`)?.remove();
  };

  // sample: const rcv = new RCV(rc, 987612345);
  const rcv = new RCV(rc, process.env.RINGCENTRAL_SHORT_MEETING_ID!);

  rcv.on('videoTrackEvent', (e: RTCTrackEvent) => {
    createVideoElement(e);
    e.track.onmute = () => {
      removeVideoElement(e);
    };
    e.track.onunmute = () => {
      createVideoElement(e);
    };
  });

  await rcv.join();
};

main();
