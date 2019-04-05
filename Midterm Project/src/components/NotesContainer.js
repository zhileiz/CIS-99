import React from 'react'
import { connect } from 'react-redux'
import NotesToggle from './NotesToggle'
import { List } from 'antd';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const NotesContainer = ({on, field}) => {
  
  var itemWidth = on ? "20%" : "0%"

  return (
  <div style={{width: itemWidth, transition: "500ms ease"}}>
    <List
      header={<h2>Field {on ? field.id : ""}</h2>}
      footer={<NotesToggle></NotesToggle>}
      bordered
      dataSource={data}
      renderItem={item => (<List.Item>{item}</List.Item>)}
    />
  </div>)
};

const mapStateToProps = state => ({
  on: state.viz.detailNotesToggled,
  field: state.viz.field
})

export default connect(mapStateToProps)(NotesContainer);