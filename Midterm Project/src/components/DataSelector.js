import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { changeDate, changeDataDisplayed } from '../actions'
import { Radio, DatePicker } from 'antd';
import moment from 'moment';

const Wrapper = styled.div`
  border-radius: 5px;
  padding: 5px 10px;
  width: 480px;
  margin: 20px;
  display: flex;
  justify-content: space-between;
`

const DataSelector = ({dispatch}) => (
  <Wrapper>
    <Radio.Group defaultValue="pest-level" buttonStyle="solid" 
                 onChange={e => dispatch(changeDataDisplayed(e.target.value))}>
      {/* <Radio.Button value="crop-type">品种</Radio.Button>
      <Radio.Button value="stage">阶段</Radio.Button> */}
      <Radio.Button value="humidity">Humidity</Radio.Button>
      <Radio.Button value="pest-level">Pest Level</Radio.Button>
    </Radio.Group>
    <DatePicker defaultValue={moment('2019-03-12', 'YYYY-MM-DD')} 
                format={'YYYY-MM-DD'}
                onChange={(date, dateString) => dispatch(changeDate(dateString))} />
  </Wrapper>
)

export default connect()(DataSelector);