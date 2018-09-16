import React from 'react';
import MapView, { Polyline } from 'react-native-maps';
export class PolyDraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [],
      idx: 0
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.idx < this.props.coords.length)
        setState({idx: this.state.idx + 1, coords: this.state.coords+this.props.coords[idx]})
    }, 500)
  }
  render() {
    if(this.state.idx >= this.props.coords.length)
      clearInterval(this.interval)
    {this.state.coords.map(ele =>
      <Polyline
        coordinates={[
          { latitude: ele[0][0], longitude: ele[0][1] },
          { latitude: ele[1][0], longitude: ele[1][1] },
        ]}
        strokeColor={ele[2]}
        strokeWidth={5}
      />);
    }
  }
}