import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as ReactTable from '@tanstack/react-table';
import _ from 'underscore';
import { useLoaderData } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import * as Columns from '../../_helpers/columns/columns';
import CssBaseline from '@mui/material/CssBaseline';
import CampaignDashToolbar from '../campaignDash/CampaignDashToolbar';
import ShouldRender from 'common/ShouldRender';
import { useTranslation } from 'react-i18next';
import NotesEditor from '../campaignDash/NotesEditor.js';
import BudgetSegment from './BudgetSegment';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import CheckInCheckbox from '../campaignDash/CheckInCheckbox';
import {
  saveFreeText,
  saveKpiMetrics,
} from '../../_services/table';
import {
  savePacingBudgets,
  getPacingBudgets,
} from '../../_services/budgetSegment';
import { saveManagementTable } from '_services/demoLayer';
import { useUserViews } from '../../_helpers/userViewsContext';
import KPIOptions from '../campaignDash/KpiOptions';
import { getKpiMetric } from '../../_helpers/columns/columns';
import RoasKPI from './RoasKPI';
import CustomFormula from './CustomFormula';
import { rankItem } from '@tanstack/match-sorter-utils';
import { useStore } from '_helpers/storeContext';
import { importDeleteSelectedCampaigns } from '_services/campaignDash';
import AlertMessage from 'views/UI/AlertMessage';
import { getNotificationObject } from 'views/UI/notificationInfo';
import PlatformBudget from './PlatformBudget';
import {
  getPlatformAdSetBudget,
  getPlatformCampaignBudget,
} from '_services/platformBudget';
import {
  trackButtonClick,
  getPageCategory,
  pageSubCategory,
  capitalizeFirstLetter,
} from '_helpers/Utils/segmentAnalyticsUtil';
import styles from '../../_theme/modules/campaingDash/CampaignDash.module.css';
import {
  CAMPAIGN_IDS,
  RESET_CAMPAIGNS,
  SELECTED_BULK_OPERATION,
  SHOW_NOTIFICATION,
} from 'common/Redux/Constants/index';
import { DASHBOARD_TABS } from '_helpers/Utils/dashboardUtil';
import DemoDataEditor from '../campaignDash/DemoDataEditor.js';
import { getColumnsBeingCalculated } from '_helpers/columns/columnsBeingCalculated';
import { BULK_EDIT_OPTIONS } from 'views/campaignDash/BulkComponents/BulkEdit';

