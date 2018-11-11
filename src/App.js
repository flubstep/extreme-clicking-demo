import React, { Component } from 'react';

import DismissableNotification from './DismissableNotification';
import ExtremeClickingImageLabeler from './ExtremeClickingImageLabeler';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <DismissableNotification message="Got it!">
            <div>
              <i>BTW: Doesn't work too well on mobile web yet.</i>
            </div>
            <div className="section">
              Extreme clicking is a method of bounding box annotation that is done by having the annotator
              click on four points to label a rectangle: the topmost, leftmost, rightmost, and bottommost
              point of every object to be labeled. Try picking out a piece of fruit and clicking on the top,
              left, bottom, and right points to draw a bounding box around it.
            </div>
          </DismissableNotification>
          <ExtremeClickingImageLabeler
            height={this.state.height}
            width={this.state.width}
            imageSrc="/Dish_with_fruits.jpg"
          />
        </div>
      </div>
    );
  }
}

export default App;
