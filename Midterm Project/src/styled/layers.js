import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  z-index: 2;
`
const Underlay = styled.div`
  z-index: 1;
  position: relative;
  height: 100vh;
  width: 100%;
`

const FlexContainer = styled.div`
  display:flex;
  justify-content: space-between;
`

const InfoContainer = styled.div`
  width: 30%;
`

const MainContainer = styled.div`
  width: 70%;
`
export {Overlay, Underlay, FlexContainer, InfoContainer, MainContainer}