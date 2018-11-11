import React, { Component } from 'react';

import './DismissableNotification.css';

export default class DismissableNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true
    };
  }

  render() {
    if (this.state.active) {
      return (
        <div className="DismissableNotification">
          <div className="DismissableNotification--inner">
            <div className="contents">
              { this.props.children }
            </div>
            <div className="actions">
              <div className="btn" onClick={() => this.setState({ active: false })}>
                { this.props.message }
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return false;
    }
  }
}

DismissableNotification.defaultProps = {
  message: "Okay!"
};