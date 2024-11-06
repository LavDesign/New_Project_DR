import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useUserViews } from '../../_helpers/userViewsContext';
import CustomButton from '../UI/CustomButton';
import CustomModal from '../UI/CustomModal';
import SearchInput from '../UI/SearchInput';

import { allColumnsForColumnSelector, columnGroupNames, columnSubGroupNames, platformTabHeaders } from '../../_helpers/columns/columns';
import styles from '../../_theme/modules/shared/ColumnSelector.module.css';
import { HashLink as Link } from 'react-router-hash-link';
import { trackButtonClick, getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { UPDATE_COLUMNS } from 'common/Redux/Constants/index';
import { DASHBOARD_TABS, PUBLICURL } from '_helpers/Utils/dashboardUtil';

const ColumnSelector = props => {
  const { selectedDashboardTab } = props;
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const freezeInputRef = useRef();
  const {
    userSelectedColumns,
    setUserSelectedColumns,
    columnSelectionIsEqual,
    setColumnSelectionState,
    freezedColumns,
    setFreezedColumns,
    setPivotOperation
  } = useUserViews();
  const [selectedTab, setSelectedTab] = useState(0);
  const [columnSelectorOptions, setColumnSelectorOptions] = useState(null);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [initialSelectedColumnsState, setInitialSelectedColumnsState] = useState(null);
  const [tabs, setTabs] = useState([]);
  const { userAbilitiesList } = props;
  const filterByAbility = userAbilitiesList?.some(
    (ability) => ability?.abilityId === 7
  );
  const { t } = useTranslation(['common']);

  const dispatch = useDispatch();
  const {
    updatedSelectedTabColumns,
    oldSelectedTabColumns,
  } = useSelector((store) => store.getDashboardData);

  const hideColumns = ['budget_recommendation', 'ad_set_budget_recommendation'];

  useEffect(() => {
    switch (selectedDashboardTab) {
      case DASHBOARD_TABS.CAMPAIGN.name:
        setTabs([t('tabs.campaign_dashboard')]);
        break;
      case DASHBOARD_TABS.AD_SET.name:
        setTabs([t('tabs.ad_sets_dashboard')]);
        break;
      default:
        setTabs([t('tabs.campaigns'), t('tabs.ad_sets'), t('tabs.ads')]);
        break;
    }
  }, [props]);

  const onDragSortHandle = () => {
    setInitialSelectedColumnsState(prevState => {
      let savedOptions = [...prevState];
      const draggedItem = savedOptions[selectedTab].splice(dragItem.current, 1)[0];

      savedOptions[selectedTab].splice(dragOverItem.current, 0, draggedItem);

      dragItem.current = null;
      dragOverItem.current = null;
      return [...savedOptions]
    });
  };

  const onChangeTab = (idx) => {
    trackButtonClick(tabs[idx], `${getPageCategory()} ${pageSubCategory.columnsModal}`, 'Tab')
    setSelectedTab(idx);
  };

  const getColumnSelectorOptions = (selectedColumns, selectedDashboardTab) => {
    return {
      initialAvailableColumnObjsArr: allColumnsForColumnSelector(selectedDashboardTab),
      initialSavedColumnFieldsArr: selectedColumns,
      tabHeaders: platformTabHeaders[selectedDashboardTab],
      columnGroups: Array.from(columnGroupNames(selectedDashboardTab), name => [name, ['']])
    };
  };

  const onClickButtonHandler = () => {
    trackButtonClick(t('button_text.columns'), getPageCategory())
    setColumnSelectorOptions({
      ...getColumnSelectorOptions(userSelectedColumns[selectedDashboardTab], selectedDashboardTab)
    });
    props.setOpenModal(true);
  };

  const getColumnsToHide = () => {
    switch (selectedDashboardTab) {
      case DASHBOARD_TABS.AD_SET.name:
        return ['ad_set_budget_recommendation'];
      default:
        return ['budget_recommendation'];
    }
  };

  useEffect(() => {
    if (columnSelectorOptions?.initialSavedColumnFieldsArr) {
      const { initialSavedColumnFieldsArr } = columnSelectorOptions;
      /* To remove the Budget Recommendation on the basis of ability */
      const setTabData = new Set(initialSavedColumnFieldsArr[selectedTab]);
      const checkElementPresent = hideColumns.some((item) =>
        setTabData.has(item)
      );
      if (checkElementPresent && !filterByAbility) {
        const copyInitialColumnArray = JSON.parse(
          JSON.stringify(initialSavedColumnFieldsArr)
        );
        
        const columnsToHide = getColumnsToHide();
        for (let i = 0; i < columnsToHide.length; i++) {
          const columnIndex = copyInitialColumnArray[selectedTab]?.indexOf(
            columnsToHide[i]
          );
          copyInitialColumnArray[selectedTab]?.splice(columnIndex, 1);
        }
        setInitialSelectedColumnsState([...copyInitialColumnArray]);
      } else setInitialSelectedColumnsState([...initialSavedColumnFieldsArr]);
    } else setInitialSelectedColumnsState(null);
  }, [columnSelectorOptions]);

  const onCloseHandler = event => {
    trackButtonClick(t('button_text.cancel'), `${getPageCategory()} ${pageSubCategory.columnsModal}`)
    setColumnSelectorOptions(null);
    setInitialSelectedColumnsState(null);
    setGlobalSearchValue('');

    props.setOpenModal(false);
  };

  const onConfirmHandler = () => {
    trackButtonClick(t('button_text.ok'), `${getPageCategory()} ${pageSubCategory.columnsModal}`)
    if (!columnSelectionIsEqual({ prevList: initialSelectedColumnsState, newList: userSelectedColumns[selectedDashboardTab], }) || freezedColumns[selectedDashboardTab] !== freezeInputRef.current.value) {
      setColumnSelectionState('toSave');

      setPivotOperation(false);

      setUserSelectedColumns({
        ...userSelectedColumns,
        [selectedDashboardTab]: initialSelectedColumnsState,
      });
      setFreezedColumns({
        ...freezedColumns,
        [selectedDashboardTab]: freezeInputRef ? freezeInputRef.current.value : 0,
      })
      setColumnSelectorOptions(prevState => ({ ...prevState, initialSavedColumnFieldsArr: initialSelectedColumnsState }));

      dispatch({
        type: UPDATE_COLUMNS,
        payload: {
          updatedSelectedTabColumns: {
            ...updatedSelectedTabColumns,
            [selectedDashboardTab]: initialSelectedColumnsState,
          },
          oldSelectedTabColumns: {
            ...oldSelectedTabColumns,
            [selectedDashboardTab]: userSelectedColumns[selectedDashboardTab],
          },
        },
      });
    }
    setGlobalSearchValue('');
    props.setOpenModal(false);
  };

  const onRemoveSelectedColumn = colName => {
    trackButtonClick(t(`header_names.${colName}`), `${getPageCategory()} ${pageSubCategory.columnsModal}`, 'Remove Icon')
    setInitialSelectedColumnsState(prevState => {
      const selectedColsValues = [...prevState];
      if ((selectedDashboardTab === DASHBOARD_TABS.CAMPAIGN.name && colName !== "campaign_name") || colName !== "ad_set_name")
        selectedColsValues[selectedTab] = selectedColsValues[selectedTab].filter(col => col !== colName)

      return [...selectedColsValues];
    });
  }

  const onChangeSelectionHandler = event => {
    trackButtonClick(t(`header_names.${event.target.value}`), `${getPageCategory()} ${pageSubCategory.columnsModal}`, 'Check Box')
    setInitialSelectedColumnsState(prevState => {
      const selectedColsValues = [...prevState];
      if (selectedColsValues[selectedTab].includes(event.target.value)) {
        selectedColsValues[selectedTab] = selectedColsValues[selectedTab].filter(col => col !== event.target.value)
      } else {
        selectedColsValues[selectedTab] = [...selectedColsValues[selectedTab], event.target.value]
      }

      return [...selectedColsValues];
    })
  };

  const onSelectAllHandler = (groupName, filteredOptions = []) => {
    trackButtonClick(t('button_text.select_all'), `${getPageCategory()} ${pageSubCategory.columnsModal} - ${t(`column_groups.${groupName}`)} Section`)
    setInitialSelectedColumnsState(prevState => {
      const selectedColsValues = [...prevState];
      for (const key in columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab]) {
        const colObj = columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab][key];
        if (!selectedColsValues[selectedTab].includes(colObj.displayName)) {
          if ((groupName === 'ungrouped' && !colObj.majorGroup) || colObj.majorGroup === groupName) {
            if (filteredOptions.includes(colObj.displayName)) {
              selectedColsValues[selectedTab] = [...selectedColsValues[selectedTab], colObj.displayName];
            }
          }
        }
      }
      return [...selectedColsValues]
    });
  };

  const onGlobalDeselectAllHandler = () => {
    trackButtonClick(t('button_text.deselect_all'), `${getPageCategory()} ${pageSubCategory.columnsModal}`)
    setInitialSelectedColumnsState(prevState => {
      const selectedColsValues = [...prevState];
      const initialAvailablecolumns = [...Object.entries(columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab])];
      const disabledValues = initialAvailablecolumns.map(element => element[1]).filter(element => !element.enabled).map(element => element.displayName);
      selectedColsValues[selectedTab] = [...disabledValues];

      return [...selectedColsValues];
    })
  };

  const onGlobalSearchChangeHandler = event => {
    setGlobalSearchValue(event.target.value);
  };

  useEffect(() => {
    if (props && props.tab)
      setSelectedTab(props.tab);
  }, [props.tab])

  const filterColumnsByAbility = (accessorKey) =>
    hideColumns.includes(accessorKey) ? filterByAbility : true;
  return (
    <>
      <CustomButton className={`${styles['groove_column_button_action']}`} onClick={onClickButtonHandler}>{t('button_text.columns')}</CustomButton>
      {props.modalOpen &&
        <CustomModal
          open={props.modalOpen}
          onClose={onCloseHandler}
          onAccept={onConfirmHandler}
          title={t('site_titles.select_columns')}
          onSaveText={t('button_text.ok')}
          onCloseText={t('button_text.cancel')}
          isModalWhiteBackground={true}
          isGroove={true}>
          <div className='row mt-1'>
            <div className={`col col-md-2 ${styles['column-selector-containers']}`}>
              <div className='list-group'>
                {columnSelectorOptions &&
                  columnSelectorOptions.columnGroups.map((opt, i) => {
                    if (opt[0]) {
                      let optLabel = opt[0];
                      return (
                        <Fragment key={'column_groups.' + optLabel[0].toLowerCase() + optLabel.slice(1)}>
                          <Link smooth
                            to={`#${optLabel}`}
                            className={`list-group-item list-group-item-action border-0 ${styles['columnGroups-item']} ${styles['groove_group_name']}`}>
                            {t('column_groups.' + optLabel[0].toLowerCase() + optLabel.slice(1))}
                          </Link>

                          <ul className={styles['subgroup-list']}>
                            {columnSubGroupNames(selectedDashboardTab, optLabel).map((subGroup) => {
                              return <li key={`${subGroup}_${i}`}>
                                <Link smooth
                                  to={`#${subGroup}`}
                                  className={styles['subgroup-text']}>
                                  {t('column_subgroups.' + subGroup)}
                                </Link>
                              </li>
                            }
                            )}
                          </ul>
                        </Fragment>
                      );
                    }
                  })
                }
              </div>
            </div>
            <div style={{ marginLeft: '24px' }} className={`col col-md-5 ${styles['column-selector-containers']}`}>
              <SearchInput
                placeholderText='Search...'
                inputValue={globalSearchValue}
                onChangeHandler={onGlobalSearchChangeHandler}
                style={{
                  borderRadius: '100px',
                  border: '1px solid rgba(156, 163, 175, 1)'
                }} />
              <div className='row'>
                <CustomButton className={`btn-light col-5 ${styles['button-select-all']} ${styles['groove_select_all']}`} onClick={onGlobalDeselectAllHandler}>{t('button_text.deselect_all')}</CustomButton>
              </div>
              {columnSelectorOptions && initialSelectedColumnsState && initialSelectedColumnsState.length > 0 &&
                columnSelectorOptions.columnGroups.map((colGroup, colGroupIdx) => {
                  if (colGroup[0]) {
                    let filteredSubGroups = columnSubGroupNames(selectedDashboardTab, colGroup[0]);
                    const options = [];
                    const filteredOptions = [];
                    for (const key in columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab]) {
                      const colObj = columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab][key];
                      if ((colGroup[0] === 'ungrouped' && !colObj.majorGroup) || (colObj.majorGroup === colGroup[0])) {
                        if (globalSearchValue === '' || t('header_names.' + colObj.displayName).toLowerCase().includes(globalSearchValue.toLocaleLowerCase())) {
                          if (colObj.displayName != undefined && colObj?.accessorKey && filterColumnsByAbility(colObj.accessorKey)) {
                            options.push(
                              <li className={`list-group-item border-0 ${styles['groove_subgroup_li']}`} name={colObj.columnSubGroup || 'ungrouped'} key={`${colObj.id || colObj.accessorKey}_${selectedTab}`}>
                                <input
                                  className={`form-check-input me-2 ${styles['groove_checkbox']}`}
                                  type='checkbox'
                                  checked={initialSelectedColumnsState[selectedTab].includes(colObj.header) || (selectedDashboardTab === DASHBOARD_TABS.CAMPAIGN.name && colObj.displayName === 'campaign_name') || colObj.displayName === 'ad_set_name'}
                                  onChange={onChangeSelectionHandler}
                                  value={colObj.displayName}
                                  disabled={(selectedDashboardTab === DASHBOARD_TABS.CAMPAIGN.name && colObj.displayName === 'campaign_name') || colObj.displayName === 'ad_set_name' ? true : colObj.disabled} />
                                {t('header_names.' + colObj.displayName)}
                              </li>
                            )
                            filteredOptions.push(colObj.displayName);
                          }
                        }
                      }
                    }
                    if (options.length > 0) {
                      filteredSubGroups = filteredSubGroups.concat('ungrouped');
                      return (
                        <div key={`${colGroupIdx}_${selectedTab}`}>
                          <div className={`row ${styles['groove_group_name']}`} id={colGroup[0]}>
                            <h3 className={`${styles['groove_group_name_text']}`}>{t('column_groups.' + colGroup[0][0].toLowerCase() + colGroup[0].slice(1))}</h3>
                          </div>
                          <div className='row'>
                            <CustomButton
                              className={`btn-light col-4 ${styles['button-select-all']} ${styles['groove_select_all']}`}
                              onClick={onSelectAllHandler.bind(null, colGroup[0], filteredOptions)}>{t('button_text.select_all')}</CustomButton>
                          </div>
                          {filteredSubGroups.map(subGroup => {
                            return <Fragment key={`column_subgroups.${subGroup}`}>
                              {subGroup !== 'ungrouped' &&
                                <div id={subGroup} className={styles['subGroup-name']}>{t('column_subgroups.' + subGroup)}</div>
                              }
                              <div className='row'>
                                <ul className='list-group'>
                                  {
                                    options.map(x => {
                                      if (x.props.name === subGroup) return x;
                                    })
                                  }
                                </ul>
                              </div></Fragment>
                          }
                          )}
                        </div>
                      )
                    }
                  }
                })
              }
            </div>
            <div className={`col col-md-5 ${styles['groove_selected_column_div']} ${styles['column-selector-containers']} ${styles['selected-columns-container']}`}>
              <h3 className={`${styles['groove_freeze_text']}`}>{t('site_titles.fixed_columns')}</h3>
              <div className={`${styles['div-freeze']}`}>
                <input
                  ref={freezeInputRef}
                  type="number"
                  min={0}
                  defaultValue={freezedColumns[selectedDashboardTab]} />
              </div>

              <div className={`list-group `}>
                {initialSelectedColumnsState && initialSelectedColumnsState[selectedTab].map((colName, idx) => {
                  const isDisabled = columnSelectorOptions.initialAvailableColumnObjsArr[selectedTab][colName]?.disabled;
                  return (
                    <Fragment key={t(`header_names.${colName}`)}>
                      {isDisabled &&
                        <li
                          key={`${idx}_${selectedTab}_disabled`}
                          className={`list-group-item ${styles['draggable-list-item']} ${styles['groove_selectedcolumn_li']}`} >
                          <div style={{ marginTop: '-6px' }} className='row g-0'>
                            <div className='col-sm-11 d-flex' style={{ height: '20px' }}>
                              <p className={`${styles['groove_selectedcolumn_li_text']}`}>{t('header_names.' + colName)}</p>
                            </div>
                          </div>

                          <img style={{ marginTop: '-15px' }} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_underline.png`} />
                        </li>
                      }
                      {!isDisabled && <li
                        key={`${idx}_${selectedTab}_enabled`}
                        className={`list-group-item ${styles['draggable-list-item']} ${styles['groove_selectedcolumn_li']}`}
                        draggable
                        onDragStart={(e) => dragItem.current = idx}
                        onDragEnter={(e) => dragOverItem.current = idx}
                        onDragEnd={onDragSortHandle}
                        onDragOver={(e) => e.preventDefault()} >
                        <div style={{ marginTop: '-6px' }} className='row g-0'>
                          <div className='col-sm-11 d-flex' style={{ height: '20px' }}>
                            <DragIndicatorIcon />
                            <p className={`${styles['groove_selectedcolumn_li_text']}`}>{t('header_names.' + colName)}</p>
                          </div>
                          <div className={`col-sm-1 ${styles['pointer-element']}`}><CloseIcon onClick={() => onRemoveSelectedColumn(colName)} visibility={(selectedDashboardTab === DASHBOARD_TABS.CAMPAIGN.name && colName === 'campaign_name') || colName === 'ad_set_name' ? 'hidden' : 'visible'} /></div>
                        </div>
                        <img style={{ marginTop: '-12px' }} src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_underline.png`} />
                      </li>}
                    </Fragment>
                  )
                })}
              </div>

            </div>
          </div>
        </CustomModal>}
    </>
  )
};

export default ColumnSelector;
