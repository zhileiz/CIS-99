import React from 'react'
import { connect } from 'react-redux'

import MapContainer from "./MapContainer"
import DataSelector from './DataSelector'
import {Overlay, Underlay} from '../styled/layers'

const mapStateToProps = state => ({
  on: state.viz.detailNotesToggled,
  map: state.viz.globalMap,
  field: state.viz.field
})

class MainContainer extends React.Component {

  render() {
    var itemWidth = this.props.on ? "80%" : "100%"

    return ( 
      <div style={{width: itemWidth, transition: "500ms ease"}}>
        <Overlay>
          <DataSelector></DataSelector>
        </Overlay>
        <Underlay>
          <MapContainer/> 
        </Underlay>
      </div>
    )
  }

  componentDidUpdate() {
    if (this.props.on) {
      if (this.props.map) {
        if (this.props.field) {
          this.map = this.props.map.leafletElement;
          let coords = this.props.field.coords;
          if (this.map._zoom > 16) {
            this.map.fitBounds(coords);
          } else {
            const pan = () => {this.map.fitBounds(coords);}
            setTimeout(pan, 500)
          }
        }
      }
    } else {
      if (this.props.map) {
        let map = this.props.map.leafletElement;
        const zoom = () => {map.setZoom(16)}
        setTimeout(zoom, 500)
        const pan = () => {map.panTo([32.138917, 119.74771])}
        setTimeout(pan, 1200)
      }
    }
  }
}

export default connect(mapStateToProps)(MainContainer);