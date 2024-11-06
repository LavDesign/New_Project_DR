import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getPlatformsInfo } from "../../_helpers/Utils/availablePlatformsInfo";
import CustomButton from "../UI/CustomButton";
import styles from '../../_theme/modules/UI/AccountAssociation.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const PlatformSection = props => {

  const { t } = useTranslation(['common']);
  const { platform, platformMessage, accounts, associateAccount, disassociateAccount, googleDV360Accounts ,googleSA360Accounts } = props;
  const [visible, setVisible] = useState(false);
  const platformInfo = getPlatformsInfo(platform.toLowerCase());
  const platformInfoDV360 = getPlatformsInfo('googledv360');

  const onAssociateAccount = () => {
    associateAccount(platform);
  };

  const onDisassociateAccount = () => {
    disassociateAccount(platform);//TODO: Connect with apis to disassociate accounts
  };

  const NoAccounts = (
    <div style={{ 'width': '98% !important' }} className="col col-sm-12 text-center bg-white">
      <h4 className={`${styles['groove_no_account']}`}>{t('site_texts.no_account')}</h4>
    </div>
  );

  const renderAccounts = (platform, accountsList, googleAccName) => {
    return accountsList.map((account, idx) => (
      <div key={`acc_${idx} `}>
        {platform === 'googleads' && googleAccName && (
          <>
            <h2 className={`${styles['groove_acc_name']}`}>{googleAccName}</h2>
            <hr className={`${styles['groove_hr']}`} />
          </>
        )
        }
        <div className="row">
          <div className="col col-sm-12">
            <h4 className={`d-inline-block align-baseline ${styles['groove_user_email']}`}>{accounts.user.platformUserId}</h4>
          </div>
        </div>
        {account?.associated_accounts?.length == 0 && NoAccounts}
        {account?.associated_accounts?.length > 0 &&
          <div style={{ marginTop: '10px' }} className="row">
            <div className="col col-sm-12">
              <ul style={{ paddingLeft: '1rem !important' }}>
                {account.associated_accounts.map((associated_account, aaidx) => (
                  associated_account.status === "Ok" &&
                  <li className={`${styles['groove_li_text']}`} key={`assoc_acc_${aaidx}_${associated_account.id ? associated_account.id : ''} `}>{associated_account.name}</li>
                ))}
              </ul>
            </div>
          </div>
        }
      </div>
    ));
  }

  const handleClick = (platform) => {
    setVisible(!visible);
  }

  return (
    <div className={`col col-sm-8 bg-white shadow rounded ${styles['groove_platform_container']}`}>

      <div className="row mt-2">
        <div className="col col-sm-12">
          <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platform.toLowerCase()}-groove.png`}
            className={`d-inline-block align-baseline publisher-icon me-2 ${styles['groove_publisher_icon']}`} alt={`${platform}`} />
         
          <h2 className={`d-inline-block align-baseline ${styles['groove_platform_heading']}`}>{t(`site_titles.${platform === 'googleads' ? "google" : platform}`)}</h2>
          <span className="d-inline-block align-baseline px-1" style={{ marginTop: '12px', float: 'left' }}>{platformMessage}</span>
          <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${visible ? 'expand-less' : 'expand-more'}.png`}
            className={`d-inline-block align-baseline publisher-icon me-2 ${styles['groove_publisher_icon']} ${styles['groove_publisher_expand_icon']}`}
            alt={`${platform}`}
            onClick={() => handleClick(platform)}
          />
        </div>
      </div>

      {visible && renderAccounts(platform, accounts.accounts, 'Ads')}
      {visible && platform === 'googleads' && renderAccounts(platform, googleDV360Accounts.accounts, 'DV360')}
      {visible && platform === 'googleads' && renderAccounts(platform, googleSA360Accounts.accounts, 'SA360')}
      {visible &&
        <div className="row my-2">
          <div style={{ marginBottom: '27px' }} className="d-md-flex justify-content-md-end">
            <CustomButton className={`btn-light ${styles['groove_diassociate_button']}`} onClick={onDisassociateAccount}>{t('site_titles.disassociate')}</CustomButton>
            <CustomButton className={`btn-primary text-white me-md-1 ${styles['groove_associate_button']}`} onClick={onAssociateAccount}>{t('site_titles.associate')}</CustomButton>
          </div>
        </div>
      }
    </div>
  )
};

export default PlatformSection;
