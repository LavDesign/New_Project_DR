import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { getPlatformsInfo, getKeys } from "../../_helpers/Utils/availablePlatformsInfo";
import useAccountAssociation from "../../_helpers/hooks/useAccountAssociation";
import PlatformSection from "./PlatformSection";
import { fetchAccountsByPlatformId } from "../../_services/campaignDash";
import AlertMessage from 'views/UI/AlertMessage';
import { pageCategory, trackButtonClick, capitalizeFirstLetter, setCurrentPageCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import styles from '../../_theme/modules/UI/AccountAssociation.module.css';
import SkeletonLoaderComponent from 'views/MediaConsole/Common/SkeletonLoaderComponent';

const PlatformAuthentication = () => {
  const { initAccountAssociation, disassociatePlatformAccount, getAccountsByPlatformId } = useAccountAssociation();
  const { t } = useTranslation(['common']);

  const [accountsInfoByPlatform, setAccountsInfoByPlatform] = useState(undefined);
  // TODO: Change as per the google accounts dv360 integration
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState({ user: {}, accounts: [] })
  const [googleDV360Accounts, setGoogleDV360Accounts] = useState({ user: {}, accounts: [] })
  const [facebookAccounts, setFacebookAccounts] = useState({ user: {}, accounts: [] });
  const [linkedinAccounts, setLinkedInAccounts] = useState({ user: {}, accounts: [] });
  const[googleSA360Accounts, setGoogleSA360Accounts] = useState({ user: {}, accounts: [] });
  const [associationState, setAssociationState] = useState({ requestFinished: false, state: '', strongMessage: '', message: '', alertType: '' });

  // TODO: Change as per the google accounts dv360 integration
  const setAccountsObject = {
    'facebook': setFacebookAccounts,
    'linkedin': setLinkedInAccounts,
    'googleads': setGoogleAdsAccounts,
    'googledv360': setGoogleDV360Accounts,
    'googlesa360': setGoogleSA360Accounts
  };

  const getAssociationObject = state => {
    const strongMessage = {
      'success': 'Success:',
      'idNotFound': 'Error:'
    };
    const message = {
      'success': 'Account successfully disassociated.',
      'idNotFound': 'There is no associated account.'
    };
    const alertType = {
      'success': "alert-success",
      'idNotFound': 'alert-danger'
    };
    return {
      requestFinished: true,
      state,
      strongMessage: strongMessage[state],
      message: message[state],
      alertType: alertType[state]
    }
  };

  const adaptResponseData = (data) => ({
    user: {
      id: data?.userId,
      name: data?.userName,
      platformUserId: data?.platformUserId,
    },
    accounts: [
      {
        email: data?.userEmail,
        associated_accounts: data?.accounts?.map(account => ({
          id: account?.accountKey,
          name: account?.name,
          status: account?.status
        }))
      }
    ]
  });

  const setDataPlatforms = async () => {
    const platformKeys = getKeys();
    const promisesArray = platformKeys.map((key) => {
      const platformInfo = getPlatformsInfo(key);
      return fetchAccountsByPlatformId({ platformId: platformInfo.id });
    });
    const values = await Promise.all(promisesArray).then((values) => values);

    const accountsInfoByPlatform = platformKeys.map((key) => {
      const platformInfo = getPlatformsInfo(key);
      return {
        platformName: key,
        ...values
          .filter((value) => value !== null)
          .find((elem) => elem.platformId === platformInfo.id),
      };
    });
    setAccountsInfoByPlatform(accountsInfoByPlatform);
  };

  useEffect(() => {
    setDataPlatforms();

    return () => {
      // To reset the page category when the component is unmounted
      setCurrentPageCategory(null);
    }
  }, []);

  useEffect(() => {
    if (accountsInfoByPlatform) {
      for (const platformData of accountsInfoByPlatform) {
        setAccountsObject[platformData.platformName](adaptResponseData(platformData))
      }
    }
  }, [accountsInfoByPlatform]);

  const refreshPlatformData = async platformInfo => {
    const platformAccounts = await getAccountsByPlatform(platformInfo.platform);
    setAccountsObject[platformInfo.platform](adaptResponseData(platformAccounts));
  };

  const associateAccount = async (platform) => {
    var name = (platform === 'googleads') ? 'Google' : capitalizeFirstLetter(platform)
    trackButtonClick(name, `${pageCategory.platformAuthentication} - Associate`)

    const platformInfo = getPlatformsInfo(platform);
    const associationWindow = await initAccountAssociation(platformInfo);

    let timeExceedCounter = 0;
    const checkPopup = await setInterval(() => {
      // Interval to keep checking if the association popup is still open, and if not then refresh the platform data
      // If the time exceeds 10 minutes then stop the interval
      if ((!associationWindow || !associationWindow.closed) && timeExceedCounter < 600) {
        timeExceedCounter++;
        return;
      }

      refreshPlatformData({ platform, id: platformInfo.id });

      if (platform === 'googleads')
      {
        refreshPlatformData({ platform: 'googledv360', id: 5 });
        refreshPlatformData({ platform: 'googlesa360', id: 6 });
      }


      clearInterval(checkPopup);

    }, 1000)
  };

  const getAccountsByPlatform = async (platform) => {
    const platformInfo = getPlatformsInfo(platform);
    return getAccountsByPlatformId(platformInfo);
  };

  const disassociateAccount = async (platform) => {
    var name = (platform === 'googleads') ? 'Google' : capitalizeFirstLetter(platform)
    trackButtonClick(name, `${pageCategory.platformAuthentication} - Disassociate`)

    const platformInfo = getPlatformsInfo(platform);
    let result = await disassociatePlatformAccount(platformInfo)
    refreshPlatformData({ platform, id: platformInfo.id });

    if (result.statusCode == 200) {
      setAssociationState({ ...getAssociationObject('success') });
    }
    if (result.statusCode == 700) {
      setAssociationState({ ...getAssociationObject('idNotFound') });
    }
  }

  const disassociateAccountHandler = async (platform) => {
    disassociateAccount(platform);
    if (platform === 'googleads')
    {
      disassociateAccount('googledv360');
      disassociateAccount('googlesa360');
    }
  };

  useEffect(() => {
    const clearAssociationState = async () => {
      await new Promise(resolve => setTimeout(resolve, 3500));
      setAssociationState({ requestFinished: false, state: '', strongMessage: '', message: '', alertType: '' });
    };

    if (associationState.requestFinished) {
      const intervalId = setInterval(clearAssociationState, 3500);
      return () => clearInterval(intervalId);
    }
  }, [associationState, setAssociationState]);

  return (
    <div className={`${styles['groove_parent_div']}`}>
      <div
        className={`container col col-sm-8 text-center bg-white rounded ${styles['groove_container']} ${styles['groove_main_container']}`}
      >
        {accountsInfoByPlatform ? (
          <>
            {associationState.requestFinished && (
              <AlertMessage {...associationState} />
            )}
            <h1 className={`${styles['groove_heading']}`}>
              {t('site_titles.platform_authentication')}
            </h1>
            <p className={`${styles['groove_para']}`}>
              {t('site_texts.platform_authentication_description')}
            </p>

            <PlatformSection
              platform='facebook'
              platformMessage={t(`site_texts.facebook_message`)}
              accounts={facebookAccounts}
              associateAccount={associateAccount}
              disassociateAccount={disassociateAccountHandler}
            />
            <PlatformSection
              platform='googleads'
              platformMessage=''
              accounts={googleAdsAccounts}
              googleDV360Accounts={googleDV360Accounts}
              googleSA360Accounts={googleSA360Accounts}
              associateAccount={associateAccount}
              disassociateAccount={disassociateAccountHandler}
            />
            <PlatformSection
              platform='linkedin'
              platformMessage=''
              accounts={linkedinAccounts}
              associateAccount={associateAccount}
              disassociateAccount={disassociateAccountHandler}
            />
          </>
        ) : (
          <SkeletonLoaderComponent />
        )}
      </div>
    </div>
  );
};

export default PlatformAuthentication;
