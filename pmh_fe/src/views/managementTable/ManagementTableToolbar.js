import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import GlobalFilter from '../shared/GlobalFilter';
import { SavedViewsSelector } from '../shared/SavedViewsSelector/SavedViewSelector';
import DateRangeSelector from '../shared/DateRangeSelector';
import {
  allColumnsForColumnSelector,
  columnGroupNames,
  platformTabHeaders,
} from '../../_helpers/columns/columns';
import AccountSelector from '../shared/AccountSelector';
import styles from '../../_theme/modules/managementTable/ManagementTableToolbar.module.css';
import ColumnSelector from '../shared/ColumnSelector';
import CustomNavTabs from '../shared/CustomNavTabs';
import { useTranslation } from 'react-i18next';
import CustomButton from 'views/UI/CustomButton';
import { SelectedCampaignsProvider } from '_helpers/SelectedCampaignsContext';
import CampaignSelector from 'views/shared/CampaignSelector';
import { useStore } from '_helpers/storeContext';
import ExportTableComponent from 'views/shared/ExportTableComponent';
import { getPlatformsInfoById } from '../../_helpers/Utils/availablePlatformsInfo';
import { trackButtonClick,getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';

// NOTE: Disabling date range selection in column selector modal, because it is heavy handed.
// It edits the column fields objects, so much would need change.
// Instead, putting a date picker in info bar.
// const columnSelectorOptions = (selectedColumns, setSelectedColumns, platform) => {
//   return {
//     initialAvailableColumnObjsArr: allColumnsForColumnSelector(platform),
//     initialSavedColumnFieldsArr: selectedColumns,
//     saveColumnsCallback: (columns, options) => {
//       setSelectedColumns(columns); },
//     standardPeriods: [],
//     // opt out of date range selector.
//     currentPeriods: [],
//     // opt out of frozen columns on each tab.
//     initialFrozenCols: platformTabHeaders[platform].map(() => undefined),
//     tabs: {
//       options:
//       {
//         selectedIndex: 0
//       },
//       tabs: []
//     },
//     tabHeaders: platformTabHeaders[platform],
//     disableCalcCols: true,
//     tableGroup: 'campaign_mgmt2',
//     columnGroups: Array.from(columnGroupNames(platform), name => [name, ['']]).concat([['ungrouped', ['']]])
//   };
// };

const TableToolbar = (props) => {
  const { t } = useTranslation(['common']);
  const tabs = [t('tabs.campaigns'), t('tabs.adsets'), t('tabs.ads')];
  const PUBLICURL = import.meta.env.VITE_PUBLIC_URL === '/' ? '' : import.meta.env.VITE_PUBLIC_URL;

  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [campSelectorModalOpen, setCampSelectorModalOpen] = useState(false);
  const [selectedCampaignAccount, setSelectedCampaignAccount] = useState();
  const [showRemove, setShowRemove] = useState(false);
  const {
    store: { currentUser, selectedDash },
  } = useStore();

  const tabStylesRefresh = (idx) => {
    trackButtonClick(tabs[idx], getPageCategory(), 'Tab')
    if (!props.tableIsEditing) {
      props.setTab(idx);
    }
  };

  const handleOnCampSelectorModalOpen = () => {
    setCampSelectorModalOpen(true);
    props.setSelectedAccount({ value: null, label: null, platform: null });
  };

  const campSelectorModalCancel = () => {
    setCampSelectorModalOpen(false);
    trackButtonClick(t('button_text.cancel'),`${getPageCategory()} ${pageSubCategory.campaignModal}`)
  };

  const platformInfo = selectedCampaignAccount && getPlatformsInfoById(selectedCampaignAccount.platformId);

  useEffect(() => {
    const { tableData } = props;
    const isCheckedValue = tableData?.filter((row) => row.isSelected).length > 0;
    const userDashboardView = currentUser?.id === selectedDash?.userId;
    setShowRemove(isCheckedValue && userDashboardView);
  }, [props]);

  return (
    <div>
      <nav className='navbar navbar-default'>
        {selectedCampaignAccount && selectedCampaignAccount.name &&
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platformInfo ? platformInfo.icon : ''}`}
              style={{ 'max-width': '23px', 'max-height': '23px' }} />
            <span style={{ display: 'block', marginLeft: '10px' }}>
              {selectedCampaignAccount.name}
            </span>
          </div>
        }
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <ColumnSelector
            setOpenModal={setColumnSelectorOpen}
            modalOpen={columnSelectorOpen}
            tabHeaders={platformTabHeaders[props.platform]}
            tab={props.tab}
            platform={props.platform}
            fetchCampaignsHandler={props.fetchCampaignsHandler}
            userAbilitiesList={currentUser?.userAbilitiesList}
            isDash={false}
          />
          <CustomButton
            className='btn-light'
            onClick={() => handleOnCampSelectorModalOpen()}
          >
            {t('button_text.select_campaigns')}
          </CustomButton>
          {campSelectorModalOpen && (
            <SelectedCampaignsProvider>
              <CampaignSelector
                viewCode='Mgmt'
                openModal={campSelectorModalOpen}
                onClose={() => setCampSelectorModalOpen(false)}
                onCancel={campSelectorModalCancel}
                refetchTableData={props.refetchTableData}
                setIsRefetchingCampaignDashData={props.setIsRefetchingCampaignDashData}
                setSelectedCampaignAccount={setSelectedCampaignAccount}
              />
            </SelectedCampaignsProvider>
          )}
          <DateRangeSelector
            dateRange={props.dateRange}
            dateRangeType={props.dateRangeType}
            setDateRange={props.setDateRange}
            setDateRangeType={props.setDateRangeType}
            handleOkClick={props.handleOkClick}
          />
          <SavedViewsSelector
            // setSelectedColumns = {props.setSelectedColumns}
            // selectedColumns = {props.selectedColumns}
            platform={props.platform}
            isDash={false}
            setIsRefetchingCampaignDashData={
              props.setIsRefetchingCampaignDashData
            }
          // viewOptions={props.viewOptions}
          // setViewOptions={props.setViewOptions}
          />
        </div>
      </nav>
      <nav className='navbar navbar-default mt-3 nav-tabs'>
        <div className={styles.tabsContainer}>
          <CustomNavTabs
            tabHeaders={tabs}
            selectedTab={props.tab}
            setSelectedTab={tabStylesRefresh}
          />
        </div>
        <div className={styles.searchContainer}>
          {showRemove && (
            <CustomButton
              className='btn-light'
              onClick={() => props?.onRemoveClick()}
              btntitle={t('button_text.removeToolTip')}
            >
              {t('button_text.remove')}
            </CustomButton>
          )}
          <ExportTableComponent
            headerGroups={props?.headerGroups}
            tableData={props?.tableData}
          />
          <GlobalFilter
            preGlobalFilteredRows={props.preGlobalFilteredRows}
            globalFilter={props.globalFilter}
            setGlobalFilter={props.setGlobalFilter}
            classSeachInput={styles.searchInput}
          />
        </div>
      </nav>
    </div>
  );
};

TableToolbar.propTypes = {
  preGlobalFilteredRows: PropTypes.array.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  // globalFilter: PropTypes.undefined,
  tab: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
  selectedAccount: PropTypes.object.isRequired,
  setSelectedAccount: PropTypes.func.isRequired,
  // availableAccounts: PropTypes.array,
  selectedColumns: PropTypes.array.isRequired,
  // setSelectedColumns: PropTypes.func.isRequired,
  dateRange: PropTypes.array.isRequired,
  setDateRange: PropTypes.func.isRequired,
  tableIsEditing: PropTypes.bool.isRequired,
  setTableIsEditing: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  platform: PropTypes.string.isRequired,
  // viewOptions: PropTypes.object,
  setViewOptions: PropTypes.func.isRequired,
};

export default TableToolbar;
