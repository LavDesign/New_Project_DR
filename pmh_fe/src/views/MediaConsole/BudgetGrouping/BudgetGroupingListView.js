import React, { useEffect, useState, useMemo } from 'react';
import styles from '_theme/modules/dailyReview/dailyReview.module.css';
import * as Columns from '_helpers/columns/columns';
import { allColumnslist } from '_helpers/columns/budgetGroups';
import TableComponent from '../Common/NewUI/TableComponent';
import SkeletonLoaderComponent from '../Common/SkeletonLoaderComponent';

const BudgetGroupingListView = ({
  campaignGroups,
  setIsLoading,
  updateCampaignGroups,
}) => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (campaignGroups) {
      setData(campaignGroups);
    }
  }, [campaignGroups]);

  const tableColumnHeaders = useMemo(() => {
    let listOfColumns = Columns.processSelectedColumns(
      allColumnslist,
      'budgetGroups'
    ).filter((col) => col !== undefined);
    listOfColumns = listOfColumns.filter(
      (item, index) =>
        listOfColumns.findIndex(
          (elem) => elem.accessorKey === item.accessorKey
        ) === index
    );
    return listOfColumns;
  }, []);
  const displayGroupData = (data) => data.flatMap((group) => group);

  const mainPageContent = () => {
    return (
      <>
        {data ? (
          data.length ? (
            <div className={styles['campaign-advisor-div']}>
              <TableComponent
                tableColumnHeaders={tableColumnHeaders}
                data={displayGroupData(data, null)}
                isBudgetRecPage={true}
                // fetchHeaderData={(headers) =>
                //   setExportTableHeader(headers)
                // }
                tabName={'budgetGroups'}
                setIsLoading={setIsLoading}
                updateCampaignGroups={updateCampaignGroups}
              />
            </div>
          ) : (
            <span className={`${styles['messageStyle']}`}>
              No data available
            </span>
          )
        ) : (
          <SkeletonLoaderComponent />
        )}
      </>
    );
  };
  return (
    <>
      <div>{mainPageContent()}</div>
    </>
  );
};
export default BudgetGroupingListView;
