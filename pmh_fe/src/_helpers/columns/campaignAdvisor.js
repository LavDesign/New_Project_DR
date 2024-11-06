import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './campaignAdvisorHeaderNames';
import TooltipTexts from './campaignAdvisorHeaderTooltipTexts';

export const allColumnslist = [
  [
    HeaderNames.BUDGET_GROUP,
    HeaderNames.CAMPAIGN_NAME,
    HeaderNames.RECORD_ID,
    HeaderNames.BUDGET_SPEND,
    HeaderNames.CHANGE_IN_SPEND,
    HeaderNames.KPI_NAME,
    HeaderNames.CAMPAIGN_KPI,
    HeaderNames.CHANGE_IN_KPI,
    HeaderNames.CPM,
  ],
];
export const allColumns = [
  [
    {
      header: HeaderNames.BUDGET_GROUP,
      accessorKey: 'groupName',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.BUDGET_GROUP,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CAMPAIGN_NAME,
      accessorKey: 'campaign_name',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.CAMPAIGN_NAME,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.RECORD_ID,
      accessorKey: 'recordId',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.RECORD_ID,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.BUDGET_SPEND,
      accessorKey: 'budgetSpend',
      cell: (value) => CellFormatters.numberToCurrency(value),
      tooltipText: TooltipTexts.BUDGET_SPEND,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CHANGE_IN_SPEND,
      accessorKey: 'changeInSpend',
      cell: (value) => CellFormatters.convertToPercentage(value),
      tooltipText: TooltipTexts.CHANGE_IN_SPEND,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.KPI_NAME, // for export
      accessorKey: 'kpiName',
      cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
      tooltipText: '',
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CAMPAIGN_KPI,
      accessorKey: 'campaignKpi',
      cell: (value) => CellFormatters.kpiUnits(value),
      tooltipText: TooltipTexts.CAMPAIGN_KPI,
      canSortBy: true,
      filterFn: 'fuzzy',
    },

    {
      header: HeaderNames.CHANGE_IN_KPI,
      accessorKey: 'changeInKpi',
      cell: (value) => CellFormatters.convertToPercentage(value),
      tooltipText: TooltipTexts.CHANGE_IN_KPI,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CPM,
      accessorKey: 'cpm',
      cell: (value) => CellFormatters.numberToCurrency(value),
      tooltipText: TooltipTexts.CPM,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
      cellBackgroundColor: () => '#d9f6d7',
    },
  ],
];

export const allColumnsByName = allColumns.map((columns) =>
  _.indexBy(columns, 'header')
);
