import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import BaseStyles from '_theme/modules/BudgetGrouping/BudgetGrouping.module.css';
import Styles from '_theme/modules/Campaigns/campaigns.module.css';
import { useNavigate } from 'react-router-dom';
import CommonToolBar from '../Common/CommonToolBar/CommonToolBar';

const searchCriteriaList = [
  {
    label: 'Client',
    value: 'client',
  },
];

const CampaignToolBar = () => {
  const navigate = useNavigate();

  const displayNewGroupBtn = () => {
    return (
      <button
        className={`${BaseStyles['bg-toolbar__new-group-btn']}`}
        onClick={() => onCreateCampaign()}
      >
        <span className={`${BaseStyles['bg-toolbar__new-group-btn-text']}`}>
          Add Campaign
        </span>
      </button>
    );
  };
  const onCreateCampaign = () => {
    navigate('/new-edit-campaign');
  };
  const displayActionsBtn = () => {
    return (
      <button
        className={`${Styles['camp-toolbar-add-btn']}`}
        onClick={() => onCreateCampaign()}
      >
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/expand-more.png`}
          alt='Add'
        />
        <span className={`${Styles['camp-toolbar-add-btn-tex']}`}>Actions</span>
      </button>
    );
  };
  return (
    <CommonToolBar
      searchByTextLabel={'User'}
      searchCriteriaList={searchCriteriaList}
      displayComponents={
        <>
          {displayActionsBtn()}
          {displayNewGroupBtn()}
        </>
      }
    />
  );
};

export default CampaignToolBar;
