import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as ReactTable from '@tanstack/react-table';
import _ from 'underscore';
import { useTranslation } from 'react-i18next';
import { rankItem } from '@tanstack/match-sorter-utils';
import styles from '_theme/modules/shared/TableComponent.module.css';
import TableHeaderComponent from './TableHeaderComponent';
import TableBodyComponent from './TableBodyComponent';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';

const TableComponent = ({
  tableColumnHeaders,
  data,
  updateCheckedTableData,
  fetchHeaderData,
  isRowAvailable,
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
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const table = ReactTable.useReactTable({
    data: data,
    columns: tableColumnHeaders,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableGlobalFilter: true,
    globalFilterFn: fuzzyFilter,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, grouping },
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
  selectedDailyReviewMenu.pageId === DAILY_REVIEW_TABS.CAMPAIGN_ADV.id &&
    headerGroups &&
    fetchHeaderData?.(headerGroups);

  const handleClick = (e, id) => {
    const updatedRows = [...data];
    updatedRows[id] = {
      ...updatedRows[id],
      isSelected: e?.target?.checked,
    };
    updateCheckedTableData?.(updatedRows);
  };

  const handleSelectAllClick = (event) => {
    const updatedRows = [...data];
    updatedRows.forEach((row) => {
      row.isSelected = event?.target?.checked;
    });
    updateCheckedTableData?.(updatedRows);
  };

  const rowData = table?.getRowModel().rows;
  isRowAvailable?.(rowData);

  useEffect(() => {
    if (onHeaderGroupsChange) {
      onHeaderGroupsChange(headerGroups);
    }
  }, [headerGroups, onHeaderGroupsChange]);

  return (
    <>
      {rowData?.length ? (
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
              handleSelectAllClick={handleSelectAllClick}
              tabName={tabName}
            />
            <TableBodyComponent
              table={table}
              handleRemoveClick={handleRemoveClick}
              onEditBudgetGroup={onEditBudgetGroup}
              handleClick={handleClick}
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