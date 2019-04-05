import React from 'react'
import { Map, TileLayer, LayersControl } from 'react-leaflet'
import { connect } from 'react-redux'
import { setMap } from '../actions'
// import MapProvider from '../util/MapProvider'
import MapGeoOverlay from './MapGeoOverlay.js';

const position = [32.138917, 119.74771];
const zoom = 16;
const { BaseLayer } = LayersControl

class MapContainer extends React.Component {

  render() {
    return ( 
      <Map center={position} 
      zoom={zoom} 
      ref={(ref) => { this.map = ref; }} 
      zoomControl={false} 
      doubleClickZoom={false} 
      scrollWheelZoom={false}>
   <LayersControl position='topright'>
     <BaseLayer checked name='Satellite Map'>
     <TileLayer
       url="http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
     />
   </BaseLayer>
   <BaseLayer name='Street Map'>
     <TileLayer
       url="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"
     />
   </BaseLayer>
   </LayersControl>
   <MapGeoOverlay />
 </Map>)
  }

  componentDidMount() {
    this.props.dispatch(setMap(this.map))
  }
}

export default connect()(MapContainer);