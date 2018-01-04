/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import Slider from 'components/Slider';
import Switch from 'components/Switch';

// this doesn't belong here, but it does generally demonstrate that this works..
import { HAProxyInstance } from '../../models/HAProxy.ts';
let s = new HAProxyInstance('http://localhost:10000', null, null, "Local!");
s.Proxies()
  .then(f => console.log(f))
  .catch(e => console.log(e));

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      slider: "100",
      enabled: false,
    };
  }

  updateSlider = (event) => {
    this.setState({ slider: event.value }, () => {
       console.log('slider set to', event.value);
    });
  }

  updateToggle = (event) => {
    this.setState({ enabled: event.checked }, () => {
      console.log('checked set to', event.checked, 'for', event.target);
    });
  }

  render() {
    let { slider, enabled } = this.state;

    return (
      <div>
        <h1>HomePage Component</h1>
        <Slider value={slider} onChange={this.updateSlider} />
        <Switch checked={enabled} onChange={this.updateToggle} data-id={"test"} />
      </div>
    );
  }
}
