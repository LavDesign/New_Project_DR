import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '_theme/modules/dailyReview/dailyReview.module.css';
import searchStyles from '_theme/modules/shared/TableComponent.module.css';
import * as Columns from '_helpers/columns/columns';
import { allColumnslist } from '_helpers/columns/campaignAdvisor';
import TableComponent from '../Common/TableComponent';
import SearchInput from 'views/UI/SearchInput';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import ExportTableComponent from 'views/shared/ExportTableComponent';
import PageSpinner from 'common/Spinner';
import { SELECTED_DAILY_REVIEW_MENU, SHOW_RESPONSE } from 'common/Redux/Constants';
import { DAILY_REVIEW_TABS } from '_helpers/Utils/mediaConsoleUtil';
import { useNavigate } from 'react-router-dom';
import { loadCampaignsIntoManagementTable } from '_services/dailyReview';
import { getNotificationObject } from 'views/UI/notificationInfo';
import Spinner from 'common/SmallSpinner';
import { useTranslation } from 'react-i18next';

const CampaignAdvisor = () => {
  const [data, setData] = useState(undefined);
  const [searchValue, setSearchValue] = useState(undefined);
  const [exportTableHeader, setExportTableHeader] = useState([]);
  const [showLoaderButton, setShowLoaderButton] = useState(false);
  const [selectedDivKey, setSelectedDivKey] = useState(undefined);
  const copyData = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);

  const { selectedDailyReviewMenu, dailyReviewBudgetGroups } = useSelector(
    (store) => store.getMediaConsole
  );

  useEffect(() => {
    if (dailyReviewBudgetGroups) {
      if (Array.isArray(dailyReviewBudgetGroups)) {
        let groupData = dailyReviewBudgetGroups;
        if (selectedDailyReviewMenu?.groupList?.length) {
          // This block is to filter the grouplist based on the navigation
          groupData = selectedDailyReviewMenu.groupList;
        }
        copyData.current = JSON.parse(JSON.stringify(groupData));
        setData(groupData);
      } else setData(dailyReviewBudgetGroups);

      setSearchValue(undefined);
    }
  }, [selectedDailyReviewMenu, dailyReviewBudgetGroups]);

  const tableColumnHeaders = useMemo(() => {
    let listOfColumns = Columns.processSelectedColumns(
      allColumnslist,
      'campaignAdvisor'
    ).filter((col) => col !== undefined);
    listOfColumns = listOfColumns.filter(
      (item, index) =>
        listOfColumns.findIndex(
          (elem) => elem.accessorKey === item.accessorKey
        ) === index
    );

    return listOfColumns;
  }, []);

  const redirectToManagementTable = (group, index) => {
    setSelectedDivKey(index);
    setShowLoaderButton(true);
    const payload = group.campaigns.map((item) => { return { campaignKey: item.campaignKey, accountKey: item.accountKey } });
    loadCampaignsIntoManagementTable(payload).then((response) => {
      if (response?.statusCode === 200) {
        dispatch({
          type: SHOW_RESPONSE,
          payload: response?.json ? getNotificationObject('error', response.json) : getNotificationObject('success', t('validation_messages.load_management_success')),
        });
      }
      else {
        dispatch({
          type: SHOW_RESPONSE,
          payload: response?.statusDescription ? getNotificationObject('error', response.statusDescription) : getNotificationObject('error', 'An error occured while loading the campaigns'),
        });
      }
      setShowLoaderButton(false);
      navigate('/management');

    }).catch(() => {
      onClose();
      dispatch({
        type: SHOW_RESPONSE,
        payload: getNotificationObject('error' ,'There is an issue with the request. Please try again later'),
      });
      setShowLoaderButton(false);
      navigate('/management');
    });

  }

  const displayGroupData = (data, group) =>
    data
      .filter((row) => row.groupId === group.groupId)
      .flatMap((group) => group.campaigns);

  const onSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchValue(event.target.value || undefined);
    const filteredData = copyData.current
      .map((item) => {
        const matchingCampaigns = item.campaigns.filter(
          (campaign) =>
            campaign.groupName?.toLowerCase().includes(searchText) ||
            campaign.campaign_name?.toLowerCase().includes(searchText)
        );

        return {
          ...item,
          campaigns: matchingCampaigns,
        };
      })
      .filter((item) => item.campaigns.length > 0);

    setData(filteredData);
  };

  return (
    <div className={styles['daily-review-container-section']}>
      <div className={styles['daily-review-container-section-title']}>
        Campaign Advisor
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
            <div className={styles['campaign-advisor-toolbar']}>
              <SearchInput
                placeholderText={'Search'}
                inputValue={searchValue || ''}
                onChangeHandler={(event) => onSearch(event)}
                classSeachInput={searchStyles['budget-table-search']}
                inputSearchStyle={searchStyles['budget-table-search-input']}
              />
              {data.length ? (
                <ExportTableComponent
                  headerGroups={exportTableHeader}
                  tableData={data.flatMap((group) => group.campaigns)}
                  customExport={true}
                  fileName={'Campaign Advisor'}
                />
              ) : null}
            </div>
            {data.length ? (
              data.map((group, index) => {
                if (data.some((item) => item.groupId === group.groupId)) {
                  return (
                    <div key={`campaign_advisor_${index}`} className={styles['campaign-advisor-div']}>
                      <TableComponent
                        tableColumnHeaders={tableColumnHeaders}
                        data={displayGroupData(data, group)}
                        isBudgetRecPage={true}
                        fetchHeaderData={(headers) =>
                          setExportTableHeader(headers)
                        }
                      />
                      <div className={styles['main-div']}>
                        <div className={styles['load-management-div']}
                          onClick={() =>
                            dispatch({
                              type: SELECTED_DAILY_REVIEW_MENU,
                              payload: {
                                pageId: DAILY_REVIEW_TABS.DAILY_REV_DASH.id,
                                groupList: group,
                              },
                            })
                          }
                        >
                          <div>

                            <img
                              src={`${window.location.origin}${PUBLICURL}/assets/icons/view-dashboard.svg`}
                              alt=''
                            />
                          </div>
                          <span>View Dashboard</span>
                        </div>
                        <br></br>
                        {(showLoaderButton && selectedDivKey == index) ? (<Spinner hideColor={showLoaderButton} />) :
                          <>
                            <div 
                              className={styles['load-management-div']}
                              key={index}
                              onClick={() => redirectToManagementTable(group, index)}>
                               <div>
                                <img
                                  src={`${window.location.origin}${PUBLICURL}/assets/icons/view-dashboard.svg`}
                                  alt=''
                                />
                               </div>
                              <span>Load Management</span>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <span className={`${styles['messageStyle']}`}>
                No data available
              </span>
            )}
          </>
        )
      ) : (
        <PageSpinner showLoadingText={false} />
      )}
    </div>
  );
};
export default CampaignAdvisor;
