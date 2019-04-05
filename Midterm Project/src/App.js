import React from 'react'
import NotesContainer from './components/NotesContainer'
import MainContainer from './components/MainContainer'
import { FlexContainer } from './styled/layers'

import { createStore } from 'redux'
import { Provider} from 'react-redux'
import rootReducer from './reducers'

import './App.css';
import "antd/dist/antd.css";

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const App = () =>  ( 
  <Provider store={store}>
    <FlexContainer>
      <NotesContainer></NotesContainer>
      <MainContainer></MainContainer>
    </FlexContainer>
  </Provider>
)

export default App;
