import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import {createScene} from './babylon';

class App extends React.Component {
  render() {
    return <canvas id="canvas"></canvas>;
  }

  componentDidMount() {
    createScene();
  }
}

ReactDOM.render(<App />, document.body);
