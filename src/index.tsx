import React from 'react';
import ReactDOM from 'react-dom';

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
