import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './BoundingBoxInfo.css';

library.add(faTrash);

export default class BoundingBoxInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      hovering: false,
    };
  }

  handleClick = (e) => {
    e.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <div
        className="BoundingBoxInfo"
        onClick={this.handleClick}
            style={{
          backgroundColor: this.state.hovering ? '#9ccc65' : null
        }}
        >
        <h4>{this.props.box.label || "Label TBD"}</h4>
        {
          this.state.expanded && (
            <div className="info-expanded-container info-section">
              <ul>
                <li><span className="info-key">Top:</span> {this.props.box.top}</li>
                <li><span className="info-key">Bottom:</span> {this.props.box.bottom}</li>
                <li><span className="info-key">Left:</span> {this.props.box.left}</li>
                <li><span className="info-key">Right:</span> {this.props.box.right}</li>
              </ul>
              <div className="info-actions info-section">
                <span onClick={this.props.onDelete} className="btn">
                  <FontAwesomeIcon className="btn-icon" icon="trash" />
                  <span className="btn-label">Delete</span>
                </span>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}