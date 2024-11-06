import _ from "underscore";

export const currencyColumn = [
  'current_segment_spend',
  'yesterday_spend',
  'today_spend',
  'pacing_budget_current_segment',
  'kpi1_average_unit_cost_current_segment',
  'kpi2_average_unit_cost_current_segment',
  'kpi3_average_unit_cost_current_segment',
  'average_daily_goal_spend_current_segment',
  'average_daily_spend_current_segment',
  'target_daily_spend_current_segment',
  'budget_recommendation',
  'platform_campaign_budget',
  'platform_ad_set_budget',
  'ad_set_campaign_pacing',
  'ad_set_budget_recommendation',
  'budgetSpend',
  'cpm'
];

export const DASHBOARD_TABS = {
  CAMPAIGN: {
    id: 0,
    name: 'campaignDash',
  },
  AD_SET: {
    id: 1,
    name: 'adSetDash',
  },
};

export const getTabName = (selectedDashboardTab) => {
  switch (selectedDashboardTab) {
    case 'campaignDash':
      return 'campaign';
    case 'adSetDash':
      return 'adset';
  }
};

export const getDashData = (tab) => {
  switch (tab) {
    case 'campaign':
    case 0:
      return DASHBOARD_TABS.CAMPAIGN;
    case 'adset':
    case 1:
      return DASHBOARD_TABS.AD_SET;
  }
};

export const PUBLICURL = import.meta.env.VITE_PUBLIC_URL === '/' ? '' : import.meta.env.VITE_PUBLIC_URL;

export const updateValueOrEmpty = (value) =>
    _.isUndefined(value) || _.isNull(value) || value === "" ? "" : value;

export const checkFreeTextColumnPivot = [
    "free_text_group",
    "free_text_launch_doc_url",
    "free_text_notes_1",
    "free_text_notes_2",
    "free_text_notes_3",
    "free_text_pacing",
    "free_text_reporting",
    "ad_set_campaign_group",
];

export const checkColumnToModify = [
    ...checkFreeTextColumnPivot,
    "kpi1",
    "kpi2",
    "kpi3",
];

export const SHOW_SPINNER = "spinner";
