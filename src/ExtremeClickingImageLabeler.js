import React, { Component } from 'react';

import _ from 'lodash';
import BoundingBoxInfo from './BoundingBoxInfo';

import './ExtremeClickingImageLabeler.css';

export default class ExtremeClickingImageLabeler extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      imageDimensions: null,
      imageScaling: null,
      currentBox: [],
      boxes: [],
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidMount() {
    const image = new Image();
    image.src = this.props.imageSrc;
    image.addEventListener('load', () => {
      this.setState({
        imageLoaded: true,
        imageDimensions: {
          naturalHeight: image.naturalHeight,
          naturalWidth: image.naturalWidth,
        }
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.height !== prevProps.height ||
      this.props.width !== prevProps.width
    ) {
      this.handleImageLoad();
    }
    if (this.state.boxes !== prevState.boxes) {
      if (this.props.onUpdate) {
        this.props.onUpdate(this.state.boxes);
      }
    }
  }

  handleKeyDown = (e) => {
    if (e.code === 'Backspace') {
      e.preventDefault();
      this.deleteLast();
    } else if (e.code === 'Escape') {
      e.preventDefault();
      this.clearCurrentSelection();
    }
  }

  handleImageLoad = () => {
    const image = this.refs.image;
    const dims = this.state.imageDimensions;
    this.setState({
      imageScaling: dims.naturalHeight / image.height
    });
  }

  onClick = (e) => {
    const dims = this.state.imageDimensions;
    const S = this.state.imageScaling;
    const { left, top } = this.refs.image.getBoundingClientRect();
    const nextPoint = {
      x: (e.clientX - left) * S,
      y: (e.clientY - top) * S,
    };

    if (nextPoint.x > dims.naturalWidth || nextPoint.y > dims.naturalHeight) {
      return;
    }

    var { currentBox, boxes } = this.state;
    currentBox.push(nextPoint);

    if (currentBox.length === 4) {
      const xs = currentBox.map(p => Math.round(p.x));
      const ys = currentBox.map(p => Math.round(p.y));
      const nextBox = {
        boxId: _.uniqueId(),
        top: Math.min(...ys),
        bottom: Math.max(...ys),
        left: Math.min(...xs),
        right: Math.max(...xs),
      };
      boxes.push(nextBox);
      currentBox = [];
    }
    this.setState({
      currentBox: currentBox,
      boxes: boxes,
    });
  }

  deleteLast = () => {
    const { currentBox, boxes } = this.state;
    if (currentBox.length > 0) {
      currentBox.pop();
      this.setState({
        currentBox: currentBox
      });
    } else if (boxes.length > 0) {
      boxes.pop();
      this.setState({
        boxes: boxes
      });
    }
  }

  handleDeleteBox = (e, toDelete) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      boxes: this.state.boxes.filter(b => b.boxId !== toDelete.boxId)
    });
  }

  clearCurrentSelection = () => {
    this.setState({ currentBox: [] });
  }

  calculatePointStyle = (p) => {
    const D = this.props.dotSize;
    const S = this.state.imageScaling;
    return {
      position: 'absolute',
      top: (p.y / S) - D / 2,
      left: (p.x / S) - D / 2,
      height: D,
      width: D,
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderColor: this.props.dotBorderColor,
      borderWidth: this.props.dotBorderWidth,
      borderRadius: D / 2,
      backgroundColor: this.props.dotColor,
    };
  }


  calculateBoxStyle = (b) => {
    const S = this.state.imageScaling;
    return {
      top: b.top / S,
      left: b.left / S,
      height: (b.bottom - b.top) / S,
      width: (b.right - b.left) / S,
      position: 'absolute',
      backgroundColor: this.props.boxColor,
    };
  }

  render() {
    const S = this.state.imageScaling;
    return (
      <div
        className="ExtremeClickingImageLabeler"
        style={{
          position: 'relative',
          height: this.props.height,
          width: this.props.width,
        }}
        onClick={this.onClick}
        >
        { this.state.imageLoaded && (
          <img
            ref="image"
            onLoad={this.handleImageLoad}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              maxHeight: this.props.height,
              maxWidth: this.props.width
            }}
            src={this.props.imageSrc}
          />
        )}
        { this.state.currentBox.map((point, i) => (
          <div
            className="ExtremeClickingImageLabeler--point"
            key={i + '-' + point.x + '-' + point.y + 'S' + S}
            style={this.calculatePointStyle(point)}
          />
        ))}
        {
          this.state.boxes.map((box, i) => (
            <div
              className="ExtremeClickingImageLabeler--bounding-box"
              key={'box' + box.boxId}
              style={this.calculateBoxStyle(box)}
            />
          ))
        }
        <div className="ExtremeClickingImageLabeler--side-menu">
        {
          this.state.boxes.map((box, i) => (
            <BoundingBoxInfo
              key={'info' + box.boxId}
              box={box}
              onDelete={(e) => this.handleDeleteBox(e, box)}
            />
          ))
        }
        </div>
      </div>
    );
  }
}

ExtremeClickingImageLabeler.defaultProps = {
  imageSrc: null,
  dotSize: 10,
  dotColor: 'white',
  dotBorderWidth: 1,
  dotBorderColor: '#333333',
  boxColor: 'rgba(255,255,255,0.3)',
  height: 600,
  width: 800,
  onUpdate: null,
};
