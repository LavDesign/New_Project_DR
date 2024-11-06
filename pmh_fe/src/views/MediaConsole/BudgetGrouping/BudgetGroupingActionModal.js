import React, { useEffect, useState } from 'react';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import styles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BudgetGroupingActionModal = ({
  handleRemoveClick,
  onEditBudgetGroup,
  fromCard,
  fromTable,
  handleGroupSubscription,
  showCustomButton,
}) => {
  const navigate = useNavigate();
  const { bgDetailsGroup } = useSelector((store) => store.getMediaConsole);

  useEffect(() => {
    let actions = [
      {
        actionBtnName: 'Edit',
        actionIconImg: `bg-edit.svg`,
        onClickHandler: onEditBudgetGroup,
      },
      {
        actionBtnName: bgDetailsGroup?.isGroupSubscribed
          ? 'Unfollow'
          : 'Follow',
        actionIconImg: `bg-view.svg`,
        onClickHandler: handleGroupSubscription,
      },
      {
        actionBtnName: 'Delete',
        actionIconImg: `bg-delete.svg`,
        onClickHandler: handleRemoveClick,
      },
      {
        actionBtnName: 'Group Details',
        actionIconImg: `bg-details-icon.svg`,
        onClickHandler: handleGroupDetailsClick,
      },
    ];
    if (window?.location?.pathname.includes('budget-group-details')) {
      actions = actions.filter(
        (item) => item.actionBtnName !== 'Group Details'
      );
    }
    setActionItems(actions);
  }, [bgDetailsGroup]);

  const handleGroupDetailsClick = () => {
    navigate('/budget-group-details');
  };
  const [actionListItems, setActionItems] = useState(undefined);

  useEffect(() => {
    // navigate to budget grouping if page is reloaded
    if (!bgDetailsGroup) {
      navigate(`/budget-grouping`);
    }
  }, [window?.location]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const meuPosition = fromCard ? '+170' : '';

  return (
    <div
      className={styles['bg-card__action-btn']}
      style={{ cursor: 'pointer' }}
    >
      {showCustomButton ? (
        <div className='action-button' onClick={handleClick}>
          <button className='budgetgroup-button'>
            Actions
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/arrow-white.svg`}
              className='budgetgroup-arrow'
              alt='Arrow Icon'
            />
          </button>
        </div>
      ) : (
        <div
          id='positioned-button'
          aria-controls={open ? 'positioned-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleClick}
        >
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/ellipsis-h.svg`}
            alt='View'
          />
        </div>
      )}
      <Menu
        id='positioned-menu'
        aria-labelledby='positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 100,
        }}
        sx={{
          '.MuiPaper-root': {
            width: fromTable || fromCard ? '166px' : '140px',
            borderRadius: '8px',
            padding: '8px 6px 8px 6px',
            left: fromTable
              ? '22% !important'
              : showCustomButton
              ? '83% !important'
              : '',
            top: showCustomButton ? '12rem !important' : '',
          },
          '.MuiList-root': {
            paddingBottom: '0px !important',
            paddingTop: '6px !important',
          },
        }}
      >
        {actionListItems?.map((item) => {
          return (
            <MenuItem
              onClick={() => {
                handleClose();
                item.onClickHandler();
              }}
              className={styles['bgListMenu']}
              key={item.actionBtnName}
            >
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/${item.actionIconImg}`}
                alt={item.actionBtnName}
              />
              <span
                className={styles['bg-card__action-label']}
                style={{ paddingLeft: '8px' }}
              >
                {item.actionBtnName}
              </span>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default BudgetGroupingActionModal;
