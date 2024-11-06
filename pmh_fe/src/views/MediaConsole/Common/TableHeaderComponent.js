import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomTableHeaderCell from 'views/shared/CustomTableHeaderCell';
import _ from 'underscore';
import { useTranslation } from 'react-i18next';
import styles from '_theme/modules/shared/Table.module.css';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';

const TableHeaderComponent = ({
  headerGroups,
  tableData,
  handleSelectAllClick,
}) => {
  const { t } = useTranslation(['common']);
  const [updatedHeaderGroups, setUpdatedHeaderGroups] = useState(headerGroups);
  const { selectedDailyReviewMenu } = useSelector(
    (store) => store.getMediaConsole
  );

  useEffect(() => {
    if (selectedDailyReviewMenu.pageId === DAILY_REVIEW_TABS.CAMPAIGN_ADV.id) {
      const updatedHeaderGroups = headerGroups.map((item) => {
        const filteredHeaders = item.headers.filter(
          (header) => header.id !== 'kpiName'
        );
        return {
          ...item,
          headers: filteredHeaders,
        };
      });
      setUpdatedHeaderGroups(updatedHeaderGroups);
    }
  }, [selectedDailyReviewMenu]);

  const getpreviousWidth = (headerGroup, index) => {
    let width = 32;
    headerGroup.filter((col, i) => {
      if (i < index) width = width + col.getSize();
    });
    return width;
  };

  const getCheckedValue = () => {
    const isCheckedValue = tableData?.filter((row) => row.isSelected);
    return (
      isCheckedValue?.length === tableData?.length && tableData?.length > 0
    );
  };

  const checkBoxStyle = {
    position: 'sticky',
    zIndex: 20,
    left: 0,
  };

  const showStaticOrDynamicHeader = (header) => {
    if (selectedDailyReviewMenu.pageId === DAILY_REVIEW_TABS.CAMPAIGN_ADV.id) {
      const { kpi } = tableData?.[0] || {};
      switch (header) {
        case 'campaignKpi':
          return kpi;
        case 'changeInKpi':
          return `Change in ${kpi}`;
        default:
          return t(`header_names.${header}`);
      }
    }
    return t(`header_names.${header}`);
  };

  const getSortIcon = (isSorted) => {
    switch (isSorted) {
      case 'asc':
        return (
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-down.png`}
            className='me-1'
            style={{
              width: '16px',
              height: '16px',
              marginLeft: '4px',
            }}
          />
        );
      case 'desc':
        return (
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-up.png`}
            className='me-1'
            style={{
              width: '12px',
              height: '6px',
              marginLeft: '6px',
            }}
          />
        );
      default:
        return (
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-down.png`}
            className='me-1'
            style={{
              width: '16px',
              height: '16px',
              marginLeft: '4px',
            }}
          />
        );
    }
  };

  return (
    <thead
      className='table-light'
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      {updatedHeaderGroups.map((headerGroup) => (
        <tr key={headerGroup.id} style={{ display: 'flex' }} role='row'>
          {selectedDailyReviewMenu.pageId ===
            DAILY_REVIEW_TABS.BUDGET_REC.id && (
            <th
              padding='checkbox'
              style={checkBoxStyle}
              className={`${styles['groove_header_checkbox']} ${styles['groove_header_checkbox_bugget_bg']}`}
            >
              <input
                type='checkbox'
                className={`form-check-input ${styles['groove_header_td_checkbox']}`}
                checked={getCheckedValue()}
                onChange={handleSelectAllClick}
              />
            </th>
          )}

          {headerGroup.headers.map((column, index) => (
            <CustomTableHeaderCell
              key={`custom-table-header-cell-${column.column.columnDef.header}`}
              previousCol={getpreviousWidth(headerGroup.headers, index)}
              onClick={column.column.getToggleSortingHandler()}
              tooltipText={column.column.columnDef.tooltipText}
              colSpan={column.colSpan}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
                display: 'inline-block',
                position: 'relative',
                backgroundColor: 'rgb(229, 231, 235)',
                boxShadow: '6px 0px 12px -10px rgba(99, 115, 129, 0.75)',
                fontFamily: '"Graphik", sans-serif',
                fontSize: '14px',
                fontWeight: '800',
                lineHeight: '18px',
                letterSpacing: '-0.25px',
                textAlign: 'center',
                color: 'rgba(107, 114, 128, 1)',
              }}
              role='columnheader'
            >
              {showStaticOrDynamicHeader(column.column.columnDef.header)}
              <span style={{ float: 'right' }}>
                {getSortIcon(column.column.getIsSorted())}
              </span>
              {column.column.getCanResize() && (
                <div
                  role='separator'
                  style={{ cursor: 'col-resize' }}
                  onMouseDown={column.getResizeHandler()}
                  onTouchStart={column.getResizeHandler()}
                  onClick={(ev) => ev.stopPropagation()}
                  className={`${styles.resizer} ${
                    column.column.getIsResizing() ? styles.isResizing : ''
                  }`}
                />
              )}
            </CustomTableHeaderCell>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeaderComponent;