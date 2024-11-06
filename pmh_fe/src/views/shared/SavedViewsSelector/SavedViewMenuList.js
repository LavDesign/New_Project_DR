import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'underscore';
import { useTranslation } from 'react-i18next';
import { useUserViews } from '../../../_helpers/userViewsContext';
import { useStore } from '_helpers/storeContext';
import styles from '../../../_theme/modules/shared/SavedViewSelector.module.css';
import { saveSelectedDashView } from '../../../_services/savedViews';
import SavedViewsList from './SavedViewsList';
import AddSavedView from './AddSavedView';
import {
  trackButtonClick,
  getPageCategory,
  pageSubCategory,
} from '_helpers/Utils/segmentAnalyticsUtil';
import { UPDATE_COLUMNS } from 'common/Redux/Constants';

const MenuHeaderItem = (props) => {
  return (
    <>
      <li><h6 className={`dropdown-header ${styles['groove_global_view_title']}`}>{props.headerLabel}</h6></li>
    </>
  );
};

const SavedViewMenuList = (props) => {
  const { t } = useTranslation(['common']);
  const [textValue, setTextValue] = useState('');
  const {
    userSavedViews,
    setSelectedView,
    userSelectedColumns,
    columnSelectionState,
    setColumnSelectionState,
    freezedColumns,
    pivotColumns,
    setPivotColumns,
    setPivotOperation,
  } = useUserViews();
  const [isViewNameValid, setIsViewNameValid] = useState('');
  const [isDuplicateView, setIsDuplicateView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedView, setEditedView] = useState(null);
  const [editedOptionName, setEditedOptionName] = useState('');
  const [savingIsValid, setSavingIsValid] = useState(false);
  const [editDefaultView, setEditDefaultView] = useState('');
  const [isDefaultViewEdit, setIsDefaultViewEdit] = useState(false);
  const [disabledSaveButton, setDisabledSaveButton] = useState(true);
  const {
    store: { currentUser },
  } = useStore();
  const isSavedViewAbility = currentUser?.userAbilitiesList?.some(
    (ability) => ability?.abilityId === 8
  );
  const { 
    updatedSelectedTabColumns,
    oldSelectedTabColumns, 
  } = useSelector((store) => store.getDashboardData);
  const dispatch = useDispatch();

  const saveOptions = (isDefault) => {
    setIsDefaultViewEdit(isDefault);
    if (textValue.length === 0 && !isEditing) {
      setIsViewNameValid('invalid');
      return;
    }

    if (
      !isEditing &&
      ((isDefault &&
        userSavedViews.find(
          (view) => view.isDefault && view.viewName.trim() === textValue.trim()
        )) ||
        (!isDefault &&
          userSavedViews.find(
            (view) =>
              !view.isDefault && view.viewName.trim() === textValue.trim()
          )))
    ) {
      setIsViewNameValid('duplicate');
      return;
    }

    if (isEditing) {
      let value = { newOption: editedView };
      props.saveViews(value);
      setIsEditing(false);
      setEditedView(null);
      setIsViewNameValid('');
      return;
    }

    props.saveViews({
      newOption: {
        viewId: 0,
        isdefault: isDefault,
        viewName: textValue,

        columnList: userSelectedColumns.campaignDash?.[0]?.map((column, index) => {
          return JSON.parse(
            JSON.stringify({
              columnKey: column,
              isFreeze:
                parseInt(freezedColumns.campaignDash) > 0 &&
                parseInt(freezedColumns.campaignDash) > index,
              displayOrder: index,
              isPivot: pivotColumns.campaignDash.includes(column),
              tabName: 'campaign'
            })
          );
        }),
        adSetColumnList: userSelectedColumns.adSetDash?.[0]?.map(
          (column, index) => {
            return JSON.parse(
              JSON.stringify({
                columnKey: column,
                isFreeze:
                  parseInt(freezedColumns.adSetDash) > 0 &&
                  parseInt(freezedColumns.adSetDash) > index,
                displayOrder: index,
                isPivot: pivotColumns.adSetDash.includes(column),
                tabName: 'adset'
              })
            );
          }
        ),
        columns: [...userSelectedColumns.campaignDash],
        adSetColumns: [...userSelectedColumns.adSetDash],
      },
    });
    setTextValue('');
    setIsViewNameValid('');
    setSavingIsValid(false);
  };

  const handleNameEdit = (isDefault) => {
    if (editedOptionName.trim().length > 0) {
      if (
        isEditing &&
        ((isDefault &&
          userSavedViews.find(
            (view) =>
              view.isDefault && view.viewName.trim() === editedOptionName.trim()
          )) ||
          (!isDefault &&
            userSavedViews.find(
              (view) =>
                !view.isDefault &&
                view.viewName.trim() === editedOptionName.trim()
            )))
      ) {
        setIsViewNameValid('duplicate');
        return;
      }

      let value = {
        newOption: {
          ...editedView,
          label: editedOptionName,
          viewName: editedOptionName,
        },
      };
      props.saveViews(value);
      setIsEditing(false);
      setEditedOptionName('');
      setEditedView(null);
      return;
    }
  };

  const handleCheckClick = (isItemSelected, option, isDefaultViewEdit) => {
    if (isItemSelected) {
      setEditedView({
        ...option,
        columns: [...userSelectedColumns.campaignDash],
        adSetColumns: [...userSelectedColumns.adSetDash],
        columnList: [
          ...userSelectedColumns.campaignDash?.[0]?.map((column, index) => ({
            columnKey: column,
            isFreeze:
              parseInt(freezedColumns.campaignDash) > 0 &&
              parseInt(freezedColumns.campaignDash) > index,
            displayOrder: index,
            isPivot: pivotColumns.campaignDash.includes(column),
            tabName: 'campaign'
          })),
        ],
        adSetColumnList: [
          ...userSelectedColumns.adSetDash?.[0]?.map((column, index) => ({
            columnKey: column,
            isFreeze:
              parseInt(freezedColumns.adSetDash) > 0 &&
              parseInt(freezedColumns.adSetDash) > index,
            displayOrder: index,
            isPivot: pivotColumns.adSetDash.includes(column),
            tabName: 'adset'
          })),
        ],
      });

      setIsEditing(true);
      setDisabledSaveButton(isDefaultViewEdit);
    } else {
      setEditedView(null);
      setIsEditing(false);
      setDisabledSaveButton(false);
    }
  };
  const handleCancelSave = () => {
    trackButtonClick(
      t('button_text.cancel'),
      `${getPageCategory()} ${pageSubCategory.viewModal}`
    );
    setIsEditing(false);
    setTextValue('');
    setEditedOptionName('');
    setIsViewNameValid('');
    setIsDuplicateView(true);
    setColumnSelectionState('saved');
  };

  const handleEditName = (value, isDefaultView) => {
    trackButtonClick(
      value.label,
      `${getPageCategory()} ${pageSubCategory.viewModal}`,
      'Edit Icon'
    );
    setColumnSelectionState('isEditing');
    setEditDefaultView(isDefaultView ? 'default' : 'custom');
    setIsEditing(true);
    setEditedView(value);
    setEditedOptionName(value.label);
    setIsViewNameValid('');
  };

  const onOptionClickedHandler = (option) => {
    trackButtonClick(option.viewName, getPageCategory(), 'Dropdown');
    setPivotColumns({
      campaignDash: [],
      adSetDash: [],
    });
    setColumnSelectionState('saved');
    setPivotOperation(true);
    saveSelectedDashView({ viewId: option.viewId }).then;
    setSelectedView({ view: option });
    props.setIsRefetchingCampaignDashData(true);
    props.setIsOpen(false);
    // Clearing the redux values on changing the option in save view menu list
    if (updatedSelectedTabColumns && oldSelectedTabColumns) {
      dispatch({
        type: UPDATE_COLUMNS,
        payload: {
          updatedSelectedTabColumns: undefined,
          oldSelectedTabColumns: undefined,
        },
      });
    }
  };

  const handleNewViewNameChange = (val, isDefaultViewEdit) => {
    setTextValue(val);
    setSavingIsValid(val.length > 0);
    setDisabledSaveButton(isDefaultViewEdit);
  };

  const globalViews =
    userSavedViews.filter((view) => view.isDefault).length > 1
      ? userSavedViews.filter((view) => view.isDefault && view.id !== 1)
      : userSavedViews;

  return (
    <ul className={`dropdown-menu ${props.isOpen ? 'show' : ''} ${styles['dropdown-container-height']} ${styles['dropdown-container']}
    ${styles['groove_saved_view_ul']}`} >
      <MenuHeaderItem headerLabel={t('site_titles.default_views')} />
      {globalViews
        .filter((view) => view.isDefault)
        .map(function (option, index) {
          return (
            <SavedViewsList
              key={`saved-views-list-${option.viewId}`}
              option={option}
              index={index}
              columnSelectionState={columnSelectionState}
              isEditing={isEditing}
              editedView={editedView}
              editedOptionName={editedOptionName}
              setEditedOptionName={setEditedOptionName}
              handleCheckClick={handleCheckClick}
              onDeleteOptionClickedFn={props.onDeleteOptionClickedFn}
              handleEditName={handleEditName}
              onOptionClickedHandler={onOptionClickedHandler}
              isDefaultViews={true}
              showEdit={option.viewId !== 1 && isSavedViewAbility}
              isViewNameValid={isViewNameValid}
              isSavedViewAbility={isSavedViewAbility}
            />
          );
        })}

      {isSavedViewAbility && (
        <AddSavedView
          isDefaultViews={true}
          editColumnSelectionState={
            editDefaultView === 'default' ? columnSelectionState : ''
          }
          columnSelectionState={columnSelectionState}
          isViewNameValid={isDefaultViewEdit ? isViewNameValid : ''}
          disabledSaveButton={!disabledSaveButton}
          isDuplicateView={isDuplicateView}
          handleCancelSave={handleCancelSave}
          handleNewViewNameChange={handleNewViewNameChange}
          handleNameEdit={handleNameEdit}
          saveOptions={saveOptions}
          savingIsValid={savingIsValid}
          isEditing={isEditing}
          editedOptionName={editedOptionName}
          isError={props.isError}
        />
      )}

      {!_.isEmpty(userSavedViews.filter((view) => !view.isDefault)) && (
        <>
          <MenuHeaderItem headerLabel={t('site_titles.custom_views')} />
          {userSavedViews.filter(view => !view.isDefault).map(function (option, index) {
            return (
              <SavedViewsList
                key={`saved-views-list-${option.viewId}`}
                option={option}
                index={index}
                columnSelectionState={columnSelectionState}
                isEditing={isEditing}
                editedView={editedView}
                editedOptionName={editedOptionName}
                setEditedOptionName={setEditedOptionName}
                handleCheckClick={handleCheckClick}
                onDeleteOptionClickedFn={props.onDeleteOptionClickedFn}
                handleEditName={handleEditName}
                onOptionClickedHandler={onOptionClickedHandler}
                isDefaultViews={false}
                showEdit={true}
                isViewNameValid={isViewNameValid}
                isSavedViewAbility={true}
              />
            )
          })}
        </>
      )}
      <AddSavedView
        isDefaultViews={false}
        editColumnSelectionState={
          editDefaultView === 'custom' ? columnSelectionState : ''
        }
        columnSelectionState={columnSelectionState}
        isViewNameValid={isDefaultViewEdit ? '' : isViewNameValid}
        disabledSaveButton={disabledSaveButton}
        isDuplicateView={isDuplicateView}
        handleCancelSave={handleCancelSave}
        handleNewViewNameChange={handleNewViewNameChange}
        handleNameEdit={handleNameEdit}
        saveOptions={saveOptions}
        savingIsValid={savingIsValid}
        isEditing={isEditing}
        editedOptionName={editedOptionName}
        isError={props.isError}
      />
    </ul>
  );
};

export default SavedViewMenuList;
