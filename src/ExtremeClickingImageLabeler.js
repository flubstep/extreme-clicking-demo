import React, { Component } from 'react'

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
    if (this.props.height !== prevProps.height || this.props.width !== prevProps.width) {
      this.handleImageLoad();
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
    const rect = this.refs.image.getBoundingClientRect();
    const S = this.state.imageScaling;
    const { left, top } = rect;
    const nextPoint = {
      x: (e.clientX - left) * S,
      y: (e.clientY - top) * S,
    };

    var { currentBox, boxes } = this.state;
    currentBox.push(nextPoint);

    if (currentBox.length === 4) {
      const xs = currentBox.map(p => p.x);
      const ys = currentBox.map(p => p.y);
      const nextBox = {
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

  calculatePointStyle = (p) => {
    const D = this.props.dotSize;
    const S = this.state.imageScaling;
    return {
      position: 'absolute',
      top: (p.y / S) - D / 2,
      left: (p.x / S) - D / 2,
      height: D,
      width: D,
      borderRadius: D / 2,
      backgroundColor: 'white',
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    };
  }

  render() {
    const S = this.state.imageScaling;
    return (
      <div
        style={{position: 'relative'}}
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
            key={i + '-' + point.x + '-' + point.y + 'S' + S}
            style={this.calculatePointStyle(point)}
          />
        ))}
        {
          this.state.boxes.map((box, i) => (
            <div
              key={'box' + i + 'S' + S}
              style={this.calculateBoxStyle(box)}
            />
          ))
        }
      </div>
    );
  }
}

ExtremeClickingImageLabeler.defaultProps = {
  imageSrc: null,
  dotSize: 6,
  height: 600,
  width: 800,
  onUpdate: null,
};