import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from '_theme/modules/dailyReview/dailyReview.module.css'
import { allColumnslist } from '_helpers/columns/campaigns';
import TableComponent from '../Common/NewUI/TableComponent';
import PageSpinner from 'common/Spinner';
import * as Columns from '_helpers/columns/columns';

const CampaignsListView = () => {
    const campaigns = [{
        'name': 'Campaign for Winter Promotions',
        'status': 'Active',
        'lifetime_spend': 1500.50,
        'pacing_budget_lifetime': 2000.00,
        'pacing_lifetime': 1800.00,
        'budget_progress_lifetime': 75.00,
        'budget_progress_start_date_lifetime': '2023-01-01',
      },{
        'name': 'Trigger Campaign for Halloween Promotion',
        'status': 'Draft',
        'lifetime_spend': 1500.50,
        'pacing_budget_lifetime': 2000.00,
        'pacing_lifetime': 1800.00,
        'budget_progress_lifetime': 75.00,
        'budget_progress_start_date_lifetime': '2023-01-01',
      },
      {
        'name': 'Banner Campaign | Multi Channel Campaign  | PRJ | 023 | 034622',
        'status': 'Active',
        'lifetime_spend': 1500.50,
        'pacing_budget_lifetime': 2000.00,
        'pacing_lifetime': 1800.00,
        'budget_progress_lifetime': 75.00,
        'budget_progress_start_date_lifetime': '2023-01-01',
      }]
    const [data, setData] = useState(undefined);

    useEffect(() => {
        if (campaigns) {
          setData(campaigns);
        }
      }, []);

    const tableColumnHeaders = useMemo(() => {
        let listOfColumns = Columns.processSelectedColumns(
          allColumnslist,
          'campaigns'
        ).filter((col) => col !== undefined);
        listOfColumns = listOfColumns.filter(
          (item, index) =>
            listOfColumns.findIndex(
              (elem) => elem.accessorKey === item.accessorKey
            ) === index
        );
        return listOfColumns;
      }, []);
    
    const displayGroupData = (data) => data.flatMap((campaigns) => campaigns);

    return (
        <>
          {data ? (
            data.length ? (
              <div className={styles['campaign-advisor-div']}>
                <TableComponent
                  tableColumnHeaders={tableColumnHeaders}
                  data={displayGroupData(data, null)}
                  tabName='campaigns'
                />
              </div>
            ) : (
              <span className={`${styles['messageStyle']}`}>
                No data available
              </span>
            )
          ) : (
            <PageSpinner />
          )}
        </>
      );
}

export default CampaignsListView;