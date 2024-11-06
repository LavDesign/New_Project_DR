import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { formatNumberToCurrency } from '_helpers/columns/cellFormatters';
import styles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import '_theme/modules/shared/CustomToolTip.css';
import { truncateText } from '_helpers/Utils/mediaConsoleUtil';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import BudgetGroupActionModalContainer from './BudgetGroupActionModalContainer';
import { BG_DETAILS_GROUP } from 'common/Redux/Constants';
import { useDispatch } from 'react-redux';

const BGCard = ({
  keyValue,
  group,
  setIsLoading,
  updateCampaignGroups,
}) => {
  const dispatch = useDispatch();

  const displayToolTipField = (data, length = 12) => {
    return truncateText(data, length)?.includes('...') ? (
      <OverlayTrigger
        placement={'bottom'}
        overlay={
          <Tooltip className='customToolTip' id={`tooltip-right`}>
            {data}
          </Tooltip>
        }
      >
        <div className={styles['bg-card__value']}>
          {truncateText(data, length)}
        </div>
      </OverlayTrigger>
    ) : (
      <div className={styles['bg-card__value']}>{data}</div>
    );
  };

  return (
    <div
      key={`bg-card-${keyValue}`}
      className={`${styles['bg-card__main-div']}`}
    >
      <div className={styles['bg-card__title']}>
        <span>{group.groupName}</span>
        <span>
          {group.isGroupSubscribed ? (
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/eye-solid.svg`}
              alt={'Followed'}
            />
          ) : (
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/eye.svg`}
              alt={'Unfollowed'}
            />
          )}
        </span>
      </div>
      <div className={styles['bg-card__line-break']} />
      <div className={styles['bg-card__details']}>
        <div className={styles['bg-card__section']}>
          <div className={styles['bg-card__label']}>Campaigns</div>
          <div className={styles['bg-card__value']}>
            {group.campaigns.length}
          </div>
          <div className={styles['bg-card__label']}>Client</div>
          {displayToolTipField(group.clientName, 15)}
          <div className={styles['bg-card__label']}>End Date</div>
          <div className={styles['bg-card__value']}>{group.endDate}</div>
        </div>
        <div className={styles['bg-card__section']}>
          <div className={styles['bg-card__label']}>KPI</div>
          {displayToolTipField(group.kpi)}
          <div className={styles['bg-card__label']}>Budget</div>
          <div className={styles['bg-card__value']}>
            {formatNumberToCurrency(group.budgetValue, group.currency_code)}
          </div>
          <div className={styles['bg-card__label']}>Actions</div>
          <div
            onClick={() => {
              dispatch({
                type: BG_DETAILS_GROUP,
                payload: group,
              });
            }}
          >
            <BudgetGroupActionModalContainer
              setIsLoading={setIsLoading}
              updateCampaignGroups={updateCampaignGroups}
              fromCard={true}
              showCustomButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BGCard;
