import React from 'react'
import { connect } from 'react-redux'
import { toggleNotes } from '../actions'
import { Button } from 'antd'

const NotesToggle = ({dispatch}) => {
  return ( 
    <Button type="primary" shape="circle" icon="close" onClick={() => dispatch(toggleNotes())} />
  )
}

export default connect()(NotesToggle);