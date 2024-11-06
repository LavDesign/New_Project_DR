import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './adSetDashHeaderNames';
import TooltipTexts from './adSetDashHeaderTooltipTexts';

/*
  align needs to be added for all columns to align the text as per type.
  All number, percentage and money columns should be right aligned.
  All text columns (including dates) should be centered aligned.
*/

export const allColumns = [
  [
    {
      header: HeaderNames.AD_SET_NAME,
      accessorKey: 'ad_set_name', // add accessorFn in case it's a function
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => value,
      tooltipText: TooltipTexts.AD_SET_NAME,
      width: 450,
      canSortBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'left', // Exception case
      tabName: 'adset',
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
      tabName: 'adset',
      editor: "demoEditor"
    },
    {
      header: HeaderNames.AD_SET_ID,
      accessorKey: 'ad_set_key',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
      tooltipText: TooltipTexts.AD_SET_ID,
      canGroupBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'right',
      tabName: 'adset',
    },
    {
      header: HeaderNames.CAMPAIGN_NAME,
      accessorKey: 'campaign_name', // add accessorFn in case it's a function
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => value,
      tooltipText: TooltipTexts.CAMPAIGN_NAME,
      width: 450,
      canSortBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'left', // Exception case
      tabName: 'adset'
    },

    {
      header: HeaderNames.CAMPAIGN_ID,
      accessorKey: 'campaign_key',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
      tooltipText: TooltipTexts.CAMPAIGN_ID,
      canGroupBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'right',
      tabName: 'adset',
    },
    {
      header: HeaderNames.PUBLISHER,
      accessorKey: 'publisher',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.publisherOrMixedAggregateFunction(
          columnId,
          getChildRows
        ),
      aggregatedCell: (value) => value,
      cell: (value) =>
        value && value.error ? '' : CellFormatters.publisherIcon(value),
      tooltipText: TooltipTexts.PUBLISHER,
      canGroupBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'left', // Exception case
      tabName: 'adset',
      editor: "demoEditor"
    },
    {
      header: HeaderNames.STATS_LAST_UPDATED,
      accessorKey: 'stats_last_updated',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.statsDateCellAggregateFn(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.statsDateCellRender(value),
      tooltipText: TooltipTexts.STATS_LAST_UPDATED,
      canGroupBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'center',
      tabName: 'adset',
    },
    {
      header: HeaderNames.AD_SET_CAMPAIGN_PACING,
      accessorKey: 'ad_set_campaign_pacing',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.numberToCurrency(value),
      tooltipText: TooltipTexts.AD_SET_CAMPAIGN_PACING,
      canGroupBy: true,
      columnGroup: 'inputs',
      filterFn: 'fuzzy',
      align: 'right',
      tabName: 'adset',
    },

    {
      header: HeaderNames.AD_SET_CAMPAIGN_GROUP,
      accessorKey: 'ad_set_campaign_group',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value, groupedNullEmpty) => CellFormatters.defaultTypeOrMicroCurrency(value, groupedNullEmpty),
      tooltipText: TooltipTexts.AD_SET_CAMPAIGN_GROUP,
      canGroupBy: true,
      columnGroup: 'budget_pacing_metrics',
      filterFn: 'fuzzy',
      align: 'center',
      tabName: 'adset',
      editor: "demoEditor"
    },
    {
      header: HeaderNames.STATUS,
      accessorKey: 'ad_set_status',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.stringOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.showValueOrEmpty(value),
      tooltipText: TooltipTexts.STATUS,
      canGroupBy: true,
      columnGroup: 'platform',
      filterFn: 'fuzzy',
      align: 'center',
      tabName: 'adset',
    },

    {
      header: HeaderNames.BUDGET_RECOMMENDATION,
      accessorKey: 'ad_set_budget_recommendation',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (value) => CellFormatters.budgetRecommendationCell(value),
      tooltipText: TooltipTexts.BUDGET_RECOMMENDATION,
      canGroupBy: false,
      columnGroup: 'budget_pacing_metrics',
      filterFn: 'fuzzy',
      align: 'right',
      tabName: 'adset',
      editor: 'demoNumberEditor'
    },

    {
      header: HeaderNames.PLATFORM_AD_SET_BUDGET,
      accessorKey: 'platform_ad_set_budget',
      aggregationFn: (columnId, getChildRows) =>
        CellFormatters.numberOrMixedAggregateFunction(columnId, getChildRows),
      aggregatedCell: (value) => value,
      cell: (cell) => CellFormatters.numberToCurrencyOrString(cell),
      tooltipText: TooltipTexts.PLATFORM_AD_SET_BUDGET,
      canGroupBy: true,
      columnGroup: 'inputs',
      filterFn: 'fuzzy',
      colIdentifier: 'platform_budget',
      align: 'right',
      tabName: 'adset',
    }
  ],
];

export const allColumnsByName = allColumns.map((columns) =>
  _.indexBy(columns, 'header')
);
