import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import groupStyles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import moment from 'moment';
import {
  getCampaignBudgetGroups,
} from '_services/budgetGrouping';
import {
  BUDGET_GROUPS_LIST,
  EDIT_GROUP_DATA,
  SHOW_NOTIFICATION,
} from 'common/Redux/Constants';
import { getNotificationObject } from 'views/UI/notificationInfo';
import BGCard from './BGCard';
import BudgetGroupingListView from './BudgetGroupingListView';
import { useStore } from '_helpers/storeContext';
import BGToolBar from './BGToolBar';
import NoBudgetGroup from './NoBudgetGroup';
import SkeletonLoaderComponent from '../Common/SkeletonLoaderComponent';

const BudgetGrouping = () => {
  const [campaignGroups, setCampaignGroups] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [viewSelection, setViewSelection] = useState('list');
  const copyGroupData = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createBudgetGroupErrorMessage] = useState('');

  const {
    store: { currentUser },
  } = useStore();

  useEffect(() => {
    updateCampaignGroups();
  }, []);

  const getCampaignGroups = async () => {
    return await getCampaignBudgetGroups();
  };

  const updateCampaignGroups = async () => {
    if (!isLoading) setIsLoading(true);
    await getCampaignGroups()
      .then((response) => {
        if (response.json) {
          const updatedGroupDetails = response.json.map((group) => {
            return {
              ...group,
              kpi: group.kpi ? group.kpi : '-',
              campaigns: group.campaigns.map((campaign) => {
                return {
                  ...campaign,
                  groupName: group.groupName,
                  kpi: group.kpi ? group.kpi : '-',
                  clientName: group.clientName,
                  region: group.region,
                };
              }),
              currency_code: group.campaigns.length
                ? group.campaigns[0].currencyCode
                : undefined,
              allAccounts: Array.from(
                new Set(
                  group.campaigns?.map((element) => {
                    return element.accountKey;
                  })
                )
              ),
              allPlatforms: Array.from(
                new Set(
                  group.campaigns?.map((element) => {
                    return element.platformName;
                  })
                )
              ),
              startDate: group?.startDate
                ? moment(group?.startDate).format('MM/DD/YYYY')
                : '--',
              endDate: group?.endDate
                ? moment(group?.endDate).format('MM/DD/YYYY')
                : '--',
              region: group.region,
              isGroupSubscribed: group?.budgetUpdateMailList
                ? group?.budgetUpdateMailList.includes(
                    currentUser?.email?.split('@')[0].toString()
                  )
                : false,
            };
          });
          copyGroupData.current = JSON.parse(
            JSON.stringify(updatedGroupDetails)
          );
          setCampaignGroups(updatedGroupDetails);
          dispatch({
            type: BUDGET_GROUPS_LIST,
            payload: updatedGroupDetails,
          });
        } else {
          setCampaignGroups([]);
          dispatch({
            type: BUDGET_GROUPS_LIST,
            payload: [],
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setCampaignGroups(
          `There is an issue with the request. Please try again later!`
        );
        setIsLoading(false);
      });
  };

  const onCreateBudgetGroup = () => {
    dispatch({ type: EDIT_GROUP_DATA, payload: undefined });
    if (createBudgetGroupErrorMessage === '')
      navigate('/new-edit-budget-group');
    else
      dispatch({
        type: SHOW_NOTIFICATION,
        payload: getNotificationObject('error', createBudgetGroupErrorMessage),
      });
  };

  return (
    <>
      <BGToolBar
        onCreateBudgetGroup={onCreateBudgetGroup}
        viewSelection={viewSelection}
        setViewSelection={setViewSelection}
        budgetGroupData={copyGroupData.current}
        filteredBudgetGroup={(data) => setCampaignGroups(data)}
      />
      <div className={`${groupStyles['budget-group__parent-div']}`}>
        {isLoading ? (
          <SkeletonLoaderComponent />
        ) : (
          <>
            {campaignGroups ? (
              Array.isArray(campaignGroups) ? (
                campaignGroups.length === 0 ? (
                  <NoBudgetGroup
                    mainHeading={
                      copyGroupData.current.length
                        ? 'We didn’t find a match for your search'
                        : 'You don’t have any Budget Group created'
                    }
                    content={
                      copyGroupData.current.length
                        ? 'Try Searching for something else'
                        : 'Your Budget Groups will be shown in this screen'
                    }
                  />
                ) : viewSelection === 'list' ? (
                  <BudgetGroupingListView
                    campaignGroups={campaignGroups}
                    setIsLoading={setIsLoading}
                    updateCampaignGroups={updateCampaignGroups}
                  />
                ) : (
                  <div className={`${groupStyles['bg__main-view']}`}>
                    {campaignGroups.map((group, index) => (
                      <BGCard
                        keyValue={`group_${index}`}
                        group={group}
                        setIsLoading={setIsLoading}
                        updateCampaignGroups={updateCampaignGroups}
                        key={`group_${index}`}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className={`${groupStyles['error-groups']}`}>
                  {campaignGroups}
                </div>
              )
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default BudgetGrouping;
