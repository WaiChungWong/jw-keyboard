import React, { Component } from "react";
import { render } from "react-dom";

import Keyboard from "./module";

import "./style.css";

class Demo extends Component {
  constructor(props) {
    super(props);

    this.keyboard = new Keyboard();

    this.state = { keyCodesPressed: [] };
  }

  _updateKeyboard(keyboard) {
    const { keyCodesPressed } = keyboard;
    this.setState({ keyCodesPressed });
  }

  componentDidMount() {
    this.keyboard.attach(this.demo);

    this.keyboard.onKeyDown(e => this._updateKeyboard(e.keyboard));
    this.keyboard.onKeyUp(e => this._updateKeyboard(e.keyboard));
  }

  componentWillUnmount() {
    this.keyboard.detach();
  }

  render() {
    const { keyCodesPressed } = this.state;

    return (
      <div ref={d => (this.demo = d)} id="demo">
        <div className="title">Press any keys to get the keycode</div>
        {keyCodesPressed.map(key => (
          <div key={key} className="key">
            {key}
          </div>
        ))}
      </div>
    );
  }
}

render(<Demo />, document.getElementById("root"));
