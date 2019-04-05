import React from 'react'
import { connect } from 'react-redux'
import { GeoJSON } from 'react-leaflet'
import { showDetailsFor } from '../actions'
import farmData from '../data/farms.json'
import FieldModel from '../model/FieldModel'

const getColor = (data, id, assignFunc, colorFunc) => {
  let val = assignFunc(data, id)
  return colorFunc(val);
} 

const mapStateToProps = state => ({
  data: state.viz.activeData,
  date: state.viz.dateString,
  fieldName: state.viz.dataDisplayed,
  colorFunc: state.viz.colorFunc,
  assignFunc: state.viz.assignFunc,
  map: state.viz.globalMap.leafletElement
})

class MapGeoOverlay extends React.Component {

  constructor(props) {
    super(props);
    this.showData = this.showData.bind(this);
    this.data = props.data;
    this.map = props.map;
    this.style = (polygon) => (
      {
        fillColor: getColor(this.data, polygon.id, this.props.assignFunc, this.props.colorFunc),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      }
    )
  }

  componentWillReceiveProps(props) {
    this.data = props.data;
    this.map = props.map;
  }
  
  showData(e) {
    let polygon = e.target.feature;
    let coords = polygon.geometry.coordinates[0];
    let newCoords = [];
    coords.forEach(function (coord, i) {
      newCoords.push([coord[1], coord[0]]);
    });
    console.log("here");
    const field = new FieldModel(polygon.id, newCoords);
    this.props.dispatch(showDetailsFor(field))
    // this.map.fitBounds(newCoords);
    // console.log(this.props.assignFunc(this.data, polygon.id));
  }
  
  onEachPolygon(component, polygon, layer) {
    layer.on({ click: component.showData });
  }
  
  render() {
    return (
      <GeoJSON key={"key"} data={farmData} style={this.style} 
               onEachFeature={this.onEachPolygon.bind(null, this)} 
               ref="geojson"/>
    );
  }
}

export default connect(mapStateToProps)(MapGeoOverlay)