import { useEffect, useMemo, useState } from 'react';
import * as ReactTable from '@tanstack/react-table'
import CustomTableHeaderCell from '../shared/CustomTableHeaderCell';
import { useTranslation } from 'react-i18next';
import { flexRender } from '@tanstack/react-table';
import CustomButton from '../UI/CustomButton';
import { useStore } from "../../_helpers/storeContext";
import Spinner from 'common/Spinner';
import styles from '../../_theme/modules/UserManagement/UserManagement.module.css'
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const UserManagementTable = props => {
  const { store, setStore } = useStore();
  const currentUser = store.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const isSuperAdmin = currentUser.userRoleList.some(x => x.roleName === "SuperAdmin");
  const { t } = useTranslation(['common']);

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
    columns: props.columns,
    defaultColumn,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  const headerGroups = table.getHeaderGroups();
  let rows = table.getRowModel().rows;

  const onRemoveUserHandler = (userId) => {
    props.onRemoveUser(userId);
  }

  const onEditUserHandler = (user) => {
    props.onEditUser(user);
  }

  useEffect(() => {
    if (rows.length > 0)
      setIsLoading(false);
    else
      setIsLoading(true);
  }, [rows]);


  const getWidth = (columnId) => {

    switch (columnId) {
      case 'email':
        return !isSuperAdmin ? "38%" : "37%";
      case 'userAbilitiesList':
        return "27%" ;
      case 'userRoleList':
        return "15%" ;
      case 'userClientList':
        return !isSuperAdmin ? "20%" : "21%";
      default:
        return "10%";
    }
   
  }

  const getHeaderColumnWidth = (columnId) => {
    
    switch (columnId) {
      case 'email':
        return "38%";
      case 'userAbilitiesList':
        return !isSuperAdmin ? "27%" : "25%";
      case 'userRoleList':
        return !isSuperAdmin ? "15%" : "14%";
      case 'userClientList':
        return !isSuperAdmin ? "20%" : "21%";
      default:
        return "10%";
    }
  }

  return (
    <div className='table-responsive'>
      <table className={`table ${styles['groove_table']}`}>
        <thead className='table-light'>
          {headerGroups.map(headerGroup => {
            return (
              <tr
                key={headerGroup.id}
                style={{ width: 'auto', height: '50px', display: "flex" }}
                role="row">
                {headerGroup.headers.map(column => {
                  return (
                    <CustomTableHeaderCell
                      onClick={column.column.getToggleSortingHandler()}
                      style={{
                        width: getHeaderColumnWidth(column.id),
                        'border-top-left-radius': column.id === 'email' && '10px',
                        'border-bottom-left-radius': column.id === 'email' && '10px',
                        boxSizing: "border-box",
                        cursor: "pointer",
                        display: "inline-block",
                        position: "relative",
                        opacity: '1',
                        color: 'rgba(107, 114, 128, 1)',
                        'font-family': "Graphik",
                        'font-size': '14px',
                        'font-weight': '500',
                        'font-style': 'normal',
                        'letter-spacing': '-0.25px',
                        'text-align': 'left',
                        'line-height': '18px',
                        'padding-left': column.id === 'email' ? '8px !important' : '0px !important',
                        'padding-top': '14px !important',
                        'border-bottom-width': '0px'
                      }}
                      isGroove={true}
                      role="columnheader"
                      colSpan={column.id === 'email' ? 2 : 1}>
                      {t(column.column.columnDef.header)}
                      <span>
                        {{
                          asc: <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-down.png`}
                            className='me-1' style={{ 'width': '16px', 'height': '16px', 'margin-left': '4px' }} />,
                          desc: <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-up.png`}
                            className='me-1' style={{ 'width': '12px', 'height': '6px', 'margin-left': '6px' }} />,
                        }[column.column.getIsSorted()] ?? null}
                      </span>
                    </CustomTableHeaderCell>
                  )
                })}
                {isSuperAdmin &&
                  <>
                    <td role="cell" style={{ width: '10%' }} className={`${styles['groove_header_cell']}`}>{t('header_names.actions')}</td>
                    <td role="cell" style={{ width: '60px' }} className={`${styles['groove_header_cell']} ${styles['groove_row_last_child']}`}></td>
                  </>
                }
              </tr>
            )
          })}
        </thead>
        <tbody style={{ display: 'block' }} role="rowgroup">
          {rows.length > 0 ?
            rows.filter(row => !row.disabled).map(row => {
              return (
                <tr key={row.id}
                  className={`${styles['groove_row']}`}
                  role="row">
                  {row.getAllCells().map(cell => {
                    return <td
                      className={cell.column.id === 'email' ? `${styles['groove_user_table_td']} ${styles['groove_user_table_td_first']}`
                        : `${styles['groove_user_table_td']}  ${styles['groove_td_text']}`}
                      key={cell.id} role="cell"
                      style={{
                        width: getWidth(cell.column.id)
                      }}>
                      {flexRender(
                        cell.column.columnDef.cell(cell.getValue()),
                        cell.getContext())}</td>
                  })}

                  {isSuperAdmin &&
                    <>
                      <td className={`${styles['groove_user_table_td']}`}>
                        <div style={{ 'display': 'inline-flex' }} >
                          <CustomButton className={`btn  ${styles['groove_user_remove_button']}`} onClick={onRemoveUserHandler.bind(null, row.original.id)}>
                            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/times.png`}
                              className='me-1' style={{ 'width': '16px', 'height': '16px' }} />
                            <label className={`${styles['groove_user_remove_btn_lbl']}`}>{t('button_text.remove')}</label>
                          </CustomButton>

                          <CustomButton className={`btn-primary text-white ${styles['groove_user_edit_button']} `}
                            onClick={onEditUserHandler.bind(null, row.original)}>
                            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/edit.png`}
                              className='me-1' style={{ 'width': '16px', 'height': '16px' }} />

                            <label className={`${styles['groove_user_edit_btn_lbl']}`}>
                              {t('button_text.edit')}</label>
                          </CustomButton>
                        </div>
                      </td>
                    </>
                  }
                </tr>
              )
            })
            : <tr
              className={`${styles['groove_row']}`}
              style={{ display: 'flex' }}
              role="row">
              <Spinner />
            </tr>}
        </tbody>
      </table>
    </div >
  );
};

export default UserManagementTable;