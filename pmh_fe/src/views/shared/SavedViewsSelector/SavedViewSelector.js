import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as _ from 'underscore';

import styles from '../../../_theme/modules/shared/SavedViewSelector.module.css';
import CustomButton from '../../UI/CustomButton';
import Backdrop from '../../UI/Backdrop';
import { useTranslation } from 'react-i18next';
import { useUserViews } from '../../../_helpers/userViewsContext';
import SavedViewMenuList from './SavedViewMenuList';
import { trackButtonClick, getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { deleteSavedViews, saveView } from '_services/savedViews';
import { SAVE_SELECTED_VIEW, UPDATE_COLUMNS } from 'common/Redux/Constants/index';
import { PUBLICURL } from '../../../_helpers/Utils/dashboardUtil';

const DeleteConfirmDialog = props => {
  const { t } = useTranslation(['common']);
  return (
    <div id="overlay">
      <div className={`fade modal-backdrop show `}>
        <div className={`dropdown-menu card ${props.anchorEl ? 'show' : ''} p-0 ${styles['groove_remove_view_div']}  ${styles['delete-dropdown-container']}`}>
          <div className={`${styles['groove_remove_text_div']}`}>
            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_laugh_wink.png`}
              style={{ marginLeft: '25px', width: '24px', height: '24px', float: 'right' }} />
            <h5 className={`${styles['groove_delete_popup_header']}`}>{t('site_titles.remove_view')}</h5>
            <button type="button" className={`btn-close ${styles['groove_close_icon']}`}
               onClick={props.onCancelFn('cancelDeletion')} data-bs-dismiss="modal" aria-label="Close">
            </button>
          </div>

          <div className={`p-2 ${styles['groove_remove_card_text_div']}`}><p className='card-text'>{t('site_texts.remove_view_desc')}</p></div>
          <div className={`pt-1 ${styles['groove_remove_button_div']}`}>
            <CustomButton
              className={`btn-light ${styles['groove_cancel_button']}`}
              onClick={props.onCancelFn('cancelDeletion')} >{t('button_text.no_cancel')}</CustomButton>
            <CustomButton
              className={`btn-primary text-white ${styles['groove_ok_button']}`}
              onClick={props.handleDelete(props.option)} >{t('button_text.yes_remove')}</CustomButton>
            {props.isError && <span className="invalid-feedback">{props.errorMessages}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};


export const SavedViewsMenu = props => {
  const { t } = useTranslation(['common']);
  const { selectedDashboardTab } = props;
  const {
    userSelectedView,
    setColumnSelectionState,
    removeViewHandler,
    columnSelectionState,
    addNewOrEditViewHandler
  } = useUserViews();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteOption, setDeleteOption] = useState(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const PUBLICURL = import.meta.env.VITE_PUBLIC_URL === '/' ? '' : import.meta.env.VITE_PUBLIC_URL;
  const [getSaveViewResponse, setSaveViewResponse] = useState(undefined);

  const { 
    selectedSavedView,
    updatedSelectedTabColumns,
    oldSelectedTabColumns, 
  } = useSelector((store) => store.getDashboardData);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedSavedView && getSaveViewResponse) {
      const isEdit = selectedSavedView?.viewId > 0;
      addNewOrEditViewHandler({...selectedSavedView, ...getSaveViewResponse}, isEdit)
      setColumnSelectionState('saved');
      setIsOpen(false);
      setSaveViewResponse(undefined);
      if (updatedSelectedTabColumns && oldSelectedTabColumns) {
        dispatch({
          type: UPDATE_COLUMNS,
          payload: {
            updatedSelectedTabColumns: undefined,
            oldSelectedTabColumns: undefined,
          },
        });
      }
    }
  }, [selectedSavedView, getSaveViewResponse]);

  const handleClick = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const cancelDeletionAction = () => {
    setDeleteOption(undefined);
    setIsDeleting(false);
    setIsOpen(false);
  };

  const onDeleteOptionClicked = value => () => {
    trackButtonClick(value.label, `${getPageCategory()} ${pageSubCategory.viewModal}`, 'Remove Icon')
    setIsDeleting(!isDeleting);
    setDeleteOption(value);
  };

  const handleDelete = value => () => {
    trackButtonClick(t('button_text.ok'), `${getPageCategory()} ${pageSubCategory.viewModal}`)
    let deleteResp = deleteSavedViews({ viewId: value.viewId, isDash: props.isDash });
    deleteResp.then((result) => {
      if (result.statusCode === 200) {
        removeViewHandler(value.viewId);
        cancelDeletionAction();
      }
    }).catch(error => {
      setIsError(true);
      let errorMessagesArray = []
      errorMessagesArray.push("Error in Saving View:" + JSON.stringify(error));
      setErrorMessages(errorMessagesArray);
      setColumnSelectionState('toSave');
      return;
    });
  };

  const onCancelButtonClicked = value => () => {
    trackButtonClick(t('button_text.cancel'), `${getPageCategory()} ${pageSubCategory.viewDeleteModal}`)
    if (value === 'cancelDeletion') {
      cancelDeletionAction();
    }
  };

  const sanitizePayload = (params) => {
    delete params.columns;
    delete params.adSetColumns;
    delete params.label;
    delete params.entityId;
    delete params.freezeColumns;
    delete params.selected;
    delete params.campaignDash;
    delete params.adSetDash;
    return params;
  };

  const saveViews = (value) => {
    trackButtonClick(t('button_text.save'), `${getPageCategory()} ${pageSubCategory.viewDeleteModal}`);
    const selectedViewData = JSON.parse(JSON.stringify(value.newOption));
    dispatch({
      type: SAVE_SELECTED_VIEW,
      payload: selectedViewData,
    });

    const params = {
      savedView: sanitizePayload(value.newOption)
    };

    saveView(params).then((result) => {
      const { statusCode, json, statusDescription, message } = result;
      if (statusCode === 200 && json) {
        setSaveViewResponse(json);
      } else {
        setIsError(true);
        setIsOpen(true);
        setErrorMessages(`Error in Saving View: ${message || statusDescription}`);
        setColumnSelectionState('toSave')
        return;
      }
    })
  };

  const displayViewName = () => {
    const btnStyle =
      columnSelectionState === 'toSave'
        ? {
          fontStyle: 'italic'
        }
        : null;
    return (
      <span style={btnStyle} className={`${styles['groove_saved_view_name']}`}  >
        {!_.isUndefined(userSelectedView)
          ? userSelectedView.label
          : 'Untitled View'}
      </span>
    );
  };

  return (
    <React.Fragment>
      <label className={`${styles['groove_text']}`}>{`${t('button_text.view')}: `}</label>
      <CustomButton className={`btn-light ${styles['groove_views_button']}`} onClick={handleClick}>
        {displayViewName()}
        <img src={`${window.location.origin}${PUBLICURL}/assets/icons/expand-more.png`}
          style={{ marginLeft: '31px', width: '16px', height: '16px', float: 'right' }} />
      </CustomButton>
      {(isOpen || isDeleting) && <Backdrop onClick={handleClose} />}
      {!isDeleting && <SavedViewMenuList
        isOpen={isOpen}
        isDash={props.isDash}
        setIsOpen={setIsOpen}
        isError={isError}
        errorMessages={errorMessages}
        onDeleteOptionClickedFn={onDeleteOptionClicked}
        saveViews={saveViews}
        setIsRefetchingCampaignDashData={props.setIsRefetchingCampaignDashData} />
      }
      {isDeleting &&
        <DeleteConfirmDialog
          anchorEl={anchorEl}
          option={deleteOption}
          onCancelFn={onCancelButtonClicked}
          handleDelete={handleDelete}
          isError={isError}
          errorMessages={errorMessages} 
          onDeleteOptionClickedFn={onDeleteOptionClicked}
          saveViews={saveViews}
          setIsRefetchingCampaignDashData={props.setIsRefetchingCampaignDashData}
          selectedDashboardTab={selectedDashboardTab}/>}
    </React.Fragment>
  );
};
const SavedViewsSelector = props => {
  return (
    <div style={{ marginRight: '18px', display: 'inline-flex' }}>
      <SavedViewsMenu
        isDash={props.isDash}
        setIsRefetchingCampaignDashData={props.setIsRefetchingCampaignDashData}
        selectedDashboardTab={props.selectedDashboardTab}
      />
    </div>
  );
};

export { SavedViewsSelector };
