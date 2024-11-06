import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '_theme/modules/shared/Table.module.css';
import { flexRender } from '@tanstack/react-table';
import { currencyColumn } from '_helpers/Utils/dashboardUtil';
import { SELECTED_DAILY_REVIEW_MENU } from 'common/Redux/Constants';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import BudgetGroupingActionModal from 'views/MediaConsole/BudgetGrouping/BudgetGroupingActionModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import BudgetGroupActionModalContainer from 'views/MediaConsole/BudgetGrouping/BudgetGroupActionModalContainer';
import { BG_DETAILS_GROUP } from 'common/Redux/Constants';

const CheckBoxCell = (props) => {
  const { handleClick, row } = props;
  return (
    <td padding='checkbox'>
      <input
        type='checkbox'
        className={`form-check-input ${styles['groove_header_td_checkbox']}`}
        onClick={(event) => handleClick(event, row.id)}
        onChange={() => {}}
        checked={row?.original?.isSelected || false}
        style={
          row.canExpand === true ? { display: 'none' } : { marginTop: '5px' }
        }
      />
    </td>
  );
};
const getRowPreviousWidth = (cells, index) => {
  let width = 0;
  cells.filter((col, i) => {
    if (i < index) width = width + col.column.getSize();
  });
  return width;
};
const TableBodyComponent = ({
  table,
  handleClick,
  tabName,
  setIsLoading,
  updateCampaignGroups,
}) => {
  const { selectedDailyReviewMenu } = useSelector(
    (store) => store.getMediaConsole
  );
  const dispatch = useDispatch();
  const freezeColumns = 1;
  const rows = table.getRowModel().rows;

  const getColumnWidth = (column, index) => {
    if (tabName === 'bgCampaigns') {
      if (index === 0) return column.getSize() + 200;
      else return column.getSize() + 90;
    } else {
      if (index === 0) return column.getSize() + 90;
      else return column.getSize() + 10;
    }
  };

  return (
    <tbody role='rowgroup'>
      {rows.map((row, i) => {
        return (
          <tr
            key={row.id}
            style={{ display: 'flex', position: 'sticky' }}
            role='row'
            className={styles['table-style']}
            onClick={() => {
              console.log('row clicked', row);
            }}
          >
            {tabName === 'campaigns' ? (
              !row.getIsGrouped() ? (
                <CheckBoxCell handleClick={handleClick} row={row} />
              ) : (
                <td style={{ padding: '16px' }}></td>
              )
            ) : null}
            {row.getAllCells().map((cell, index) => {
              const allPlatforms = row?.original?.allPlatforms?.join(', ');
              const isGroupSubscribed = row?.original?.isGroupSubscribed;
              let style = {
                boxSizing: 'border-box',
                display: 'inline-block',
                width: getColumnWidth(cell.column, index),
                textAlign: 'left',
                backgroundColor:
                  !cell.getIsPlaceholder() &&
                  cell.column.columnDef.cellBackgroundColor?.(),
                left:
                  freezeColumns > 0
                    ? getRowPreviousWidth(row.getAllCells(), index) + 'px'
                    : '',
              };
              return (cell.column.columnDef.header === 'kpiName' ||
                cell.column.columnDef.header === 'kpi') &&
                selectedDailyReviewMenu.pageId ===
                  DAILY_REVIEW_TABS.CAMPAIGN_ADV.id ? null : cell.column
                  .columnDef.header === 'groupName' &&
                selectedDailyReviewMenu.pageId ===
                  DAILY_REVIEW_TABS.BUDGET_REC.id ? (
                <td
                  key={cell.id}
                  role='cell'
                  className={`${styles['tr-oveflow']} ${styles['groove_body_td_firstcolumn']} ${styles['tr-freeze']}`}
                  style={{
                    ...style,
                    color: '#15181B',
                  }}
                >
                  {isGroupSubscribed ? (
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/eye-solid.svg`}
                      className={`${styles['follow-icon']}`}
                      alt={'Followed'}
                    />
                  ) : (
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/eye.svg`}
                      className={`${styles['follow-icon']}`}
                      alt={'Unfollowed'}
                    />
                  )}
                  {flexRender(
                    cell.column.columnDef.cell(cell.getValue()),
                    cell.getContext()
                  )}
                </td>
              ) : cell.column.columnDef.header === 'actions' ? (
                <td
                  key={cell.id}
                  role='cell'
                  className={`${styles['tr-oveflow']} ${styles['groove_body_td']}`}
                  style={{ ...style, textAlign: 'center' }}
                  onClick={() =>
                    dispatch({
                      type: BG_DETAILS_GROUP,
                      payload: cell.row.original,
                    })
                  }
                >
                  <BudgetGroupActionModalContainer
                    setIsLoading={setIsLoading}
                    updateCampaignGroups={updateCampaignGroups}
                    fromTable={true}
                    showCustomButton={false}
                  />
                </td>
              ) : (
                <td
                  key={cell.id}
                  role='cell'
                  className={`${styles['tr-oveflow']} ${styles['groove_body_td']}`}
                  style={style}
                >
                  {flexRender(
                    currencyColumn.includes(cell.column.columnDef.header) ||
                      ['kpiValue', 'campaignKpi', 'budget'].includes(
                        cell.column.columnDef.header
                      )
                      ? cell.column.columnDef.cell(cell)
                      : tabName === 'campaigns'
                      ? cell.column.columnDef.cell(
                          cell.getValue(),
                          cell.row.getVisibleCells()[1]?.getValue()
                        )
                      : cell.column.columnDef.cell(cell.getValue()),
                    cell.getContext()
                  )}
                  {['platforms', 'channels'].includes(
                    cell.column.columnDef.header
                  ) && allPlatforms.length ? (
                    <OverlayTrigger
                      placement={'right'}
                      overlay={
                        <Tooltip className='customToolTip' id={`tooltip-right`}>
                          {allPlatforms}
                        </Tooltip>
                      }
                    >
                      <img
                        src={`${window.location.origin}${PUBLICURL}/assets/icons/info-circle.svg`}
                        className={`${styles['info-icon']}`}
                        alt={'info'}
                      />
                    </OverlayTrigger>
                  ) : null}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
export default TableBodyComponent;
