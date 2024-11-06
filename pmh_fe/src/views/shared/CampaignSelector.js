import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useStore } from '../../_helpers/storeContext';
import { useSelectedCampaigns } from '../../_helpers/SelectedCampaignsContext';
import {
  fetchAvailableDashboards,
  fetchAvailableCampaigns,
  fetchSelectedCampaigns,
  saveSelectedCampaigns
} from '../../_services/campaignDash';
import CustomModal from '../UI/CustomModal';
import CampaignSelectorForm from './CampaignSelectorForm';
import { useTranslation } from 'react-i18next';
import { trackButtonClick,getPageCategory, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { CLEAR_CACHE_QUERY, RESET_CAMPAIGNS, SET_DASH_TAB } from 'common/Redux/Constants/index';
import { useUserInfo } from '_helpers/userInfoContext';
import { getDashData } from '_helpers/Utils/dashboardUtil';

const CampaignSelector = props => {
  const { userInfo } = useUserInfo();
  const { store } = useStore();
  const { campaigns: selectedCampaigns, setInitialState: setSelectedCampaigns } = useSelectedCampaigns();
  const [accountList, setAccountList] = useState([]);
  const [emptyAccounts, setEmptyAccounts] = useState(false);
  const [showLoaderButton, setShowLoaderButton] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [availableCampaigns2, setAvailableCampaigns2] = useState([]);
  const { t } = useTranslation(['common']);

  const dispatch = useDispatch();

  useEffect(() => {
    const { selectedDash } = store;
    fetchAvailableDashboards({ selectedDash: selectedDash ? selectedDash.userId : null }).then(data => {
      setAccountList(data);
      if (data.length > 0 && selectedAccount === null) {
        setSelectedAccount(data[0]);
        setShowLoaderButton(true);
      }
      else{
        setEmptyAccounts(true);
      }
    });
    fetchSelectedCampaigns({ selectedDash: selectedDash ? selectedDash.userId : null }).then(data => {
      setSelectedCampaigns(data);
    });

  }, []);

  useEffect(() => {
    setAvailableCampaigns2([]);
    const { selectedDash } = store;
    if (selectedDash === null || selectedAccount === null) {
      console.warn('Not Dashboard or Account selected!')
      return;
    }

    fetchAvailableCampaigns({
      selectedDash: selectedDash ? selectedDash.userId : null,
      selectedAccount: selectedAccount ? selectedAccount.accountKey : null,
      selectedAccountPlatformId: selectedAccount ? selectedAccount.platformId : null,
      ...(selectedAccount && selectedAccount.parentKey && { parentKey: selectedAccount.parentKey }),
    }).then(data => {
      setAvailableCampaigns2(data.map(data => ({
        name: data.name,
        campaignKey: data.campaignKey,
        status: data.status,
        platformId: data.platformId
      })));
    })

  }, [selectedAccount]);

  const loadCampaignsHandler = () => {
    dispatch({ type: RESET_CAMPAIGNS });
    trackButtonClick(t('button_text.load_campaign'),`${getPageCategory()} ${pageSubCategory.campaignModal}`)
    let filteredData;
    filteredData = selectedCampaigns;

    const selectedCampaignsData = filteredData.map(item => {
      return { ...item }
    });

    saveSelectedCampaigns({ campaigns: selectedCampaignsData})
      .then(() => {
        props.onClose();
        dispatch({
          type: SET_DASH_TAB,
          payload: getDashData(userInfo?.defaultTab),
        });
        dispatch({
          type: CLEAR_CACHE_QUERY,
          payload: true,
        });
        props.setIsRefetchingCampaignDashData(true);
      })
  };

  return (
    <CustomModal
      open={props.openModal}
      onClose={props.onCancel}
      onAccept={loadCampaignsHandler}
      title={t('button_text.select_campaigns')}
      formHeight='450px'
      onSaveText={showLoaderButton ? t('button_text.load_campaign') : null}
      onCloseText={t('button_text.cancel')}
      isGroove={true}
      modalBodyClass={{ maxHeight: "70vh", overflow: "auto"}}
      modalContentHeight={'60vh'}
    >
      {accountList !== null  ?
        <CampaignSelectorForm
          availableAccounts={accountList}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          availableCampaigns={availableCampaigns2}
          emptyAccounts={emptyAccounts} />
        : <span>Error in fetching accounts. Please try again.</span>}
    </CustomModal>
  )
};

export default CampaignSelector;
