import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as ReactTable from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from '_theme/modules/shared/TableComponent.module.css';
import TableHeaderComponent from './TableHeaderComponent';
import TableBodyComponent from './TableBodyComponent';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';

const TableComponent = ({
  tableColumnHeaders,
  data,
  handleRemoveClick,
  onEditBudgetGroup,
  tabName,
  handleGroupSubscription,
  setIsLoading,
  updateCampaignGroups,
  onHeaderGroupsChange = () => {},
}) => {
  const { t } = useTranslation(['common']);
  const [globalFilter, setGlobalFilter] = useState('');
  const [grouping, setGrouping] = useState([]);
  const { selectedDailyReviewMenu } = useSelector(
    (store) => store.getMediaConsole
  );

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({ 
        itemRank 
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = ReactTable.useReactTable({
    data: data,
    columns: tableColumnHeaders,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableGlobalFilter: true,
    globalFilterFn: fuzzyFilter,
    filterFns: {
        fuzzy: fuzzyFilter 
    },
    state: {
         // columnFilters, 
        globalFilter, 
        grouping 
    },
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getFilteredRowModel: ReactTable.getFilteredRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    autoResetExpanded: false,
    enableMultiRowSelection: false,
  });

  const preGlobalFilteredRows = table?.getPreFilteredRowModel()?.rows;
  const headerGroups = table?.getHeaderGroups();

  useEffect(() => {
    if (onHeaderGroupsChange) {
      onHeaderGroupsChange(headerGroups);
    }
  }, [headerGroups, onHeaderGroupsChange]);

  return (
    <>
      {table.getRowModel().rows.length ? (
        <div
          className={`col col-sm-12 ${
            styles['budget-table-container-new-ui']
          } ${
            selectedDailyReviewMenu.pageId === DAILY_REVIEW_TABS.CAMPAIGN_ADV.id
              ? styles['budget-table-container-campaign-advisor']
              : ''
          }`}
        >
          <table className={`table table-striped mb-0`}>
            <TableHeaderComponent
              headerGroups={headerGroups}
              table={table}
              tableData={data}
              tabName={tabName}
            />
            <TableBodyComponent
              table={table}
              handleRemoveClick={handleRemoveClick}
              onEditBudgetGroup={onEditBudgetGroup}
              tabName={tabName}
              handleGroupSubscription={handleGroupSubscription}
              setIsLoading={setIsLoading}
              updateCampaignGroups={updateCampaignGroups}
            />
          </table>
        </div>
      ) : (
        <span className={`${styles['messageStyle']}`}>No data available</span>
      )}
    </>
  );
};

export default TableComponent;