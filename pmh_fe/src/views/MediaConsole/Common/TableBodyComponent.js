import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '_theme/modules/shared/Table.module.css';
import { flexRender } from '@tanstack/react-table';
import { currencyColumn } from '_helpers/Utils/dashboardUtil';
import { SELECTED_DAILY_REVIEW_MENU } from 'common/Redux/Constants';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';

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

const TableBodyComponent = ({ table, handleClick }) => {
  const { selectedDailyReviewMenu } = useSelector(
    (store) => store.getMediaConsole
  );
  const dispatch = useDispatch();
  const rows = table.getRowModel().rows;

  return (
    <tbody role='rowgroup'>
      {
        rows.map((row, i) => {
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
              {selectedDailyReviewMenu.pageId ===
              DAILY_REVIEW_TABS.BUDGET_REC.id ? (
                !row.getIsGrouped() ? (
                  <CheckBoxCell handleClick={handleClick} row={row} />
                ) : (
                  <td style={{ padding: '16px' }}></td>
                )
              ) : null}
              {row.getAllCells().map((cell, index) => {
                let style = {
                  boxSizing: 'border-box',
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor:
                    !cell.getIsPlaceholder() &&
                    cell.column.columnDef.cellBackgroundColor?.(),
                };

                // Verifica si renderValue está definido antes de usarlo
                if (!cell.column.columnDef.cell) {
                  console.error(`renderValue is undefined for cell: ${cell.id}`);
                  return null;
                }     

                return cell.column.columnDef.header === 'kpiName' &&
                  selectedDailyReviewMenu.pageId ===
                    DAILY_REVIEW_TABS.CAMPAIGN_ADV.id ? null : cell.column
                    .columnDef.header === 'groupName' &&
                  selectedDailyReviewMenu.pageId ===
                    DAILY_REVIEW_TABS.BUDGET_REC.id ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']}`}
                    style={{
                      ...style,
                      cursor: 'pointer',
                      color: 'blue',
                    }}
                    onClick={() =>
                      dispatch({
                        type: SELECTED_DAILY_REVIEW_MENU,
                        payload: {
                          pageId: DAILY_REVIEW_TABS.CAMPAIGN_ADV.id,
                          groupList: [cell.row.original],
                        },
                      })
                    }
                  >
                    {flexRender(
                      cell.column.columnDef.cell(cell.getValue()),
                      cell.getContext()
                    )}
                  </td>
                ) : (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']}`}
                    style={style}
                  >
                    {flexRender(
                      currencyColumn.includes(cell.column.columnDef.header) ||
                        ['kpiValue', 'campaignKpi'].includes(
                          cell.column.columnDef.header
                        )
                        ? cell.column.columnDef.cell(cell)
                        : cell.column.columnDef.cell(cell.getValue()),
                      cell.getContext()
                    )}
                  </td>
                );
              })}
            </tr>
          );
        }) /*  : (
        <tr>
          <td className={styles.div_para_not_found}>
            <DataNotFound selectedDashboardTab={selectedDashboardTab} />
          </td>
        </tr>
      ) */
      }
    </tbody>
  );
};

export default TableBodyComponent;