//TODO: When having backend, test campaign Name and status editing
const Table = (props) => {
  const { tab, selectedDashboardTab } = props;
  const { t } = useTranslation(['common']);
  const { availableDashData } = useLoaderData();
  const [columnsBeingCalculated, setColumnsBeingCalculated] = useState([]);
  const { userSelectedColumns, userSelectedView } = useUserViews();
  const [budgetSegmentOpen, setBudgetSegmentOpen] = useState(false);
  const [platformBudgetOpen, setPlatformBudgetOpen] = useState(false);
  const [budgetSegmentData, setBudgetSegmentData] = useState(undefined);
  const [platformBudgetData, setPlatformBudgetData] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRoas, setIsOpenRoas] = useState(false);
  const [isOpenCustomFormula, setIsOpenCustomFormula] = useState(false);
  const [kpiData, setKpiData] = useState(false);
  const [kpiParams, setKpiParams] = useState({});
  const [notificationState, setNotificationState] = useState({
    requestFinished: false,
    state: '',
    strongMessage: '',
    message: '',
    alertType: '',
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [grouping, setGrouping] = useState([]);
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [demoDataModalOpen, setDemoDataModalOpen] = useState(false);
  const [cellData, setCellData] = useState(false);
  const [clearCampaignId, setClearCampaignId] = useState(false);
  const budgetEditorRef = useRef(null);
  const budgetSegmentRef = useRef(null);
  const { showNotification } = useSelector((store) => store.getCommonData);
  const {
    bulkOperation,
    selectedCampaigns: selectedCampaignsRedux,
  } = useSelector((store) => store.getCampaignData);

  const dispatch = useDispatch();

  const {
    store: { currentUser, selectedDash },
    setStore,
  } = useStore();

  let tableColumnHeaders = [];

  tableColumnHeaders = useMemo(() => {
    let listOfColumns = Columns.processSelectedColumns(
      userSelectedColumns[selectedDashboardTab],
      selectedDashboardTab
    ).filter((col) => col !== undefined);
    listOfColumns = listOfColumns.filter(
      (item, index) =>
        listOfColumns.findIndex(
          (elem) => elem.accessorKey === item.accessorKey
        ) === index
    ); // Remove duplicates and then remove undefined
    const filterByAbility = currentUser?.userAbilitiesList?.some(
      (ability) => ability?.abilityId === 7
    );
    const hideColumns = [
      'budget_recommendation',
      'ad_set_budget_recommendation',
    ];

    return !filterByAbility
      ? listOfColumns.filter((col) => !hideColumns.includes(col.accessorKey))
      : listOfColumns; // Remove column if user doesn't have that ability
  }, [userSelectedColumns, tab]);

  useEffect(() => {
    const clearNotification = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3500));
      setNotificationState({ ...getNotificationObject('clear') });
    };

    if (notificationState.requestFinished) {
      const intervalId = setInterval(clearNotification, 3500);

      // Cleanup the interval when the component unmounts or when necessary
      return () => clearInterval(intervalId);
    }
  }, [notificationState]);

  const updateMyData = (rowIndex, columnId, value) => {
    const updatedRows = [...props.data];
    const updatedRow = {
      ...updatedRows[rowIndex],
      [columnId]: value,
    };
    updatedRows[rowIndex] = updatedRow;
    props.updateTableData(updatedRows, true);
  };

  const maskedKeys = [
    { key: "campaign_name", value: "nameMaskedValue" },
    { key: "ad_set_name", value: "nameMaskedValue" },
    { key: "account", value: "accountMaskedValue" },
    { key: "budget_group", value: "budgetGroupMaskedValue" },
    { key: "ad_set_campaign_group", value: "budgetGroupMaskedValue" },
    { key: "budget_recommendation", value: "budgetRecMaskedValue" },
    { key: "ad_set_budget_recommendation", value: "budgetRecMaskedValue" },
    { key: "kpi1_units_delivered_current_segment", value: "kpi1UnitsDeliveredMaskedValue" },
    { key: "publisher", value: "publisherMaskedValue" }
  ];

  const updateMaskedData = (rowIndex, columnId, value, originalColumn, tooltipValue = null) => {
    const updatedRows = [...props.data];
    const updatedRow = {
      ...updatedRows[rowIndex],
      maskedValues: {
        ...updatedRows[rowIndex].maskedValues,
        [columnId]: (value) ? value : updatedRows[rowIndex][originalColumn],
      },
    };

    if (tooltipValue !== undefined)
      updatedRow.maskedValues.budgetRecTooltipMaskedValue = tooltipValue;
    updatedRows[rowIndex] = updatedRow;
    props.updateTableData(updatedRows, false);
  };


  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const defaultColumn = useMemo(
    () => ({
      minWidth: 70,
      width: 175,
      maxWidth: 1000,
      canGroupBy: false,
    }),
    []
  );

  const table = ReactTable.useReactTable({
    data: props.data,
    columns: tableColumnHeaders,
    defaultColumn,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableGlobalFilter: true,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      // columnFilters,
      globalFilter,
      grouping,
    },
    // onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getFilteredRowModel: ReactTable.getFilteredRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
    getGroupedRowModel: ReactTable.getGroupedRowModel(),
    getExpandedRowModel: ReactTable.getExpandedRowModel(),
    // getPaginationRowModel: ReactTable.getPaginationRowModel(),
    // getFacetedRowModel: ReactTable.getFacetedRowModel(),
    // getFacetedUniqueValues: ReactTable.getFacetedUniqueValues(),
    // getFacetedMinMaxValues: ReactTable.getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    autoResetExpanded: false,
  });

  let firstPageRows = table.getRowModel().rows.slice(0, 250);
  let preGlobalFilteredRows = table.getPreFilteredRowModel().rows;
  const tableRowCount = firstPageRows.length;
  const headerGroups = table.getHeaderGroups();

  const handleClick = (e, id) => {
    const updatedRows = [...props.data];
    updatedRows[id] = {
      ...updatedRows[id],
      isSelected: e?.target?.checked,
    };
    props?.updateCheckedTableData?.(updatedRows);
  };

  const getValueToShow = (cell) => {
    let value = cell.getValue();
    const maskedValues = cell.row.original.maskedValues;
    const header = cell.column.columnDef.header;
    const match = maskedKeys.find(pattern => header === pattern.key);

    if (match && maskedValues[match.value]) {
      value = maskedValues[match.value];
    }
  
    return value;
  };
  

  const getColumnToUpdate = (cellData) => {
    const columnId = cellData.cell.column.id;
    const match = maskedKeys.find(pattern => columnId === pattern.key);
    
    return match ? match.value : columnId;
  };
  

  const handleSelectAllClick = (event) => {
    const updatedRows = [...props.data];
    updatedRows.forEach((row) => {
      row.isSelected = event?.target?.checked;
    });
    props?.updateCheckedTableData?.(updatedRows);
  };

  const handleNotesEditor = (data, mode) => {
    trackButtonClick(
      t(`header_names.${data.cell.column.columnDef.accessorKey}`),
      `${getPageCategory()} ${pageSubCategory.rowValue}`,
      'Row'
    );
    setCellData(data);

    if(mode === 'notesEditor')
      setEditorModalOpen(true);

    if(mode === 'demoEditor' || mode === 'demoNumberEditor')
      setDemoDataModalOpen(true);
  };

  const handleSaveNotesData = async (data) => {
    const result = await saveFreeText({ notesData: data });
      if (result.statusCode === 200) {
        updateMyData(cellData.cell.row.id, cellData.cell.column.id, data.value);
        setEditorModalOpen(false);
        return true;
      }
      else {
        return result.statusDescription;
      }
  };

  const handleSaveDemoData = async (data, newValue, tooltipValue = null) => {
    const result = await saveManagementTable({ data });
    if (result.statusCode === 200) {
      updateMaskedData(cellData.cell.row.id, getColumnToUpdate(cellData), newValue, cellData.cell.column.id, tooltipValue);
      setDemoDataModalOpen(false);
      return true;
    } else {
      return result.statusDescription;
    }
  };
  const handleCheckInData = (data) => {
    saveFreeText({ notesData: data }).then((result) => {
      if (result.statusCode === 200) {
        props.refetchTableData();
      } else
        dispatch({
          type: CAMPAIGN_IDS,
          payload: [],
        });
      setEditorModalOpen(false);
    });
  };

  const handleSaveKpiData = (value) => {
    let params = {
      campaignDashColumnKey: kpiParams.campaignDashColumnKey,
      campaignSelectedId: kpiParams.campaignSelectedId,
      platformId: kpiParams.platformId,
      dashboardUserId: kpiParams.dashboardUserId,
      columns: userSelectedColumns[selectedDashboardTab]?.[0]?.map((column) => ({
        CampaignDashColumnKey: column,
      })),
    };
    Object.assign(params, value);

    const { cell } = kpiParams;

    setColumnsBeingCalculated(
      getColumnsBeingCalculated(cell.column.columnDef.header)
    );
    saveKpiMetrics({ kpiData: params })
      .then(async (result) => {
        result.statusCode === 200
          ? await props.fetchCampaignsHandler(
            userSelectedColumns[selectedDashboardTab],
            userSelectedView.columns?.[0],
            kpiParams.cell.row.id,
            kpiParams.campaignSelectedId,
            true
          )
          : dispatch({
            type: CAMPAIGN_IDS,
            payload: [],
          });
      })
      .finally(() => {
        // Reset the columns being calculated
        setColumnsBeingCalculated([]);
      });
  };

  const freeTextEditor = () => (
    <NotesEditor
      openModal={editorModalOpen}
      setOpenModal={setEditorModalOpen}
      title={`${t('modal_text.edit')} ${t(`header_names.${cellData.cell.column.id}`)}`}
      formHeight='450px'
      onSaveText={t('button_text.ok')}
      onCloseText={t('button_text.cancel')}
      data={cellData}
      saveNotesData={handleSaveNotesData}
      updateTableData={props?.updateTableData}
      tableData={props?.data}
    />
  );

  const demoTextEditor = () => (
    <DemoDataEditor
      openModal={demoDataModalOpen}
      setOpenModal={setDemoDataModalOpen}
      title={`${t('modal_text.demo_data')}: ${t(
        'header_names.' + cellData.cell.column.id
      )}`}
      formHeight='450px'
      onSaveText={t('button_text.ok')}
      onCloseText={t('button_text.cancel')}
      data={cellData}
      saveDemoData={handleSaveDemoData}
      getValueToShow={getValueToShow}
    ></DemoDataEditor>
  );

  const handleRowClick = (selectedCampaignId, cell, colIdentifier = '') => {
    trackButtonClick(
      t(`header_names.${cell.column.columnDef.accessorKey}`),
      `${getPageCategory()} ${pageSubCategory.rowValue}`,
      'Row'
    );
    if (
      ![1, 4, 5, 3, 2,6].includes(cell.row.original.platform) &&
      colIdentifier === 'kpi'
    )
      return;
    if (currentUser) {
      if (colIdentifier === 'kpi') {
        const kpiDataArr = [];
        Object.entries(getKpiMetric(cell.row.original.platform)).map(
          (option) => {
            kpiDataArr.push({ label: option[1], value: option[0] });
          }
        );

        setKpiData(kpiDataArr);
        setIsOpen(true);
        let params = {
          campaignSelectedId: selectedCampaignId,
          campaignDashColumnKey: cell.column.id.replace('_', ''),
          cell: cell,
          platformId: cell.row.original.platform,
          dashboardUserId: selectedDash.userId,
          campaignKey: cell.row.original.campaign_key
        };
        setKpiParams(params);
        props.setTargetRowId(cell?.row?.id);
      } else if (colIdentifier === 'pacing_budget') {
        const { currency_code, platform, campaign_key } = cell?.row?.original;
        props.setTargetRowId(cell?.row?.id);
        budgetSegmentRef.current = {
          budgetCurrencyCode: currency_code,
          platformId: platform,
          campaignSelectedId: selectedCampaignId,
        };
        setBudgetSegmentOpen(true);
        getPacingBudgets({
          campaignKey: campaign_key,
          platformId: platform,
          userId: selectedDash.userId,
        }).then((result) => {
          if (result.statusCode === 200) {
            setBudgetSegmentData(result);
          } else {
            setBudgetSegmentData(
              getNotificationObject('error', result.statusDescription)
            );
          }
        });
      } else if (colIdentifier === 'platform_budget') {
        const {
          platform_ad_set_budget,
          platform_campaign_budget,
          budgetlevel,
          platform,
          currency_code,
          ad_set_key,
        } = cell?.row?.original;
        const noValuesArray = ['Not Applicable', '0', 'NotApplicable', null];
        const isCampgnOrAdSet = !noValuesArray.includes(platform_ad_set_budget)
          ? 'Ad Set'
          : !noValuesArray.includes(platform_campaign_budget)
            ? 'Campaign'
            : 'Not Generated';
        setPlatformBudgetOpen(true);
        budgetEditorRef.current = {
          cellField: [
            'platform_ad_set_budget',
            'platform_campaign_budget',
          ].includes(cell?.column?.id)
            ? cell.column.id
            : ['Not Generated'].includes(budgetlevel)
              ? isCampgnOrAdSet
              : budgetlevel,
          platformId: platform,
          userId: currentUser.id,
          campaignDashUserId: selectedDash?.userId,
          campaignDashViewId: userSelectedView?.viewId,
          columns: userSelectedColumns[selectedDashboardTab]?.[0]?.map((column) => ({
            CampaignDashColumnKey: column,
          })),
          campaignSelectedId: selectedCampaignId,
          currency_code: currency_code,
          recommendationAbility: currentUser.userAbilitiesList?.some(
            (ability) => ability?.abilityId === 7
          ),
          adSetKey: ad_set_key,
        };
        if (
          [
            'platform_campaign_budget',
            'Campaign',
          ].includes(budgetEditorRef.current.cellField)
        ) {
          getPlatformCampaignBudget({
            campaignId: selectedCampaignId,
            userId: selectedDash?.userId,
          }).then((result) => {
            result?.statusCode === 200 && result?.json?.length
              ? setPlatformBudgetData(result)
              : setPlatformBudgetData(
                getNotificationObject('error', result.statusDescription)
              );
          });
        } else {
          getPlatformAdSetBudget({
            campaignId: selectedCampaignId,
            adSetkey: ad_set_key,
          }).then((result) => {
            result?.statusCode === 200 && result?.json?.length
              ? setPlatformBudgetData(result)
              : setPlatformBudgetData(
                getNotificationObject('error', result.statusDescription)
              );
          });
        }
      }
    }
  };

  const handleSaveBudgetData = ({ data, campaignSelectedId }) => {
    dispatch({
      type: SELECTED_BULK_OPERATION,
      payload: {
        option: BULK_EDIT_OPTIONS.PACING,
        state: false,
      },
    });
    trackButtonClick(
      t('button_text.ok'),
      `${getPageCategory()} ${pageSubCategory.budgetAndDatesModal}`
    );

    // Indicate that the columns are being calculated
    setColumnsBeingCalculated(getColumnsBeingCalculated('pacing_budget'));
    let campaignsSelectedIds = [];
    if (campaignSelectedId) campaignsSelectedIds = [campaignSelectedId];
    else
      campaignsSelectedIds = selectedCampaignsRedux?.map(
        (data) => data.campaignId
      );

    const payload = {
      budgetSegments: data,
      campaignsSelectedIds,
      campaignDashUserId: selectedDash?.userId,
      campaignDashViewId: userSelectedView?.viewId,
      columns: userSelectedColumns[selectedDashboardTab]?.[0]?.map((column) => ({
        CampaignDashColumnKey: column,
      })),
    };
    savePacingBudgets(payload)
      .then((result) => {
        if (result) {
          const { statusCode, statusDescription } = result;
          let notificationObj = getNotificationObject(
            'error',
            statusDescription
          );
          if (statusCode === 200) {
            props.updateCampaignTableData({ data: result.json });
            if (campaignsSelectedIds.length) {
              notificationObj = getNotificationObject(
                'success',
                statusDescription
              );
            }
          }
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: notificationObj,
          });
        }
      })
      .finally(() => {
        // Reset the columns being calculated
        setColumnsBeingCalculated([]);
        props.setTargetRowId(null);
        dispatch({
          type: SELECTED_BULK_OPERATION,
          payload: undefined,
        });
      });
  };

  const checkInCheckbox = (rowData, cellData, campaignId, campaignKey) => {
    let data = { cellData, rowData, campaignId, campaignKey };
    return (
      <CheckInCheckbox
        data={data}
        handleCheckInClick={(data) => {
          dispatch({
            type: CAMPAIGN_IDS,
            payload: [data.campaignSelectedId],
          });
          handleCheckInData(data);
        }
        }
      ></CheckInCheckbox>
    );
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const closeRoasPopup = () => {
    setIsOpenRoas(false);
  };

  const handleSelectOption = (option) => {
    trackButtonClick(
      capitalizeFirstLetter(option),
      `${getPageCategory()} ${pageSubCategory.kpiModal}, Dropdown`
    );
    setIsOpen(false);
    if (option === 'roas') setIsOpenRoas(true);
    if (option === 'custom_formula') setIsOpenCustomFormula(true);
  };

  const selectedCampaigns = () => {
    const { data } = props;
    const updatedRows = [...data];
    const selectedRows = updatedRows
      .filter((row) => row.isSelected)
      .map((row) => {
        return {
          id:
            selectedDashboardTab === DASHBOARD_TABS.CAMPAIGN.name
              ? row.campaignId
              : row.ad_set_key,
        };
      });
    return { selectedRows, updatedRows };
  };
  const onRemoveClick = () => {
    dispatch({ type: RESET_CAMPAIGNS });

    trackButtonClick(t('button_text.remove'), getPageCategory());
    const { refetchTableData, updateTableData } = props;
    const { selectedRows, updatedRows } = selectedCampaigns();

    importDeleteSelectedCampaigns({
      url: `/campaignselector/deleteselectedcampaigns`,
      selectedRows,
    }).then((result) => {
      if (result.statusCode === 200) {
        const updatedRowsAfterRemove = updatedRows.filter(
          (row) => !row.isSelected
        );
        updateTableData(updatedRowsAfterRemove);
        refetchTableData();
      } else setNotificationState({ ...getNotificationObject('error') });
    });
  };
  const onImportClick = () => {
    const { selectedRows } = selectedCampaigns();
    const { updateTableData } = props;
    dispatch({ type: RESET_CAMPAIGNS });
    importDeleteSelectedCampaigns({
      url: '/campaigndash/importselectedcampaigns',
      selectedRows,
    }).then((result) => {
      const removeSelection = [...props?.data];
      removeSelection.forEach((row) => delete row.isSelected);
      updateTableData?.(removeSelection, true);
      if (availableDashData?.length) {
        const currentUserDash = availableDashData.filter(
          (dash) => dash.userId === currentUser?.id
        )?.[0];
        setStore({
          selectedDash: {
            userId: currentUserDash.userId,
            email: currentUserDash.email,
            name: currentUserDash.name,
            dashId: currentUserDash.id,
          },
        });
      }
      // Error msg needs to be shown only for unauthorized users and success msg
      // for all the imported campaigns
      result?.json
        ? setNotificationState({
          ...getNotificationObject('error', result.json),
        })
        : setNotificationState({
          ...getNotificationObject(
            'success',
            t('validation_messages.import_success_msg')
          ),
        });
    });
  };

  useEffect(() => {
    if (!platformBudgetOpen) {
      setPlatformBudgetData(undefined);
      budgetEditorRef.current = null;
    }
  }, [platformBudgetOpen]);

  useEffect(() => {
    if (!budgetSegmentOpen) {
      setBudgetSegmentData(undefined);
      budgetSegmentRef.current = null;
    }
  }, [budgetSegmentOpen]);

  useEffect(() => {
    if (clearCampaignId)
      dispatch({
        type: CAMPAIGN_IDS,
        payload: [],
      });
    setClearCampaignId(false);
  }, [clearCampaignId]);

  const updateDashboardTabData = (data) => {
    const { updateCampaignTableData, updateAdSetData } = props;
    switch (selectedDashboardTab) {
      case DASHBOARD_TABS.AD_SET.name:
        updateAdSetData({ data });
        break;
      default:
        updateCampaignTableData({ data });
        break;
    }
  };

  const updateAndClearData = (data) => {
    data && updateDashboardTabData(data);
    setPlatformBudgetOpen(false);
  };

  useEffect(() => {
    /*
      This useEffect is to handle the bulk operation
    */
    if (bulkOperation) {
      const { option, state } = bulkOperation;
      if (state) {
        if (option === BULK_EDIT_OPTIONS.PACING) {
          const getCurrencyList = _.uniq(
            selectedCampaignsRedux?.map((campaign) => campaign.currency_code)
          );
          const data = {
            json: [],
          };
          setBudgetSegmentData(data);
          budgetSegmentRef.current = {
            budgetCurrencyCode:
              getCurrencyList.length === 1 ? getCurrencyList[0] : null,
          };
          setBudgetSegmentOpen(true);
        }
      }
    }
  }, [bulkOperation]);

  return (
    <div>
      {(notificationState.requestFinished || showNotification) && (
        <AlertMessage {...notificationState} />
      )}

      {demoDataModalOpen && demoTextEditor()}
      {editorModalOpen && freeTextEditor()}

      <CssBaseline />
      <div>
        {isOpen && (
          <KPIOptions
            openModal={isOpen}
            setOpenModal={closePopup}
            formHeight='450px'
            data={kpiData}
            selectOption={handleSelectOption}
            handleSave={handleSaveKpiData}
            params={kpiParams}
          ></KPIOptions>
        )}

        {isOpenRoas && (
          <RoasKPI modalOpen={isOpenRoas} setOpenModal={closeRoasPopup} />
        )}

        {isOpenCustomFormula && (
          <CustomFormula
            modalOpen={isOpenCustomFormula}
            setOpenModal={() => setIsOpenCustomFormula(false)}
            handleSave={handleSaveKpiData}
            params={kpiParams}
            setClearCampaignId={setClearCampaignId}
          />
        )}

        {budgetSegmentOpen && (
          <BudgetSegment
            budgetSegmentData={budgetSegmentData}
            setOpenModal={setBudgetSegmentOpen}
            modalOpen={budgetSegmentOpen}
            saveData={handleSaveBudgetData}
            budgetSegment={budgetSegmentRef?.current}
            bulkOperation={bulkOperation}
            dispatch={dispatch}
            setClearCampaignId={setClearCampaignId}
          />
        )}
        {platformBudgetOpen && (
          <PlatformBudget
            platformBudgetData={platformBudgetData}
            onModelClose={(data) => updateAndClearData(data)}
            modalOpen={platformBudgetOpen}
            budgetEditor={budgetEditorRef?.current}
            updateDashboardData={(data) => updateDashboardTabData(data)}
            setClearCampaignId={setClearCampaignId}
          />
        )}
        <CampaignDashToolbar
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
          selectedAccount={props.selectedAccount}
          setSelectedAccount={props.setSelectedAccount}
          selectedDashboardTab={selectedDashboardTab}
          setIsRefetchingCampaignDashData={
            props.setIsRefetchingCampaignDashData
          }
          fetchCampaignsHandler={props.fetchCampaignsHandler}
          tableData={props.data}
          onRemoveClick={onRemoveClick}
          updateTableData={props?.updateTableData}
          onImportClick={onImportClick}
          headerGroups={table?.getHeaderGroups()}
          tab={tab}
        />
        <div
          className={`col col-sm-12 ${styles['groove_main_table_container']}`}
        >
          <div className={`col col-sm-12 ${styles['groove_main_container']}`}>
            <table className='table table-striped'>
              <TableHeader
                headerGroups={headerGroups}
                tableRowCount={tableRowCount}
                handleSelectAllClick={handleSelectAllClick}
                table={table}
                tableData={props?.data}
                selectedDashboardTab={selectedDashboardTab}
              />
              <ShouldRender
                ifTrue={!props.isLoading && !props.isRefetchingCampaignDashData}
              >
                <TableBody
                  // getTableBodyProps={getTableBodyProps} // this is no longer available, need to do something like table.getTableBodyPropsHandler() to get handler
                  firstPageRows={firstPageRows}
                  // prepareRow={prepareRow} // this is no longer available,
                  handleClick={handleClick}
                  handleRowClick={handleRowClick}
                  tab={tab}
                  handleNotesEditor={handleNotesEditor}
                  checkInCheckbox={checkInCheckbox}
                  table={table}
                  columnsAdded={props.columnsAdded}
                  columnsBeingCalculated={columnsBeingCalculated}
                  startSpinner={props.startSpinner}
                  targetRowId={props.targetRowId}
                  selectedDashboardTab={selectedDashboardTab}
                  updateDashboardData={(data) => updateDashboardTabData(data)}
                  getValueToShow={getValueToShow}
                />
              </ShouldRender>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  tab: PropTypes.number,
  selectedAccount: PropTypes.object,
  setSelectedAccount: PropTypes.func,
  dateRange: PropTypes.array,
  setDateRange: PropTypes.func,
  selectedEntities: PropTypes.object,
  setSelectedEntities: PropTypes.func,
  updateTableData: PropTypes.func,
  tableIsEditing: PropTypes.bool,
  setTableIsEditing: PropTypes.func,
  isLoading: PropTypes.bool,
  viewOptions: PropTypes.array,
  setViewOptions: PropTypes.func,
};

export default Table;
