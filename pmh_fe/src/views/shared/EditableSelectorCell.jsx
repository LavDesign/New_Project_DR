import React from "react";
import styled from "styled-components";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SelectorMenuButton = styled(Button)`
  width: 100%;
  text-overflow: ellipsis;
  font-weight: bold;
  text-align: start;
`;

const ButtonText = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  text-align: start;
`;

const EditableSelectorCell = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickSelectionHandler = (event, index) => {
    props.onClickSelectionHandler(props.options[index]);
    setAnchorEl(null);
  };

  return (
    !props.updateFailed ? (<div>
      <SelectorMenuButton onClick={handleClick} disabled={props.isDisabled}>
        <ButtonText>{props.value}</ButtonText>
        <KeyboardArrowDownIcon/>
      </SelectorMenuButton>
      <Menu 
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)} 
      onClose={handleClose}>
        {props.options.map((option, index) => {
          return (
          <MenuItem 
            key={index} 
            onClick={(event) => onClickSelectionHandler(event, index)} 
            selected={props.value === option}>{option}</MenuItem>)
        })}
      </Menu>
    </div>) :
    (<p style={{
      width: '100%',
      margin: 0,
      border: 0,
      background: "transparent"}}
    value={props.value || ''}>
      {props.value || ''}
    </p>)      
  );
};

export default EditableSelectorCell;
