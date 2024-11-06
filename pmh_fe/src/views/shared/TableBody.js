import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DataNotFound from '../shared/DataNotFound';
import styles from '../../_theme/modules/shared/Table.module.css';
import { useUserViews } from '../../_helpers/userViewsContext';
import { flexRender } from '@tanstack/react-table';
import Spinner from '../../common/SmallSpinner';
import { useStore } from '../../_helpers/storeContext';
import {
  SHOW_SPINNER,
  checkFreeTextColumnPivot,
  currencyColumn,
} from '_helpers/Utils/dashboardUtil';
import ConfiguredStatus from 'views/campaignDash/ConfiguredStatus';
import { useSelector } from 'react-redux';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { BULK_EDIT_OPTIONS } from 'views/campaignDash/BulkComponents/BulkEdit';
import { getColumnsBeingCalculated } from '_helpers/columns/columnsBeingCalculated';

const CheckBoxCell = (props) => {
  const { handleClick, row, freezedColumns } = props;
  const checkBoxStyle =
    freezedColumns > 0
      ? {
          position: 'sticky',
          zIndex: 20,
          left: 0,
          backgroundColor: 'white',
        }
      : undefined;
  return (
    <td padding='checkbox' style={checkBoxStyle}>
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

const TableBody = (props) => {
  const { selectedDashboardTab } = props;
  const { t } = useTranslation(['common']);
  const { freezedColumns, userSelectedView, userSelectedColumns } = useUserViews();
  const {
    store: { currentUser, selectedDash },
  } = useStore();
  const isInernalOnly = currentUser.userRoleList.some((x) => x.roleId === 3);
  const configuredStatusRef = useRef(null);
  configuredStatusRef.current = {
    userId: currentUser?.id,
    campaignDashUserId: selectedDash?.userId,
    campaignDashViewId: userSelectedView?.viewId,
    columns: userSelectedColumns[selectedDashboardTab]?.[0]?.map((column) => ({
      CampaignDashColumnKey: column,
    })),
    selectedDashboardTab,
  };
  const { selectedCampaigns, bulkOperation } = useSelector(
    (store) => store.getCampaignData
  );


  const checkColumnName = (colIdentifier) =>
    ['pacing_budget', 'kpi', 'platform_budget'].includes(colIdentifier);

  const handleRowDoubleClick = (campaignId, cell) =>
    props.handleRowClick(
      campaignId,
      cell,
      cell.column.columnDef?.colIdentifier
    );
  // TODO fix freeze columns style
  const getRowPreviousWidth = (cells, index) => {
    let width = 32;
    cells.filter((col, i) => {
      if (i < index) width = width + col.column.getSize();
    });
    return width;
  };
  const filteredRows = props.table.getRowModel().rows;
  let rows = filteredRows.length > 0 ? filteredRows : props.firstPageRows;
  const isMediaOpsAbility =
    currentUser?.userAbilitiesList?.filter(
      (ability) => ability?.abilityId === 6
    ).length > 0;

  const isDemoUser =
    currentUser?.userAbilitiesList?.filter(
      (ability) => ability?.abilityId === 4
    ).length > 0;

  const isMyDashboard = currentUser?.id === selectedDash?.userId;

  const handleEditableCell = (cell, isFreeze, style, handleDoubleClick) => {
    let value = props.getValueToShow(cell);
    return (
      <td
        key={cell.id}
        role='cell'
        className={`${styles['tr-oveflow']} ${styles['groove_body_td_firstcolumn']} ${styles['tr-freeText']} ${
          isFreeze ? styles['tr-freeze'] : ''
        }`}
        style={{
          ...style,
          pointerEvents: (isInernalOnly || !isMediaOpsAbility) && 'none',
        }}
        onDoubleClick={handleDoubleClick}
      >
        {cell.column.columnDef.editor === 'demoNumberEditor'
          ? flexRender(cell.column.columnDef.cell(cell), cell.getContext())
          : cell.column.columnDef.editor === 'demoEditor'
          ? flexRender(cell.column.columnDef.cell(value), cell.getContext())
          : flexRender(
              cell.column.columnDef.cell(cell.getValue()),
              cell.getContext()
            )}
      </td>
    );
  };

  const removePointerEventsBudget = (cell) => {
    const {
      column: { id },
    } = cell;
    if (id === 'platform_ad_set_budget' || id === 'platform_campaign_budget')
      return ['0', '-']?.includes(cell.getValue());
    return false;
  };

  const renderCellWithSpinner = (cell, isFreeze, style, index) => {
    return (
      <td
        key={cell.id}
        role='cell'
        className={`${styles['tr-oveflow']} ${
          index === 0
            ? styles['groove_body_td_firstcolumn']
            : styles['groove_body_td']
        }
          ${isFreeze ? styles['tr-freeze'] : ''}`}
        style={style}
      >
        <Spinner />
      </td>
    );
  };

  const shouldRenderWhenStartSpinner = (cell, row) => {
    /*
      TODO: Need to look this logic during FE refactoring while merge with BE Performance code
    */
    // This is added to handle the bulk operation spinner
    if (row && bulkOperation) {
      const { option, state } = bulkOperation;
      const checkRowInBulkOperation = selectedCampaigns.filter(
        (campaign) => campaign.campaignId === row.original.campaignId
      );
      if (checkRowInBulkOperation.length && !state)
        return option === BULK_EDIT_OPTIONS.GROUP
          ? getColumnsBeingCalculated('group').includes(
              cell.column.columnDef.header
            )
          : option === BULK_EDIT_OPTIONS.PACING
          ? getColumnsBeingCalculated('pacing_budget').includes(
              cell.column.columnDef.header
            )
          : false;

      return false;
    }

    // We are not sppining, so we should not render the spinner
    if (props.startSpinner === false) {
      return false;
    }

    // We don't have a target row, so we
    // should render a spinner on all the columns included
    // in the columnsAdded array
    if (props.targetRowId === null) {
      return props.columnsAdded.includes(cell.column.columnDef.header);
    }

    // If this cell is in the target row and the columnsBeingCalculated has at least one element
    // we should check if we need to render the spinner
    if (
      cell.row.id === props.targetRowId &&
      props.columnsBeingCalculated.length > 0
    ) {
      return props.columnsBeingCalculated.includes(
        cell.column.columnDef.header
      );
    }

    // By default, if the row id is the target row id,
    // we should render the spinner
    return cell.row.id === props.targetRowId;
  };

  const checkBoxStyle =
    parseInt(freezedColumns[selectedDashboardTab]) > 0
      ? {
          position: 'sticky',
          left: 0,
          padding: '16px',
        }
      : { padding: '16px' };

  return (
    <tbody role='rowgroup'>
      {rows.length > 0 ? (
        rows.map((row, i) => {
          return (
            <tr
              key={row.id}
              style={{ display: 'flex', position: 'sticky' }}
              role='row'
              className={styles['table-style']}
            >
              {!row.getIsGrouped() ? (
                <CheckBoxCell
                  handleClick={props.handleClick}
                  row={row}
                  freezedColumns={parseInt(
                    freezedColumns[selectedDashboardTab]
                  )}
                />
              ) : (
                <td style={checkBoxStyle}></td>
              )}
              {row.getAllCells().map((cell, index) => {
                const isFreeze =
                  parseInt(freezedColumns[selectedDashboardTab]) > 0 &&
                  parseInt(freezedColumns[selectedDashboardTab]) > index;
                const cellValue = cell.getValue() + '';
                const campaignId = row.original ? row.original.campaignId : '';
                const campaignKey = row.original
                  ? row.original.campaign_key
                  : '';

                let style = {
                  boxSizing: 'border-box',
                  display: 'inline-block',
                  width: index === 0 ? cell.column.getSize() + 90 : cell.column.getSize() + 10,
                  fontWeight: index === 0 ? 'bold' : 'normal',
                  textAlign: cell.column.columnDef.align,
                  backgroundColor:
                    !cell.getIsPlaceholder() &&
                    cell.column.columnDef.cellBackgroundColor?.(
                      cell.getValue(),
                      row.subRows
                    ),
                };
                row.state && row.state.isWaiting
                  ? Object.assign(style, {
                      color: 'grey',
                      fontStyle: 'italic',
                    })
                  : cellValue.startsWith('Edit failed')
                  ? Object.assign(style, { background: '#F08080' })
                  : isFreeze
                  ? Object.assign(style, {
                      left:
                        getRowPreviousWidth(row.getAllCells(), index) + 'px',
                    })
                  : {};

                return cell.getIsGrouped() ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles.isGrouped} ${styles['tr-oveflow']} ${
                      isFreeze
                        ? [
                            'status',
                            'pacing_budget_current_segment_end_date',
                          ].includes(cell.column.columnDef.header) // To remove the freeze background color and consider the cell color
                          ? styles['tr-freeze-rm-bg-color']
                          : styles['tr-freeze']
                        : ''
                    }`}
                    style={style}
                  >
                    <span onClick={row.getToggleExpandedHandler()}>
                      {row.getIsExpanded() ? (
                        <img
                          src={`${window.location.origin}${PUBLICURL}/assets/icons/expand-less.png`}
                          alt='expand-less'
                        />
                      ) : (
                        <img
                          src={`${window.location.origin}${PUBLICURL}/assets/icons/expand-more.png`}
                          alt='expand-more'
                        />
                      )}
                    </span>{' '}
                    <p style={{ display: 'inline' }}>
                      {flexRender(
                        currencyColumn.includes(cell.column.columnDef.header) ||
                          cell.column.columnDef.header.includes(
                            'units_delivered'
                          )
                          ? cell.column.columnDef.cell(cell)
                          : cell.column.columnDef.cell(
                              cell.getValue(),
                              checkFreeTextColumnPivot.includes(
                                cell.column.columnDef.header
                              )
                            ),
                        cell.getContext()
                      )}
                      <span style={{ marginLeft: '5px' }}>
                        ({row.subRows.length})
                      </span>
                    </p>
                  </td>
                ) : cell.getIsAggregated() ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles.isAggregated} ${
                      styles['tr-oveflow']
                    } ${isFreeze ? styles['tr-freeze'] : ''}`}
                    style={style}
                  >
                    {flexRender(
                      cell.column.columnDef.aggregatedCell(cell.getValue()),
                      cell.getContext()
                    )}
                  </td>
                ) : cell.getIsPlaceholder() ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']} ${
                      isFreeze ? styles['tr-freeze'] : ''
                    }`}
                    // {...cell.getCellProps(style)}
                    style={style}
                  >
                    {null}
                  </td> //Needed in order to keep the same amount of cells for each row
                ) : cell.getValue() === SHOW_SPINNER ? (
                  renderCellWithSpinner(cell, isFreeze, style)
                ) : cell.row.id === props.targetRowId &&
                  props.columnsBeingCalculated.includes(
                    cell.column.columnDef.header
                  ) ? (
                  renderCellWithSpinner(cell, isFreeze, style)
                ) : checkColumnName(cell.column.columnDef?.colIdentifier) ? (
                  shouldRenderWhenStartSpinner(cell, row) ? (
                    renderCellWithSpinner(cell, isFreeze, style)
                  ) : (
                    <td
                      key={cell.id}
                      // {...cell.getCellProps(style)}
                      style={{
                        ...style,
                        cursor:
                          (isInernalOnly ||
                            !isMediaOpsAbility ||
                            removePointerEventsBudget(cell)) &&
                          'default',
                      }}
                      role='cell'
                      className={`${styles['tr-oveflow']} ${
                        styles['tr-budget']
                      } ${styles['groove_body_td_firstcolumn']} ${styles['groove_body_td']} ${isFreeze ? styles['tr-freeze'] : ''}`}
                      onDoubleClick={() =>
                        isInernalOnly ||
                        !isMediaOpsAbility ||
                        removePointerEventsBudget(cell)
                          ? null
                          : handleRowDoubleClick(campaignId, cell)
                      }
                    >
                      {flexRender(
                        [
                          'kpi1',
                          'kpi2',
                          'kpi3',
                          'platform_campaign_budget',
                          'platform_ad_set_budget',
                          'pacing_budget_current_segment',
                        ].includes(cell.column.columnDef.header)
                          ? cell.column.columnDef.cell(cell)
                          : cell.column.columnDef.cell(cell.getValue()),
                        cell.getContext()
                      )}
                    </td>
                  )
                ) : cell.column.columnDef.editor &&
                  (((cell.column.columnDef.editor === 'demoEditor' ||
                    (cell.column.columnDef.editor ===
                      'demoNumberEditor' &&
                      !bulkOperation)) &&
                    isDemoUser &&
                    isMyDashboard) ||
                    (cell.column.columnDef.editor === 'notesEditor' &&
                      !bulkOperation)) ? (
                  handleEditableCell(cell, isFreeze, style, () =>
                    props?.handleNotesEditor(
                      {
                        cell,
                        campaignId,
                        campaignKey,
                      },
                      cell.column.columnDef.editor
                    )
                  )
                ) : cell.column.columnDef.header === 'is_check_in_am' ||
                  cell.column.columnDef.header === 'is_check_in_pm' ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']}  ${
                      isFreeze ? styles['tr-freeze'] : ''
                    }`}
                    style={{
                      ...style,
                      pointerEvents:
                        (isInernalOnly || !isMediaOpsAbility) && 'none',
                    }}
                  >
                    {props.checkInCheckbox(
                      row,
                      cell.column.columnDef.cell(cell.getValue()),
                      campaignId,
                      cell.column.id
                    )}
                  </td>
                ) : // the following condition is temporary, to be removed when we add cache support
                shouldRenderWhenStartSpinner(cell, row) ? (
                  renderCellWithSpinner(cell, isFreeze, style)
                ) : ['ad_set_status', 'platform_native_status'].includes(
                    cell.column.columnDef.header
                  ) ? (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']} ${styles['groove_body_td_firstcolumn']} ${
                      isFreeze ? styles['tr-freeze'] : ''
                    }`}
                    style={{
                      ...style,
                      pointerEvents:
                        (isInernalOnly || !isMediaOpsAbility) && 'none',
                    }}
                  >
                    <ConfiguredStatus
                      rowData={row}
                      cellData={cell.getValue()}
                      configuredStatus={configuredStatusRef.current}
                      updateDashboardData={props?.updateDashboardData}
                    />
                  </td>
                ) : (
                  <td
                    key={cell.id}
                    role='cell'
                    className={`${styles['tr-oveflow']} 
                    ${
                      index === 0
                      ? styles['groove_body_td_firstcolumn']
                      : styles['groove_body_td']
                    } ${
                      isFreeze ? styles['tr-freeze'] : ''
                    } `}
                    style={{
                      ...style,
                      color: '#15181B',
                    }}
                  >
                    {flexRender(
                      currencyColumn.includes(cell.column.columnDef.header) ||
                        cell.column.columnDef.header.includes('units_delivered')
                        ? cell.column.columnDef.cell(cell)
                        : cell.column.columnDef.cell(cell.getValue()),
                      cell.getContext()
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })
      ) : (
        <tr>
          <td className={styles.div_para_not_found}>
            <DataNotFound selectedDashboardTab={selectedDashboardTab} />
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;
