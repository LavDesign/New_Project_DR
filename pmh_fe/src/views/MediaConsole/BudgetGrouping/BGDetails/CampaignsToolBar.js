import React from 'react';
import styles from '../../../../_theme/modules/campaingDash/CampaignDashToolbar.module.css';
import CommonToolBar from 'views/MediaConsole/Common/CommonToolBar/CommonToolBar';
import ExportTableComponent from '../../../shared/ExportTableComponent';

import CustomButton from '../../../UI/CustomButton';
const searchCriteriaList = [
  {
    label: 'Campaign ID',
    value: 'campaignKey',
  },
  {
    label: 'Campaign',
    value: 'campaignName',
  },
  {
    label: 'Account',
    value: 'accountName',
  },
  {
    label: 'Account Id',
    value: 'accountKey',
  },
  {
    label: 'Plaform',
    value: 'platformName',
  },
  {
    label: 'Clear Filter',
    value: 'noValue',
  },
];
const CampaignsToolBar = ({
  campaignData,
  filteredCampaigns,
  headerGroups,
}) => {
  const exportTableBtn = () => {
    return (
      <CustomButton
        className={`${styles['groove_export_button_blue']}`}
        style={{ marginTop: '0px' }}
      >
        <ExportTableComponent
          headerGroups={headerGroups}
          tableData={campaignData}
          fileName={'Budget_Group_Campaigns'}
        />
      </CustomButton>
    );
  };

  const searchFunction = (searchRecords, searchText, criteriaValue) => {
    if (criteriaValue) {
      return searchRecords
        .map((data) => {
          const isItemMatch = data[criteriaValue]
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchText);

          if (isItemMatch) return data;
          else return null;
        })
        .filter((item) => item !== null);
    }

    return searchRecords
      .map((data) => {
        const isItemMatch = Object.values(data).some((value) =>
          value?.toString()?.toLowerCase()?.includes(searchText)
        );

        if (isItemMatch) return data;
        else return null;
      })
      .filter((item) => item !== null);
  };
  return (
    <div style={{ width: '100%' }}>
      <CommonToolBar
        searchCriteriaList={searchCriteriaList}
        searchRecords={campaignData}
        displayfilteredRecords={filteredCampaigns}
        searchFunction={searchFunction}
        displayComponents={<>{exportTableBtn()}</>}
      />
    </div>
  );
};

export default CampaignsToolBar;
