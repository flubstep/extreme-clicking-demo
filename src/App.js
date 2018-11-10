import React, { Component } from 'react';
import ExtremeClickingImageLabeler from './ExtremeClickingImageLabeler';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 600,
      width: 800,
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === '1') {
      this.setState({ height: 600, width: 800 });
    } else if (e.key === '2') {
      this.setState({ height: 800, width: 1000 });
    } else if (e.key === '3') {
      this.setState({ height: 1000, width: 1200 });
    }
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
