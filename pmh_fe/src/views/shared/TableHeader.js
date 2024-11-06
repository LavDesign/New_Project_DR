import { useRef, useMemo, useEffect, useState } from 'react';
import _ from 'underscore';
import { useTranslation } from 'react-i18next';
import CustomTableHeaderCell from './CustomTableHeaderCell';
import styles from '../../_theme/modules/shared/Table.module.css';
import { useUserViews } from '../../_helpers/userViewsContext';
import { getTabName, PUBLICURL } from '_helpers/Utils/dashboardUtil';

const TableHeader = (props) => {
  const { selectedDashboardTab } = props;
  const { t } = useTranslation(['common']);
  const {
    freezedColumns,
    columnSelectionState,
    setColumnSelectionState,
    setUserSelectedColumns,
    pivotColumns,
    setPivotColumns,
    userSelectedView,
    pivotOperation,
    setPivotOperation,
    userSelectedColumns,
  } = useUserViews();
  const freezeCount = useMemo(
    () =>
      parseInt(freezedColumns[selectedDashboardTab]) > 0 &&
      parseInt(freezedColumns[selectedDashboardTab]),
    [freezedColumns]
  );
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const toggleDone = useRef(false);
  const originalPivotList = useRef([]);
  const saveTabPivotList = useRef([]);
  const [initialViewSet, setInitialView] = useState(undefined);

  const getpreviousWidth = (headerGroup, index) => {
    let width = 32;
    headerGroup.filter((col, i) => {
      if (i < index) width = width + col.getSize();
    });
    return width;
  };

  const canGroupColumn = (columnName) => {
    const columns = [
      'Account',
      'Group',
      'Free Text: Launch Doc URL',
      'Free Text: Notes 1',
      'Free Text: Notes 2',
      'Free Text: Notes 3',
      'Free Text: Pacing',
      'Free Text: Reporting',
      'Pacing Budget End Date (Current Segment)',
      'Pacing Budget Start Date (Current Segment)',
      'Platform',
      'Status',
      'Configured Status',
      'Campaign Pacing Budget',
      'Campaign Group',
    ];

    return columns.some(function (str) {
      return str.includes(columnName);
    });
  };

  const combinedArrays = (...arrays) => [].concat(...arrays);

  useEffect(() => {
    if (columnSelectionState === 'saved') {
      saveTabPivotList.current = [];
    }
  }, [userSelectedView?.viewId]);

  useEffect(() => {
    if (userSelectedView) {
      const { columnList, adSetColumnList } = userSelectedView;
      const combinedList = combinedArrays(columnList, adSetColumnList);
      originalPivotList.current = combinedList
        ?.filter((element) => element?.isPivot)
        .map((data) => {
          return {
            tab: data.tabName,
            value: data?.columnKey,
          };
        });
      setInitialView(true);
    }
    toggleDone.current = false;
  }, [userSelectedView]);

  useEffect(() => {
    if (initialViewSet) {
      toggleDone.current = false;
      const copyPivotList = JSON.parse(JSON.stringify(pivotColumns));
      for (const dash in copyPivotList) {
        saveTabPivotList.current = [
          ...saveTabPivotList.current,
          ...copyPivotList[dash].map((data) => {
            return {
              tab: getTabName(dash),
              value: data,
            };
          }),
        ];
      }
      setInitialView(false);
    }
  }, [initialViewSet]);

  useEffect(() => {
    toggleDone.current = false;
    const copyPivotList = JSON.parse(JSON.stringify(pivotColumns));
    delete copyPivotList[selectedDashboardTab];
    for (const dash in copyPivotList) {
      saveTabPivotList.current = [
        ...copyPivotList[dash].map((data) => {
          return {
            tab: getTabName(dash),
            value: data,
          };
        }),
      ];
    }
  }, [selectedDashboardTab]);

  useEffect(() => {
    /*
      This block is used to maintain the pivot functionality
    */
    if (pivotOperation) {
      const headers = props.headerGroups.flatMap(
        (headerGroup) => headerGroup.headers
      );
      if (!toggleDone.current) {
        headers.forEach((column) => {
          if (column?.column) {
            if (
              pivotColumns[selectedDashboardTab]?.includes(column.id) &&
              column.column.getIsGrouped()
            )
              return;
            (pivotColumns[selectedDashboardTab]?.includes(column.id) ||
              column.column.getIsGrouped()) &&
              column.column.toggleGrouping();
          }
          toggleDone.current = true;
        });
      }
      const pivotGroupList = headers
        .filter(
          (header) =>
            header.column.getIsGrouped() &&
            getTabName(selectedDashboardTab) === header.column.columnDef.tabName
        )
        .map((data) => {
          return {
            tab: data.column.columnDef.tabName,
            value: data?.id,
          };
        });
      const uniqueCombinedList = [
        ...saveTabPivotList.current,
        ...pivotGroupList,
      ].filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (other) =>
              Object.keys(item).length === Object.keys(other).length &&
              Object.keys(item).every((key) => item[key] === other[key])
          )
      );

      if (originalPivotList.current || uniqueCombinedList) {
        // Sort arrays before comparing
        const sortedOrgList = originalPivotList.current
          .map((obj) => JSON.stringify(Object.entries(obj).sort()))
          .sort();
        const sortedCombinedList = uniqueCombinedList
          .map((obj) => JSON.stringify(Object.entries(obj).sort()))
          .sort();

        _.isEqual(sortedOrgList, sortedCombinedList)
          ? setColumnSelectionState('saved')
          : setColumnSelectionState('toSave');
      }
      const selectedDashboardTabPivotList = pivotGroupList.map(
        (data) => data.tab === getTabName(selectedDashboardTab) && data.value
      );
      setPivotColumns({
        ...pivotColumns,
        [selectedDashboardTab]: selectedDashboardTabPivotList,
      });
    }
  }, [props.headerGroups]);

  const onDragSortHandle = (isResizing) => {
    if (isResizing) return;
    setColumnSelectionState('toSave');
    setUserSelectedColumns((prevState) => {
      const savedOptions = [...prevState[selectedDashboardTab]];
      if (
        dragItem.current > freezedColumns[selectedDashboardTab] - 1 &&
        dragOverItem.current > freezedColumns[selectedDashboardTab] - 1
      ) {
        const draggedItem = savedOptions[0].splice(dragItem.current, 1)[0];
        savedOptions[0].splice(dragOverItem.current, 0, draggedItem);
        dragItem.current = null;
        dragOverItem.current = null;
      }

      return {
        ...userSelectedColumns,
        [selectedDashboardTab]: savedOptions,
      };
    });
    setPivotOperation(false);
  };

  const getCheckedValue = () => {
    const { tableData } = props;
    const isCheckedValue = tableData?.filter((row) => row.isSelected);
    return (
      isCheckedValue?.length === tableData?.length && tableData?.length > 0
    );
  };

  const checkBoxStyle =
    freezeCount > 0
      ? {
        position: 'sticky',
        zIndex: 20,
        left: 0,
      }
      : undefined;
  return (
    <thead
      className='table-light'
      style={
        {
          position: "sticky",
          top: 0,
          zIndex: 1
        }
      }
   >
      {props.headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} style={{ display: 'flex' }} role='row'>
          <th
            padding='checkbox'
            style={checkBoxStyle}
            className={`${styles['tr-freeze-new-ui-color-white']}`}
          >
            <input
              type='checkbox'
              className={`form-check-input ${styles['groove_header_td_checkbox']}`}
              checked={getCheckedValue()}
              onChange={props.handleSelectAllClick}
            />
          </th>

          {headerGroup.headers.map((column, index) => (

            <CustomTableHeaderCell
              key={`custom-table-header-cell-${column.column.columnDef.header}`}
              isFreeze={freezeCount > index}
              previousCol={getpreviousWidth(headerGroup.headers, index)}
              draggable={
                column.column.getIsResizing() || freezeCount > index
                  ? false
                  : true
              }
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={() => {
                onDragSortHandle(column.column.getIsResizing());
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={column.column.getToggleSortingHandler()}
              tooltipText={column.column.columnDef.tooltipText}
              colSpan={column.colSpan}
              style={{
                width: index === 0 ? column.getSize() + 90 : column.getSize() + 10,
                boxSizing: 'border-box',
                paddingRight:'2.0005rem',
                paddingLeft: '1.0005rem',
                cursor: 'pointer',
                display: 'inline-block',
                position: 'relative',
                backgroundColor: 'rgb(229, 231, 235)',
                boxShadow: '6px 0px 12px -10px rgba(99, 115, 129, 0.75)',
                fontFamily: '"Graphik", sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '18px',
                letterSpacing: '-0.25px',
                textAlign: 'left',
                color: 'rgba(107, 114, 128, 1)',
                overflowWrap: 'break-word',
              }}
              role='columnheader'
           >
              {column.column.getCanGroup() &&
                canGroupColumn(column.column.columnDef.tooltipText) ? (
                // If the column can be grouped, let's add a toggle
                <span
                  style={{
                    cursor: 'pointer',
                    marginRight: '5px',
                  }}
                  onClick={column.column.getToggleGroupingHandler()}
               >
                  {column.column.getIsGrouped() ? (
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/ad-group-off.png`}
                      alt='ad-group-off.png'
                    />
                  ) : (
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/ad-group.png`}
                      alt='ad-group.png'
                    />
                  )}
                </span>
              ) : null} 
              {t('header_names.' + column.column.columnDef.header)}
              
              <span className={`${styles['groove_header_chevron']}`}>
                {column.column.getIsSorted() === 'asc' ? (
                  <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-up.png`}
                      className='me-1' style={{ width: '12px', height: '6px', marginLeft: '6px' }} />
                ) : (
                  <img src={`${window.location.origin}${PUBLICURL}/assets/icons/angle-down.png`}
                      className='me-1' style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
                )}
              </span>

              {column.column.getCanResize() && (
                <div
                  role='separator'
                  style={{ cursor: 'col-resize' }}
                  onMouseDown={column.getResizeHandler()}
                  onTouchStart={column.getResizeHandler()}
                  onClick={(ev) => ev.stopPropagation()}
                  className={`${styles.resizer} ${column.column.getIsResizing() ? styles.isResizing : ''
                    }`}
                />
              )}


              
            </CustomTableHeaderCell>
          ))}
          
        </tr>
      ))
      }
    </thead>
  );
};

export default TableHeader;
