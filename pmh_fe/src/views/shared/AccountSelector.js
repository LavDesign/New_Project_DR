import React from 'react';
import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select'
import { getPlatformsInfoById } from '../../_helpers/Utils/availablePlatformsInfo';
import styles from '../../_theme/modules/campaingDash/CampaignSelectorForm.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const AccountSelector = props => {
  const { t } = useTranslation(['common']);
  const { Option } = components;

  const onChangeHandler = option => {
    props.setSelectedAccount(JSON.parse(option.value));
  };
  const options = props.availableAccounts && props.availableAccounts.map(option => {
    const platformInfo = getPlatformsInfoById(option.platformId);
    const platform = platformInfo.platform.toLowerCase();
    return (
      {
        "platformName": platform,
        "value": JSON.stringify(option),
        "label": option.name,
        "icon": <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${platform}-groove.png`} style={{ width: '18px', height: '18px' }} />
      }
    )
  });

  const selectorStyle = {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.5',
    color: '#212B36'
  };

  const IconOption = props => {
    return (<Option {...props}>
      <img src={`${window.location.origin}${PUBLICURL}/assets/icons/${props.data.platformName.toLowerCase()}-groove.png`} style={{ 'margin-right': '10px', width: '18px', height: '18px' }} />
      <label>{props.data.label}</label>
    </Option>
    )
  };

  return (
    <div style={props.style}>
      <label htmlFor='accountSelector' style={{ fontSize: 'var(--bs-body-font-size)' }}>{t('site_titles.select_account')}</label>
      <div style={selectorStyle}>
        {props.selectedAccount &&
          <Select
            className={`${styles['groove_account_selector']}`}
            id='accountSelector'
            defaultValue={{ value: props.selectedAccount, label: <label>{props.selectedAccount.name + "..."}</label> }}
            onChange={onChangeHandler}
            options={new Array(options)[0]}
            components={{ Option: IconOption }}
          />}
      </div>
    </div>
  );
};

export default AccountSelector;