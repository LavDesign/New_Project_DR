import CampaignToolBar from './CampaignToolBar';
import CampaignsListView from './CampaignsListView';
import groupStyles from '_theme/modules/Campaigns/campaigns.module.css';

const Campaigns = () => {
  return (
    <>
      <CampaignToolBar />
      <div className={`${groupStyles['campaigns_parent-div']}`}>
        <CampaignsListView />
      </div>
    </>
  );
};

export default Campaigns;
