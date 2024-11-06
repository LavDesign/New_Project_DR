// TODO: unit test all functions in this namespace

import * as _ from 'underscore';
import * as Linkedin from './linkedin';
import * as Facebook from './facebook';
import * as CampaignDash from './campaignDash';
import * as AdSetDash from './adSetDash';
import * as BudgetRecommendation from './budgetRecommendation';
import * as CampaignAdvisor from './campaignAdvisor';
import { kpiMetrics, kpiCommonMetrics } from './campaignDash';
import { getPlatformsInfoById } from '../Utils/availablePlatformsInfo';
import { DASHBOARD_TABS } from '_helpers/Utils/dashboardUtil';
import * as BudgetGroups from './budgetGroups'
import * as Campaigns from './campaigns'
import * as BudgetGroupsCampaigns from './budgetGroupsCampaigns'

const platformNamespace = {
  linkedin: Linkedin,
  facebook: Facebook,
  campaignDash: CampaignDash,
  adSetDash: AdSetDash,
  budgetRecommendation: BudgetRecommendation,
  campaignAdvisor: CampaignAdvisor,
  budgetGroups: BudgetGroups,
  campaigns: Campaigns,
  budgetGroupsCampaigns: BudgetGroupsCampaigns,
};

export const platformTabHeaders = {
  linkedin: ['Campaign Groups', 'Campaigns', 'Ads'],
  facebook: ['Campaigns', 'Adsets', 'Ads'],
  campaignDash: ['Campaign'],
  adSetDash: ['Ad Set'],
};

const allPlatformColumnsByName = (platform) => {
  return platformNamespace[platform]?.allColumnsByName;
};

// TODO time this and possibly precompute it here, because there are hundreds of columns per platform?
// "serialized" with legacy options for column selector
export const allColumnsForColumnSelector = (platform) => {
  return platformNamespace[platform]?.allColumns
    .map((columns) => columns.map((col) => Object.assign({}, col))) // copy
    .map((columns) =>
      columns.map((col) => ({
        ...col,
        field: col.header,
        displayName: col.header,
        enabled:
          (platform === DASHBOARD_TABS.CAMPAIGN.name && col.header === 'campaign_name') ||
          col.header === 'ad_set_name'
            ? false
            : _.isUndefined(col.enabled)
            ? true
            : col.enabled,
        majorGroup: col.columnGroup,
        minorGroup: '',
      }))
    )
    .map((columns) => _.indexBy(columns, 'header'));
};

export const processSelectedColumns = (selectedColumns, platform) => {
  return selectedColumns && selectedColumns.length > 0
    ? selectedColumns[0].map(
        (colname) => allPlatformColumnsByName(platform)[0][colname]
      )
    : [];
};

export const columnGroupNames = (platform) => {
  let allGroupNames = [].concat.apply(
    [],
    platformNamespace[platform]?.allColumns?.map((columns) => {
      let groupNames = columns.map((col) => col.columnGroup);
      return groupNames.filter(
        (groupName, i) => groupNames.indexOf(groupName) === i
      );
    })
  );

  return allGroupNames.filter(
    (groupName, i) => allGroupNames.indexOf(groupName) === i
  );
};

export const columnSubGroupNames = (platform, group) => {
  let allSubGroupNames = [].concat.apply(
    [],
    platformNamespace[platform]?.allColumns?.map((columns) => {
      let subGroupNames = columns.map((col) => {
        if (col.columnGroup === group) return col.columnSubGroup;
      });
      return [...new Set(subGroupNames.filter((item) => item !== undefined))];
    })
  );
  return [...new Set(allSubGroupNames)];
};

export const getKpiMetric = (platform) => {
  const platformInfo = getPlatformsInfoById(platform);
  const kpiOptions = {
    ...kpiMetrics[platformInfo.platform.toUpperCase()],
    ...kpiCommonMetrics,
  };
  const removeOpt = { remove_kpi: 'Remove KPI' };
  const finalOptions = { ...removeOpt, ...kpiOptions };

  return finalOptions;
};
