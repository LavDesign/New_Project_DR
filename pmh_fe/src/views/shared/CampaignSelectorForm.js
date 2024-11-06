import React, { useState, useEffect } from 'react';
import _ from "underscore";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import styled from 'styled-components';

import { useSelectedCampaigns } from '../../_helpers/SelectedCampaignsContext';
import AccountSelector from './AccountSelector';
import CampaignTableSelector from './CampaignTableSelector';
import CustomNavTabs from './CustomNavTabs';
import styles from '../../_theme/modules/campaingDash/CampaignSelectorForm.module.css';
import { useTranslation } from 'react-i18next';
import Spinner from 'common/Spinner';
import { trackButtonClick, getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';

const EmptySelectionComponent = styled.div`
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
`;

const CampaignSelectorForm = props => {
  const { campaigns: selectedCampaigns } = useSelectedCampaigns();
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation(['common']);

  const tabChangeHandler = (newValue) => {
    var tabName = (newValue === 0) ? t('site_titles.available_campaigns') : t('site_titles.selected_campaigns')
    trackButtonClick(tabName, `${getPageCategory()} ${pageSubCategory.campaignModal}`, 'Tab')
    setTabValue(newValue);
  };

  const getTotalSelectedAccount = () => {
    return selectedCampaigns.filter(element => element.isActive)?.length;
  }

  const handleAccountChange = (value) => {
    props.setSelectedAccount(value);
  }

  const tabNames = [
    `${t('site_titles.available_campaigns')} (${props?.availableCampaigns?.length})`,
    `${t('site_titles.selected_campaigns')} (${getTotalSelectedAccount()})`
  ];

  return (
    <>
      {props.emptyAccounts === true ?
        <span className={`${styles['errorText']}`}>{t('error_messages.empty_accounts')}</span>
        :
        props.availableAccounts.length > 0 ?
          <div>
            <div>
              <div>
                <AccountSelector
                  style={{ width: '100%', marginRight: '20px' }}
                  availableAccounts={props.availableAccounts}
                  selectedAccount={props.selectedAccount}
                  setSelectedAccount={handleAccountChange}
                  placeholder='Select Account'
                />
              </div>
              <div>
                <nav style={{ borderBottom: 'none !important' }} className='navbar-default nav-tabs mt-2'>
                  <div className={styles['navTabs-container']}>
                    <CustomNavTabs
                      tabHeaders={tabNames}
                      selectedTab={tabValue}
                      setSelectedTab={tabChangeHandler}
                      isCampaignSelectorPopup='true' />
                  </div>
                </nav>
                <div className='row'>
                  <div className='col col-md-12'>
                    {!props.availableCampaigns && tabValue === 0 ?
                      <EmptySelectionComponent>
                        <TuneOutlinedIcon />
                        <p>Select an Account to see available Campaigns</p>
                      </EmptySelectionComponent>
                      : props.availableCampaigns.length === 0 && tabValue === 0 ?
                        <Spinner />
                        : <CampaignTableSelector
                          viewCode={props.viewCode}
                          data={tabValue === 0 ? props.availableCampaigns : []}
                          tab={tabValue}
                          selectedAccount={props.selectedAccount}
                          disableCheckBox={props.disableCheckBox}
                        />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          : <Spinner />}
    </>
  )
};

  
CampaignSelectorForm.defaultProps  = {
  disableCheckBox: false  
};

export default CampaignSelectorForm;