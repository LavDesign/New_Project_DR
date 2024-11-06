import React, { useEffect, useRef, useState } from 'react';
import * as _ from 'underscore';
// import * as ReactTable from 'react-table';
import * as ReactTable from '@tanstack/react-table'

import { useSelectedCampaigns } from '../../_helpers/SelectedCampaignsContext';
import GlobalFilter from '../shared/GlobalFilter';
import { useTranslation } from 'react-i18next';
import { getPlatformsInfoById } from '../../_helpers/Utils/availablePlatformsInfo';
import { trackButtonClick, getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import styles from '../../_theme/modules/campaingDash/CampaignTableSelector.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const columns = [
  { accessorKey: 'name', header: 'campaign_name' },
  { accessorKey: 'campaignKey', header: 'campaign_key' },
  { accessorKey: 'status', header: 'status' },
];

const checkIfChecked = ({ selectedCampaigns, row }) => selectedCampaigns.filter(selected => selected.campaignKey === row.original.campaignKey && selected.isActive).length> 0;

const CheckboxCell = props => {
  const { t } = useTranslation(['common']);
  const { campaigns: selectedCampaigns, addOrRemoveSelections } = useSelectedCampaigns();
  const isCheckedRef = useRef();

  useEffect(() => {
    isCheckedRef.current.checked = checkIfChecked({ selectedCampaigns, row: props.row });
  }, []);

  useEffect(() => {
    isCheckedRef.current.checked = checkIfChecked({ selectedCampaigns, row: props.row });
  }, [props.tab, selectedCampaigns, props.rowList]);

  const onClickHandler = event => {
    var tabName = (props.tab === 0) ? t('site_titles.available_campaigns') : t('site_titles.selected_campaigns')
    isCheckedRef.current.checked = props.tab === 1 ? true : !isCheckedRef.current.checked

    addOrRemoveSelections({ tab: props.tab, value: props.row.original, account: props.selectedAccount });
    trackButtonClick(props.row.original.name, `${getPageCategory()} ${pageSubCategory.campaignModal} - ${tabName} Tab`, 'Check Box')
  };
  return (
    <td padding='checkbox' className={`${styles['groove_campaign_modal_checkbox_td']}`}>
      <input
        type='checkbox'
        className={`form-check-input ${styles['groove_campaign_modal_header_td_checkbox']}`}
        onClick={onClickHandler}
        ref={isCheckedRef}
        onChange={() => { }}
        style={props.row.canExpand === true ? { display: "none" } : { marginTop: "5px" }}
        disabled={props.disableCheckBox}
      />
    </td>
  );
};

const Table = props => {
  const { t } = useTranslation(['common']);
  const { campaigns: selectedCampaigns, addOrRemoveSelections } = useSelectedCampaigns();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const table = ReactTable.useReactTable({
    data: props.tab === 0 ? props.data : selectedCampaigns,
    columns: columns,
    // defaultColumn,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableGlobalFilter: true,
    // globalFilterFn: fuzzyFilter,
    // filterFns: {
    //   fuzzy: fuzzyFilter,
    // },
    state: {
      // columnFilters,
      globalFilter,
    },
    // onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: fuzzyFilter,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getFilteredRowModel: ReactTable.getFilteredRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  let preGlobalFilteredRows = table.getPreFilteredRowModel().rows;
  const headerGroups = table.getHeaderGroups();

  const getRows = () => {
    if (props.tab === 0)
      return table.getRowModel().rows
    else {
      return table.getCoreRowModel().rows;
    }
  }

  let rows = getRows();

  return (
    <div className='col-sm-12'>
      {props.tab === 0 &&
        <div className='d-flex ps-3'>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            placeholderText={'Search by Name or Keyword'}
            style={{
              marginLeft: '-11px', width: '369px',
              borderRadius: '100px',
              border: '1px solid rgba(156, 163, 175, 1)'
            }}
          />
        </div>
      }
      <div className={`col col-sm-12 table-responsive ${styles['groove_campaign_selector_table']}`}>
        <table className='table'>
          <thead className='table-light'>
            {headerGroups.map((headerGroup, idx) => (
              <tr key={headerGroup.id}
                style={{ display: "flex" }}
                className={`${styles['groove_row_width']}`}
                role="row">
                <td style={{ width: '5% !important', backgroundColor: 'rgba(243, 244, 246, 1)' }}></td>
                {headerGroup.headers.map(column => (
                    <td key={column.id + '_' + headerGroup.id}
                      className={column.column.columnDef.header === 'campaign_name' ? `${styles['groove_campaign_modal_table_header_first']}  ${styles['groove_campaign_modal_table_header']}` : `${styles['groove_campaign_modal_table_header']}`}
                      onClick={column.column.getToggleSortingHandler()}
                      role="columnheader"
                      colSpan={column.colSpan}
                      style={{ width: column.column.columnDef.header === 'campaign_name' ? "45%" : "25%", boxSizing: "border-box", cursor: "pointer", display: "inline-block", position: "relative" }}>
                      {t('header_names.' + ReactTable.flexRender(
                        column.column.columnDef.header,
                        column.getContext()))}

                      <span style={{ float: 'right' }}>
                        {{
                          asc: <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-down.png`}
                            className='me-1' style={{ width: '16px', height: '16px', marginLeft: '4px' }} />,
                          desc: <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-up.png`}
                            className='me-1' style={{ width: '12px', height: '6px', marginLeft: '6px' }} />,
                        }[column.column.getIsSorted()] ?? null}
                      </span>

                    </td>
                ))}
              </tr>
            ))}
          </thead>
          <tbody role="rowgroup">
            {rows.filter(row => props.tab === 0 || (props.tab === 1 && row.original.isActive))
              .map(row => {
                return (
                  <tr key={row.id}
                    style={{ display: 'flex', borderLeft: '1px solid rgba(243, 244, 246, 1)', backgroundColor: 'white !important' }}
                    className={`${styles['groove_row_width']}`}
                    role="row">
                    <CheckboxCell
                      row={row}
                      tab={props.tab}
                      selectedAccount={props.selectedAccount}
                      rowList={rows}
                      disableCheckBox={props.disableCheckBox} />
                    {row.getAllCells().map(cell => {
                      const platformInfo = getPlatformsInfoById(cell.row.original.platformId);
                      const platform = platformInfo.platform.toLowerCase();
                      return (
                        <td className={`${cell.column.columnDef.header === 'campaign_name' ? styles['groove_campaign_modal_table_body_td_first'] : styles['groove_campaign_modal_table_body_td']}`} key={cell.id} role="cell"
                          style={{ boxSizing: "border-box", display: "inline-block", width: cell.column.columnDef.header === 'campaign_name' ? "45%" : "25%" }}>
                          <div style={{ display: 'flex' }}>
                            { cell.column.columnDef.header === 'campaign_name'
                              ? <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platform}-groove.png`} style={{ width: '18px', height: '18px' }} />
                              : null
                            }
                            <span className={`${styles['groove_selCamp_first_span']}`} style={{ display: 'block', marginLeft: '10px' }}>
                              {ReactTable.flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext())}
                            </span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CampaignTableSelector = props => {
  return <Table viewCode={props.viewCode} data={props.data} tab={props.tab} onCheckboxChange={props.onCheckboxChange} selectedAccount={props.selectedAccount} handleSelectAllClick={props.handleSelectAllClick} disableCheckBox={props.disableCheckBox} />
};

export default CampaignTableSelector;
