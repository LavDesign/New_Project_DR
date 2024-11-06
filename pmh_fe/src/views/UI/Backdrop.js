import React from 'react';
import styled from 'styled-components';

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
`;

const Backdrop = props => {
  return (<StyledBackdrop onClick={props.onClick} />);
};

export default Backdrop;