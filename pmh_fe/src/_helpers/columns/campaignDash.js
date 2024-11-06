import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './campaignDashHeaderNames';
import TooltipTexts from './campaignDashHeaderTooltipTexts';

//All Columns for Campaign Dash 2 need to be defined here
//TODO: this is how we add subgroups, columnSubGroup: 'Campaign',

/*
  align needs to be added for all columns to align the text as per type.
  All number, percentage and money columns should be right aligned.
  All text columns (including dates) should be centered aligned.
*/
export const allColumns = [[
  {
    header: HeaderNames.CAMPAIGN_NAME,
    accessorKey: 'campaign_name',// add accessorFn in case it's a function
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => value,
    tooltipText: TooltipTexts.CAMPAIGN_NAME,
    width: 450,
    canSortBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'left',
    tabName: 'campaign', // Exception case
    editor: "demoEditor"
  },
  {
    header: HeaderNames.ACCOUNT,
    accessorKey: 'account',
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
    tooltipText: TooltipTexts.ACCOUNT,
    canGroupBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'left', // Exception case
    tabName: 'campaign',
    editor: "demoEditor"
  },
  {
    header: HeaderNames.CURRENT_BUDG_SEGM_SPEND,
    accessorKey: 'current_segment_spend',
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => value && value.error ? '' : CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.CURRENT_BUDG_SEGM_SPEND,
    width: 280,
    columnGroup: 'spend',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.YESTERDAY_SPEND,
    accessorKey: 'yesterday_spend',
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => value && value.error ? '' : CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.YESTERDAY_SPEND,
    columnGroup: 'spend',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.TODAY_SPEND,
    accessorKey: 'today_spend',
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => value && value.error ? '' : CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.TODAY_SPEND,
    canGroupBy: true,
    columnGroup: 'spend',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.CAMPAIGN_ID,
    accessorKey: 'campaign_key',
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
    tooltipText: TooltipTexts.CAMPAIGN_ID,
    canGroupBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.PUBLISHER,
    accessorKey: 'publisher',
    aggregationFn: (columnId, getChildRows) => CellFormatters.publisherOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => value && value.error ? '' : CellFormatters.publisherIcon(value),
    tooltipText: TooltipTexts.PUBLISHER,
    canGroupBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'left', // Exception case
    tabName: 'campaign',
    editor: "demoEditor"
  },
  {
    header: HeaderNames.STATS_LAST_UPDATED,
    accessorKey: 'stats_last_updated',
    aggregationFn: (columnId, getChildRows) => CellFormatters.statsDateCellAggregateFn(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.statsDateCellRender(value),
    tooltipText: TooltipTexts.STATS_LAST_UPDATED,
    canGroupBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.PAC_BUDG_CURRT_SEGM,
    accessorKey: 'pacing_budget_current_segment',
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.PAC_BUDG_CURRT_SEGM,
    canGroupBy: true,
    columnGroup: 'inputs',
    filterFn: 'fuzzy',
    colIdentifier: 'pacing_budget',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.PAC_BUDG_END_DATE_CURRT_SEGM,
    accessorKey: "pacing_budget_current_segment_end_date",
    aggregationFn: (columnId, getChildRows) => CellFormatters.dateDiffCellRender(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.dateCellRender(value),
    tooltipText: TooltipTexts.PAC_BUDG_END_DATE_CURRT_SEGM,
    canGroupBy: true,
    columnGroup: 'inputs',
    filterFn: 'fuzzy',
    colIdentifier: 'pacing_budget',
    cellBackgroundColor: (value) => CellFormatters.pacingDateColor(value),
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.PAC_BUDG_START_DATE_CURRT_SEGM,
    accessorKey: "pacing_budget_current_segment_start_date",
    aggregationFn: (columnId, getChildRows) => CellFormatters.dateDiffCellRender(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.dateCellRender(value),
    tooltipText: TooltipTexts.PAC_BUDG_START_DATE_CURRT_SEGM,
    canGroupBy: true,
    columnGroup: 'inputs',
    filterFn: 'fuzzy',
    colIdentifier: 'pacing_budget',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.BUDGET_GROUP,
    accessorKey: "budget_group",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.BUDGET_GROUP,
    canGroupBy: true,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign',
    editor: "demoEditor"
  },
  {
    header: HeaderNames.FREE_TEXT_LAUNCH_DOC_URL,
    accessorKey: "free_text_launch_doc_url",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.urlLink(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_LAUNCH_DOC_URL,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FREE_TEXT_NOTES_1,
    accessorKey: "free_text_notes_1",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_NOTES_1,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FREE_TEXT_NOTES_2,
    accessorKey: "free_text_notes_2",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_NOTES_2,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FREE_TEXT_NOTES_3,
    accessorKey: "free_text_notes_3",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_NOTES_3,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FREE_TEXT_PACING,
    accessorKey: "free_text_pacing",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_NOTES_3,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FREE_TEXT_REPORTING,
    accessorKey: "free_text_reporting",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
    tooltipText: TooltipTexts.FREE_TEXT_REPORTING,
    canGroupBy: true,
    columnGroup: 'inputs',
    editor: "notesEditor",
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI_1,
    accessorKey: "kpi1",
    aggregationFn: (columnId, getChildRows) => CellFormatters.aggregatedKpi(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpi(value),
    tooltipText: TooltipTexts.KPI_1,
    canGroupBy: true,
    columnGroup: 'kpi',
    colIdentifier: 'kpi',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI_2,
    accessorKey: "kpi2",
    aggregationFn: (columnId, getChildRows) => CellFormatters.aggregatedKpi(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpi(value),
    tooltipText: TooltipTexts.KPI_2,
    canGroupBy: true,
    columnGroup: 'kpi',
    colIdentifier: 'kpi',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI_3,
    accessorKey: "kpi3",
    aggregationFn: (columnId, getChildRows) => CellFormatters.aggregatedKpi(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpi(value),
    tooltipText: TooltipTexts.KPI_3,
    canGroupBy: true,
    columnGroup: 'kpi',
    colIdentifier: 'kpi',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI1_UNITS_DELIVERED_CURRENT_SEGMENT,
    accessorKey: "kpi1_units_delivered_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows, true),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpiUnits(value),
    tooltipText: TooltipTexts.KPI1_UNITS_DELIVERED_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign',
    editor: "demoNumberEditor"
  },
  {
    header: HeaderNames.KPI2_UNITS_DELIVERED_CURRENT_SEGMENT,
    accessorKey: "kpi2_units_delivered_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows, true),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpiUnits(value),
    tooltipText: TooltipTexts.KPI2_UNITS_DELIVERED_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI3_UNITS_DELIVERED_CURRENT_SEGMENT,
    accessorKey: "kpi3_units_delivered_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows, true),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.kpiUnits(value),
    tooltipText: TooltipTexts.KPI3_UNITS_DELIVERED_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI1_AVG_UNIT_COST_CURRENT_SEGMENT,
    accessorKey: "kpi1_average_unit_cost_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.KPI1_AVG_UNIT_COST_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI2_AVG_UNIT_COST_CURRENT_SEGMENT,
    accessorKey: "kpi2_average_unit_cost_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.KPI2_AVG_UNIT_COST_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.KPI3_AVG_UNIT_COST_CURRENT_SEGMENT,
    accessorKey: "kpi3_average_unit_cost_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.KPI3_AVG_UNIT_COST_CURRENT_SEGMENT,
    canGroupBy: true,
    columnGroup: 'kpi',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.DAYS_REMAINING,
    accessorKey: "days_remaining",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedVariedType(columnId, getChildRows, 'digit'),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.showValueOrEmpty(value),
    tooltipText: TooltipTexts.DAYS_REMAINING,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.YESTERDAY_SPEND_TARGET_REACHED,
    accessorKey: "yesterday_spend_target_reached",
    aggregationFn: () => "", // currently we don't have calculations hence its empty
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.convertToPercentage(value),
    tooltipText: TooltipTexts.YESTERDAY_SPEND_TARGET_REACHED,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.AVG_GOAL_BILLABLE_CURRENT_SEGMENT,
    accessorKey: "average_daily_goal_spend_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.AVG_GOAL_BILLABLE_CURRENT_SEGMENT,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.AVG_DAILY_BILLABLE_CURRENT_SEGMENT,
    accessorKey: "average_daily_spend_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.AVG_DAILY_BILLABLE_CURRENT_SEGMENT,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.BUDGET_PROGRESS_CURRENT_SEGMENT,
    accessorKey: "budget_progress_current_segment",
    aggregationFn: () => "", // currently we don't have calculations hence its empty
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.convertToPercentage(value),
    tooltipText: TooltipTexts.BUDGET_PROGRESS_CURRENT_SEGMENT,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.FLIGHT_PROGRESS_CURRENT_SEGMENT,
    accessorKey: "flight_progress_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedVariedType(columnId, getChildRows, 'percent'), // this may have to change to singlePercentageValueOrMixedCellRender
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.convertToPercentage(value),
    tooltipText: TooltipTexts.FLIGHT_PROGRESS_CURRENT_SEGMENT,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.PACING_CURRENT_SEGMENT,
    accessorKey: "pacing_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedVariedType(columnId, getChildRows, 'percent'), // this may have to change to singlePercentageValueOrMixedCellRender
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.convertToPercentage(value),
    tooltipText: TooltipTexts.PACING_CURRENT_SEGMENT,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    cellBackgroundColor: (value) => CellFormatters.pacingColor(value),
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.TARGET_DAILY_BILLABLE,
    accessorKey: "target_daily_spend_current_segment",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.numberToCurrency(value),
    tooltipText: TooltipTexts.TARGET_DAILY_BILLABLE,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.STATUS,
    accessorKey: "status",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
    tooltipText: TooltipTexts.STATUS,
    canGroupBy: true,
    columnGroup: 'platform',
    cellBackgroundColor: (value, getChildRows) => CellFormatters.statusColorizer(value, getChildRows),
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.CONFIGURED_STATUS,
    accessorKey: 'platform_native_status',
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.showValueOrEmpty(value),
    tooltipText: TooltipTexts.CONFIGURED_STATUS,
    canGroupBy: true,
    columnGroup: 'platform',
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  /*{
    header: HeaderNames.IS_CHECK_IN_AM,
    accessorKey: "is_check_in_am",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    //cell: ({value}) => CellFormatters.statusFormatter(value, false, false), //currently passing includeIcons, includeTooltip as false, TBD
    cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
    tooltipText: TooltipTexts.STATUS,
    canGroupBy: true,
    columnGroup: 'platform',
    cellBackgroundColor: (value) => CellFormatters.statusColorizer(value),
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },
  {
    header: HeaderNames.IS_CHECK_IN_PM,
    accessorKey: "is_check_in_pm",
    aggregationFn: (columnId, getChildRows) => CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    //cell: ({value}) => CellFormatters.statusFormatter(value, false, false), //currently passing includeIcons, includeTooltip as false, TBD
    cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
    tooltipText: TooltipTexts.STATUS,
    canGroupBy: true,
    columnGroup: 'platform',
    cellBackgroundColor: (value) => CellFormatters.statusColorizer(value),
    filterFn: 'fuzzy',
    align: 'center',
    tabName: 'campaign'
  },*/
  {
    header: HeaderNames.BUDGET_RECOMMENDATION,
    accessorKey: "budget_recommendation",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (value) => CellFormatters.budgetRecommendationCell(value),
    tooltipText: TooltipTexts.BUDGET_RECOMMENDATION,
    canGroupBy: false,
    columnGroup: 'budget_pacing_metrics',
    filterFn: 'fuzzy',
    align: 'right',
    tabName: 'campaign',
    editor: 'demoNumberEditor'
    
  },
  {
    header: HeaderNames.PLATFORM_CAMPAIGN_BUDGET,
    accessorKey: "platform_campaign_budget",
    aggregationFn: (columnId, getChildRows) => CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
    aggregatedCell: (value) => value,
    cell: (cell) => CellFormatters.numberToCurrencyOrString(cell),
    tooltipText: TooltipTexts.PLATFORM_CAMPAIGN_BUDGET,
    canGroupBy: true,
    columnGroup: 'inputs',
    filterFn: 'fuzzy',
    colIdentifier: 'platform_budget',
    align: 'right',
    tabName: 'campaign', 
    editor: "demoNumberEditor"
  }
]];

export const allColumnsByName = allColumns.map(columns => _.indexBy(columns, 'header'));

export const defaultColumns = [[HeaderNames.CAMPAIGN_ID, HeaderNames.CAMPAIGN_NAME, HeaderNames.ACCOUNT, HeaderNames.CURRENT_BUDG_SEGM_SPEND, HeaderNames.YESTERDAY_SPEND]];


export const kpiCommonMetrics = {
  // "roas": "ROAS",
  "custom_formula": "Custom Formula"
}

export const kpiMetrics = {
  'FACEBOOK': {
    "impressions": "Impressions",
    "video_view": "Video Views",
    "page_like": "Page Likes",
    "post_engagement": "Post Engagement",
    "mobile_app_install": "Mobile App Installs",
    "reach": "Reach",
    "link_click": "Link Clicks"
  },
  'PINTEREST': {
    "impressions": "Impressions",
    "video_view": "Video Views",
    "engagements_1_2": "Engagements (1+2)",
    "engagement_legacy": "Engagement (Legacy)",
    "app_install": "App Installs",
    "clickthrough": "Clickthroughs"
  },
  'TWITTER': {
    "impressions": "Impressions",
    "video_total_views": "Video Total Views",
    "follows": "Follows",
    "engagements": "Engagements",
    "url_clicks": "URL Clicks"
  },
  'GOOGLEADS': {
    "impressions": "Impressions",
    "clicks": "Clicks",
    "conversions": "Conversions"
  },
  'GOOGLEDV360': {
    "METRIC_IMPRESSIONS": "Impressions",
    "METRIC_CLICKS": "Clicks",
    // "youTube_views": "YouTube: Views", awaiting confirmaiton on YouTube stats
    "METRIC_RICH_MEDIA_VIDEO_COMPLETIONS": "Complete Views (Video)",
    "METRIC_ACTIVE_VIEW_AUDIBLE_VISIBLE_ON_COMPLETE_IMPRESSIONS": "Active View: Impressions Audible and Visible at Completion"
  },
  'GOOGLESA360': {
    "impressions": "Impressions",
    "clicks": "Clicks",
    "conversions": "Conversions"
  },
  'SNAPCHAT': {
    "impressions_paid": "Impressions (Paid)",
    "impressions_earned": "Impressions (Earned)",
    "video_views": "Video Views",
    "engagements": "Engagements",
    "mobile_app_installs": "Mobile App Installs",
    "reach": "Reach",
    "swipes": "Swipes"
  },
  'LINKEDIN': {
    "impressions": "Impressions",
    "videoViews": "Video Views",
    "totalEngagements": "Total Engagements",
    "clicks": "Clicks"
  },
  'AMAZON_DSP': {
    "impressions": "Impressions",
    "clickthroughs": "Clickthroughs",
    "purchases": "Purchases",
    "video_completions": "Video Completions",
    "video_starts": "Video Starts"
  },
  'AMAZON_SPA': {}
}
