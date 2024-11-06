/*import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as _ from 'underscore';

import * as Columns from '../../_helpers/columns/columns';
import * as Data from '../../_services/api';
import Table from '../shared/Table';
import { joinEntitiesStats } from '_helpers/Utils/managementTableUtil';
import { UserViewsProvider, useUserViews } from '../../_helpers/userViewsContext';
import { fetchAvailableUsersWithCampaigns } from '_services/campaignDash';
import { useUserInfo } from '_helpers/userInfoContext';
import { useStore } from '_helpers/storeContext';
import { fetchSavedViews } from '_services/savedViews';

const defaultAccount = (availableAccounts) => {
  // TODO if no availableAccounts? show error popup?
  return availableAccounts.at(0);
};

const TEN_MINS_MS = 60 * 10 * 1000;

// NOTE data fetching strategy:
// The app will always page through all campaign entity data so that all campaigns can be searched.
// The app will page through all child entities that correspond to parent selection.
// The app will display up to 250 entities on the page.
const ManagementTable = () => {
  const { loadedUserSavedViews,
    selectedDashInfo,
    loaderInitialSelectedView } = useLoaderData();
  const { userSelectedView,
    fetchSavedViews,
    setColumnSelectionState } = useUserViews();
  // TODO: account state should also have platform name
  const [selectedAccount, setSelectedAccount] = useState({
    value: null,
    label: null,
    platform: null,
  });

  const userInfo = useUserInfo();

  const { store, setStore } = useStore();

  const [tab, setTab] = useState(0);
  let selectedPlatform = selectedAccount.platform || 'linkedin'; //To avoid issue when platform is null

  let defSelected = [];
  const [selectedColumns, setSelectedColumns] = useState(defSelected);
  if (
    Columns.processSelectedColumns(
      selectedColumns,
      tab,
      selectedPlatform
    ).includes(undefined)
  )
    setSelectedColumns(defSelected); //Walk around to avoid weird issue with selected Columns state when selecting a different platform
  const [viewSelectorOptions, setViewSelectorOptions] = useState([]);
  const [viewSelectedOption, setViewSelectedOption] = useState([]);

  React.useEffect(() => {
    setViewSelectorOptions([]);
    setViewSelectedOption([]);
  }, [selectedColumns]);

  const columns = Columns.processSelectedColumns(
    selectedColumns,
    tab,
    selectedPlatform
  );
  const [dateRange, setDateRange] = useState([
    new Date('2022/12/01'),
    new Date(),
  ]);
  const [dateRangeType, setDateRangeType] = useState(0);
  const [isFilterByDate, setIsFilterByDate] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
  });
  const [tableIsEditing, setTableIsEditing] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isRefetchingData, setIsRefetchingData] = useState(false);

  const firstState = 'saved';
  const [dropdownState, setDropdownState] = useState(firstState);
  const [dragDropChange, setDragDropChange] = useState(false);
  const updateTableData = (updateTab, rowIndex, columnId, value) => {
    if (tab !== updateTab) {
      return;
    }
    setTableData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const updateDateRange = (value) => {
    setDateRange([value.startDate, value.endDate]);
  };

  const handleOkClick = (value) => {
    setDateRange([value.startDate, value.endDate]);
    setIsFilterByDate(true);
  };

  const fetchManagementTablesHandler = async (updatedColumns = [], oldColumns = []) => {
    // TO DO: remove updatedColumns and related logic when cache support is added
    let columns = [];
    let columnsAdded = [];
    if (dragDropChange) { //Need this validation to avoid re-fetching campaigns when using drag and drop functionality in the table
      setDragDropChange(false);
      return tableData;
    }

    if (updatedColumns && updatedColumns.length > 0) {
      columns = updatedColumns[0];
      columnsAdded = updatedColumns[0].filter(col => !oldColumns[0].includes(col));
      setColumnsAdded(columnsAdded);
      setStartSpinner(true);
    }
    else if (userSelectedView && userSelectedView.columns[0].length) {
      columns = userSelectedView.columns[0];
    }
    else {
      columns = loaderInitialSelectedView.columns[0];
    }

    const data = userSelectedView && userInfo ?
      await Data.fetchDashCampaigns({
        columns: columns,
        viewId: userSelectedView ? userSelectedView.viewId : null,
        userId: userInfo ? userInfo.id : null
      }) : []

    if (columnsAdded.length > 0) {
      setStartSpinner(false);
      setTableData(data);
    }
    setIsRefetchingData(false);
    // return data;
  };

  const { data: entities, isLoading: isLoadingEntities, refetch: refetchTableData, } = ReactQuery.useQuery(
    [
      store.selectedDash,
      userSelectedView
    ],
    () => fetchManagementTablesHandler()
  );


  const { data: stats, isLoading: isLoadingStats } = ReactQuery.useQuery(
    [
      selectedAccount.platform,
      tab,
      selectedAccount.value,
      dateRange,
      columns,
      entities,
    ],
    {
      staleTime: TEN_MINS_MS,
      enabled: !!(selectedAccount.value && entities),
    }
  );


  useEffect(() => {
    if (entities) {
      setTableData((prevState) => entities);
    };
  }, [entities]);


  useEffect(() => {
    if (!store.currentUser) {
      if (userInfo) {
        delete store.currentUser;
        setStore({
          currentUser: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            isActive: userInfo.isActive,
          },
        });
      }
    }
    fetchSavedViews(loadedUserSavedViews, false);
    if (selectedDashInfo) setStore({ selectedDash: selectedDashInfo });
  }, []);

  useEffect(() => {
    if (entities) {
      setTableData(
        joinEntitiesStats(entities, stats, selectedAccount.platform)
      );
    }
  }, [entities, stats]);

  useEffect(() => {
    if (isLoadingEntities) {
      setTableData([]);
    }
  }, [isLoadingEntities]);

  return (
    <Table
      // columns={columns}
      // selectedColumns={selectedColumns}
      // setSelectedColumns={setSelectedColumns}
      data={tableData}
      tab={tab}
      setTab={setTab}
      selectedAccount={selectedAccount}
      setSelectedAccount={setSelectedAccount}
      dateRange={dateRange}
      setDateRange={updateDateRange}
      dateRangeType={dateRangeType}
      setDateRangeType={setDateRangeType}
      dropdownState={dropdownState}
      setDropdownState={setDropdownState}
      selectedEntities={selectedEntities}
      setSelectedEntities={setSelectedEntities}
      updateTableData={updateTableData}
      tableIsEditing={tableIsEditing}
      setTableIsEditing={setTableIsEditing}
      isLoading={isLoadingEntities || isLoadingStats}
      platform={selectedPlatform}
      viewCode="Mgmt"
      isRefetchingCampaignDashData={isRefetchingData}
      setIsRefetchingCampaignDashData={setIsRefetchingData}
      fetchManagementTablesHandler={fetchManagementTablesHandler}
      viewOptions={viewSelectorOptions}
      setViewOptions={setViewSelectorOptions}
      viewSelectedOption={viewSelectedOption}
      refetchTableData={refetchTableData}
      setViewSelectedOption={setViewSelectedOption}
      handleOkClick={handleOkClick}
    />
  );
};

export const managementTableLoader = async (params) => {

  const availableDashData = await fetchAvailableUsersWithCampaigns().then(
    (data) => {
      return data;
    }
  );
  let currentUser = params.currentUserInfo;
  let selectedDashInfo = {};
  if (currentUser) {
    const selectedDash = availableDashData.filter(
      (u) => u.userId === currentUser.id
    );
    if (selectedDash[0]) {
      selectedDashInfo = {
        userId: selectedDash[0].userId,
        name: selectedDash[0].name,
        dashId: selectedDash[0].id,
      };
    }
  } else {
    currentUser = await getUserByEmail({ email: params.currentUser.username });
  }

  let viewInLocalStorage = params.newManagementTableSelectedView || null;
  let loadedUserSavedViews;

  if (!viewInLocalStorage) {
    loadedUserSavedViews = await fetchSavedViews({ userId: currentUser.id, isDash: false });
  } else {
    loadedUserSavedViews = [...[viewInLocalStorage.managementTableSelectedViews]];
  }

  const selectedUserView =
    (viewInLocalStorage && viewInLocalStorage.managementTableSelectedViews) ||
    (loadedUserSavedViews && {
      ...loadedUserSavedViews[0],
      columns: new Array(
        loadedUserSavedViews[0].columnList.map((col) => col.columnKey)
      ),
    });

  return {
    availableDashData,
    loadedUserSavedViews,
    selectedDashInfo,
    loaderInitialSelectedView: selectedUserView,
  };
};

const client = new ReactQuery.QueryClient();
const ManagementTableWrapper = () => {
  return (
    <ReactQuery.QueryClientProvider client={client}>
      <UserViewsProvider>
        <ManagementTable />
      </UserViewsProvider>
    </ReactQuery.QueryClientProvider>
  );
};

// export default {
//   remove: (elem) => { ReactDOM.unmountComponentAtNode(elem); },
//   render: (elem) => { ReactDOM.render(<ManagementTableWrapper />, elem); }
// };

export default ManagementTableWrapper;
*/
