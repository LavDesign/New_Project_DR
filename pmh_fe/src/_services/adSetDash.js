import { checkColumnToModify, currencyColumn, updateValueOrEmpty } from '_helpers/Utils/dashboardUtil';
import { baseURL, request } from '_helpers/baseApi';

const getAdSetsApi = async (params) => {
  const body = await request({
    url: `${baseURL}/adset/getadsetcolumnsinfo`,
    method: 'POST',
    body: JSON.stringify(params),
    signal: params.signal,
  });
  return body;
};

export const fetchAdSets = async (query) => {
  const data = await getAdSetsApi(query);
  const { statusCode, json } = data;
  if (statusCode !== undefined) {
    if (json?.length) {
      const columns = data.json.map((adSet) => {
        const keyAndIdValue = adSet.columns.length
          ? {
              platform: adSet.columns[0].platform,
              campaign_key: adSet.columns[0].campaignKey,
              ad_set_key: adSet.columns[0].adSetKey,
              campaignId: adSet.columns[0].campaignId,
              budgetRecTooltip: adSet.columns.find(
                (column) =>
                  column.adSetDashColumnKey === 'ad_set_budget_recommendation'
              )?.toolTip,
              currency_code: adSet.columns.filter(
                (column) =>
                  currencyColumn.includes(column.adSetDashColumnKey) &&
                  column.currencyCode
              )?.[0]?.currencyCode,
              platformAdSetTooltip: adSet.columns.find(
                (column) =>
                  column.adSetDashColumnKey === 'platform_ad_set_budget'
              )?.toolTip,
            }
          : {};
        
          const maskedValues = adSet.columns.reduce((acc, column) => {
            const map = {
              "account": "accountMaskedValue",
              "ad_set_name": "nameMaskedValue",
              "ad_set_budget_recommendation": ["budgetRecMaskedValue", "budgetRecTooltipMaskedValue"],
              "ad_set_campaign_group": "budgetGroupMaskedValue",
              "publisher": "publisherMaskedValue",
            };
          
            if (map[column.adSetDashColumnKey]) {
              if (Array.isArray(map[column.adSetDashColumnKey])) {
                acc[map[column.adSetDashColumnKey][0]] = column.maskedValue;
                acc[map[column.adSetDashColumnKey][1]] = column.maskedTooltip;
              } else {
                acc[map[column.adSetDashColumnKey]] = column.maskedValue;
              }
            }
          
            return acc;
          }, {});          

        return {
          ...adSet.columns.reduce(
            (acc, column) => ({
              ...acc,
            [column.adSetDashColumnKey]: checkColumnToModify.includes(column.adSetDashColumnKey) ? updateValueOrEmpty(column.value) : column.value,
            }),
            keyAndIdValue
          ),
          maskedValues 
        };
      });
      return columns;
    }
    return [];
  }
  return 'error';
};
