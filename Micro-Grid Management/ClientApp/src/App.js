import React, { Component } from 'react';
import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
        <div>
            <h1>Big Button to do button things</h1>
            <button type="button" className="btn btn-dark">Dark</button>
        </div>
    );
  }
}
