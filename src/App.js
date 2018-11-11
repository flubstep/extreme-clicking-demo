import React, { Component } from 'react';
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

  handleKeyDown = (e) => {

  }

  render() {
    return (
      <div className="App">
        <div>
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
