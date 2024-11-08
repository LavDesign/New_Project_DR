import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '_theme/modules/dailyReview/dailyReview.module.css';
import * as Columns from '_helpers/columns/columns';
import { allColumnslist } from '_helpers/columns/budgetRecommendation';
import CustomButton from 'views/UI/CustomButton';
import TableComponent from '../Common/TableComponent';
import {
  SELECTED_DAILY_REVIEW_MENU,
  SHOW_NOTIFICATION,
} from 'common/Redux/Constants';
import { saveAutoBudget } from '_services/dailyReview';
import { getNotificationObject } from 'views/UI/notificationInfo';
import Spinner from 'common/SmallSpinner';
import SectionSpinner from 'common/Spinner';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';

const BudgetRecommendation = () => {
  const [data, setData] = useState(undefined);
  const [showLoaderButton, setShowLoaderButton] = useState(false);
  const [checkRows, setCheckRows] = useState(undefined);
  const { selectedDailyReviewMenu, dailyReviewBudgetGroups } = useSelector(
    (store) => store.getMediaConsole
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setData(dailyReviewBudgetGroups);
  }, [selectedDailyReviewMenu, dailyReviewBudgetGroups]);

  const tableColumnHeaders = useMemo(() => {
    let listOfColumns = Columns.processSelectedColumns(
      allColumnslist,
      'budgetRecommendation'
    ).filter((col) => col !== undefined);
    listOfColumns = listOfColumns.filter(
      (item, index) =>
        listOfColumns.findIndex(
          (elem) => elem.accessorKey === item.accessorKey
        ) === index
    );

    return listOfColumns;
  }, []);

  const onApplyChangesClick = () => {
    setShowLoaderButton(true);
    const groupsSelected = data.filter((row) => row.isSelected);
    const payload = groupsSelected.map((group) => group.groupId.toString());
    saveAutoBudget(payload)
      .then((response) => {
        setShowLoaderButton(false);
        const { statusCode } = response;
        let notificationObj = getNotificationObject('error');
        if (statusCode === 200) {
            notificationObj = getNotificationObject(
            'success',
            'Platform budgets are being updated with the recommended budgets. Please check your email for the platform budget update status.'
            );
          dispatch({
            type: SELECTED_DAILY_REVIEW_MENU,
            payload: {
              pageId: DAILY_REVIEW_TABS.CAMPAIGN_ADV.id,
              groupList: [],
            },
          });
        }
        if (statusCode === 700) {
          notificationObj = getNotificationObject(
          'error',
          'You are not authorized to update campaigns in the selected budget groups. Please authenticate with the platform(s) on the Platform Authentication page'
          );
        }
        dispatch({
          type: SHOW_NOTIFICATION,
          payload: notificationObj,
        });
      })
      .catch(() => {
        dispatch({
          type: SHOW_NOTIFICATION,
          payload: getNotificationObject('error'),
        });
        setShowLoaderButton(false);
        setData((prevData) => {
          return prevData.map((row) => {
            if (row.isSelected) {
              row.isSelected = false;
            }
            return row;
          });
        });
      });
  };

  const disabledApplyBtn = () =>
    data?.filter((row) => row.isSelected).length === 0;

  return (
    <div className={styles['daily-review-container-section']}>
      <div className={styles['daily-review-container-section-title']}>
        Budget Recommendation
      </div>

      {data ? (
        data.message ? (
          <span
            className={`${styles['messageStyle']} ${
              data.state ? styles['errorStyle'] : ''
            }`}
          >
            {data.message}
          </span>
        ) : (
          <>
            <TableComponent
              tableColumnHeaders={tableColumnHeaders}
              data={data}
              updateCheckedTableData={(data) => setData(data)}
              isRowAvailable={(data) => setCheckRows(data)}
            />
            {checkRows?.length ? (
              <CustomButton
                className={`btn-light ${
                  styles['budget-recommendation-apply-button']
                } ${
                  disabledApplyBtn()
                    ? styles['budget-recommendation-apply-button-disabled']
                    : ''
                }`}
                onClick={() => onApplyChangesClick()}
              >
                {showLoaderButton ? (
                  <Spinner hideColor={showLoaderButton} />
                ) : (
                  `Apply Budget Recommendations to Platform`
                )}
              </CustomButton>
            ) : null}
          </>
        )
      ) : (
        <SectionSpinner showLoadingText={false} />
      )}
    </div>
  );
};

export default BudgetRecommendation;
