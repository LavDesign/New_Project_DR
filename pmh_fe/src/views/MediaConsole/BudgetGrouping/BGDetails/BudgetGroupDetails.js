import React, { useEffect, useState } from 'react';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import 'views/MediaConsole/BudgetGrouping/BGDetails/BudgetGroupDetails.scss';
import { useLocation } from 'react-router-dom';
import Campaigns from './Campaigns';
import { formatNumberToCurrency } from '_helpers/columns/cellFormatters';
import BudgetGroupActionModalContainer from '../BudgetGroupActionModalContainer';
import { useStore } from '_helpers/storeContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BudgetGroupDetails = () => {
  const {
    store: { currentUser },
  } = useStore();
  const navigate = useNavigate();
  const group = useSelector((store) => store.getMediaConsole?.bgDetailsGroup);
  const tabs = ['Group Details', 'Campaigns'];
  const [selectedTab, setSelectedTab] = useState(0);

  const handleCloseClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className='budgetgroup-details-container'>
      <div className='budgetgroup-title-section'>
        <div className='title-left'>{group?.groupName}</div>
        <div className='budgetgroup-action'>
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/${
              group?.isGroupSubscribed ? 'eye-solid' : 'eye'
            }.svg`}
            className='budgetgroup-unfollowed'
            alt={group?.isGroupSubscribed ? 'Followed' : 'Unfollowed'}
          />
          {group?.isGroupSubscribed ? 'Followed' : 'Unfollowed'}
        </div>
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/vertical-divider.svg`}
        />
        <div className='action-button'>
          <BudgetGroupActionModalContainer
            group={group}
            setIsLoading={() => {}}
            updateCampaignGroups={() => {}}
            showCustomButton={true}
          />
        </div>
        <div className='budgetgroupclose-icon' onClick={handleCloseClick}>
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/small-modal-close.svg`}
          />
        </div>
      </div>
      <div className='budgetgroup-tab'>
        <ul className='nav'>
          {tabs.map((name, idx) => (
            <li id={`${name}_${idx}`} className='nav-item' >
              <a
                style={{
                  border: 'none',
                  color: idx === selectedTab ? '#15181B' : '#6B7280',
                  paddingLeft: '0',
                }}
                role='button'
                tabIndex={idx}
                className={`nav-link groove-nav-link`}
                onClick={() => {
                  setSelectedTab(idx);
                }}
              >
                {`${name}`}
              </a>
              {idx === selectedTab && (
                <div className='budgetselected-tab'></div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {selectedTab === 0 ? (
        <div className='budgetgroup-details-data'>
          <div className='bg-card__details'>
            <div className='bg-card__section'>
              <div className='bg-card__label'>Campaigns</div>
              <div className='bg-card__value'>{group?.campaigns?.length}</div>
              <div className='bg-card__label'>Accounts</div>
              <div className='bg-card__value'>{group?.allAccounts?.length}</div>
              <div className='bg-card__label'>Client</div>
              <div className='bg-card__value'>{group?.clientName}</div>
              <div className='bg-card__label'>Channels</div>
              {group?.allPlatforms?.map((platform) => {
                return <div className='bg-card__value'>{platform}</div>;
              })}
            </div>
            <div className='bg-card__section'>
              <div className='bg-card__label'>KPI</div>
              <div className='bg-card__value'>{group?.kpi}</div>
              <div className='bg-card__label'>Region</div>
              <div className='bg-card__value'>{group?.region}</div>
              <div className='bg-card__label'>Budget</div>
              <div className='bg-card__value'>
                {formatNumberToCurrency(
                  group?.budgetValue,
                  group?.currency_code
                )}
              </div>
              <div className='bg-card__label'>Start Date</div>
              <div className='bg-card__value'>{group?.startDate}</div>
              <div className='bg-card__label'>End Date</div>
              <div className='bg-card__value'>{group?.endDate}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className='budgetgroup-details-data-campaigns'>
          <Campaigns group={group} />
        </div>
      )}
    </div>
  );
};

export default BudgetGroupDetails;
