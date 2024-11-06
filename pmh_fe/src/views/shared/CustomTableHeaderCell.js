import React from 'react';
import styles from '../../_theme/modules/shared/Table.module.css'

const HeaderCellWithTooltip = props => { //TODO: Test tooltips when working on Campaign Dash
  const tooltipProps = {
    colSpan: props.colSpan,
    role: props.role,
    title: props.tooltipText,
    onClick: props.onClick,
  }

  let leftStyle;
  if (props.isFreeze && props.previousCol !== undefined) {
    leftStyle = {
      'left': props.previousCol.toString() + "px"
    }
  }
  let cursorStyle;
  cursorStyle = props.draggable ? { 'cursor': 'move' } : '';

  let classNames =  props.isFreeze && props.fromNewUi ? `${styles['tr-freeze-new-ui']}` : props.isFreeze && !props.fromNewUI ? `'border-end' ${styles['tr-freeze']}`  : props.isGroove ? '' : 'border-end';
  
  if(props.fromNewUi) classNames = classNames.replace('border-end', '');
  
  return (
    <th draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnter={props.onDragEnter}
      onDragEnd={props.onDragEnd}
      onDragOver={props.onDragOver}
      style={{ ...props.style, ...leftStyle, ...cursorStyle }}
      className={classNames}
      {...tooltipProps} data-bs-toggle="tooltip" data-bs-placement="top">{props.children}</th>
  )
};

const BasicHeaderCell = props => {
  const cellProps = {
    colSpan: props.colSpan,
    role: props.role,
    onClick: props.onClick,
  }

  let leftStyle;
  if (props.isFreeze && props.previousCol) {
    leftStyle = {
      'left': props.previousCol + "px"
    }
  }
  return (
    <th {...cellProps} style={{ ...props.style, ...leftStyle }}
      className={props.isFreeze ? `'border-end' ${styles['tr-freeze']}` : props.isGroove ? '' : 'border-end'}>
      {props.children}
    </th>
  );
};

const CustomTableHeaderCell = props => {
  return props.tooltipText ?
    <HeaderCellWithTooltip {...props}>
      {props.children}
    </HeaderCellWithTooltip>
    :
    <BasicHeaderCell {...props}>
      {props.children}
    </BasicHeaderCell>

};

export default CustomTableHeaderCell;