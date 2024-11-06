import { SHOW_SPINNER, checkColumnToModify, currencyColumn, updateValueOrEmpty } from '_helpers/Utils/dashboardUtil';
import * as CampaignDash from './campaignDash';

export const fetchDashCampaigns = async (query) => {
  const data = await CampaignDash.fetchDashCampaigns(query);
  if (data?.json?.length) {
    const columns = data.json.map((campaign) => {
      const keyAndIdValue = campaign.columns.length
        ? {
            platform: campaign.columns[0].platform,
            campaign_key: campaign.columns[0].campaignKey,
            campaignId: campaign.columns[0].campaignId,
            budgetRecTooltip: campaign.columns.find(
              (column) =>
                column.campaignDashColumnKey === 'budget_recommendation'
            )?.toolTip,
            currency_code: campaign.columns.filter(
              (column) =>
                currencyColumn.includes(column.campaignDashColumnKey) &&
                column.currencyCode
            )?.[0]?.currencyCode,
            platformCampaignTooltip: campaign.columns.find(
              (column) =>
                column.campaignDashColumnKey === 'platform_campaign_budget'
            )?.toolTip,
          }
        : {};
      
        const maskedValues = campaign.columns.reduce((acc, column) => {
          const map = {
            "account": "accountMaskedValue",
            "campaign_name": "nameMaskedValue",
            "budget_recommendation": ["budgetRecMaskedValue", "budgetRecTooltipMaskedValue"],
            "budget_group": "budgetGroupMaskedValue",
            "kpi1_units_delivered_current_segment": "kpi1UnitsDeliveredMaskedValue",
            "publisher": "publisherMaskedValue"
          };
        
          if (map[column.campaignDashColumnKey]) {
            if (Array.isArray(map[column.campaignDashColumnKey])) {
              acc[map[column.campaignDashColumnKey][0]] = column.maskedValue;
              acc[map[column.campaignDashColumnKey][1]] = column.maskedTooltip;
            } else {
              acc[map[column.campaignDashColumnKey]] = column.maskedValue;
            }
          }
          return acc;
        }, {});        

      return {
        ...campaign.columns.reduce(
          (acc, column) => ({
            ...acc,
          [column.campaignDashColumnKey]: column.isCompleted ? checkColumnToModify.includes(column.campaignDashColumnKey) ? updateValueOrEmpty(column.value) : column.value : SHOW_SPINNER,
          }),
          keyAndIdValue
        ),
        maskedValues 
      };
    });
    return columns;
  } else {
    return [];
  }
};



export const fetchAvailableCampaigns = (query) => {
  return CampaignDash.fetchAvailableCampaigns(query);
};

export const fetchSelectedCampaigns = (query) => {
  return CampaignDash.fetchSelectedCampaigns(query);
};

export const saveSelectedCampaigns = (query) => {
  return CampaignDash.saveSelectedCampaigns(query);
};
