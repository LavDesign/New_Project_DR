import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './budgetGroupsHeaderNames';
import TooltipTexts from './budgetGroupsHeaderTooltipTexts';
export const allColumnslist = [
  [
    HeaderNames.BUDGET_GROUP,
    HeaderNames.ACTIONS,
    HeaderNames.KPI,
    HeaderNames.CAMPAIGNS,
    HeaderNames.CHANNELS,
    HeaderNames.ACCOUNTS,
    HeaderNames.BUDGET,
    HeaderNames.START_DATE,
    HeaderNames.END_DATE,
    HeaderNames.CLIENT,
    HeaderNames.REGION
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
      header: HeaderNames.ACTIONS,
      accessorKey: 'actions',
      cell: (value) => {},
      tooltipText: TooltipTexts.ACTIONS,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.KPI,
      accessorKey: 'kpi',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.KPI,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CAMPAIGNS,
      accessorKey: 'campaigns',
      cell: (value) => value?.length.toString() || 0,
      tooltipText: TooltipTexts.CAMPAIGNS,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CHANNELS,
      accessorKey: 'allPlatforms',
      cell: (value) => value?.length.toString() || 0,
      tooltipText: TooltipTexts.PLATFORMS,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.ACCOUNTS,
      accessorKey: 'allAccounts',
      cell: (value) => value?.length.toString() || 0,
      tooltipText: TooltipTexts.ACCOUNTS,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.BUDGET,
      accessorKey: 'budgetValue',
      cell: (value) => CellFormatters.numberToCurrency(value),
      // cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.BUDGET,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.START_DATE,
      accessorKey: 'startDate',
      cell: (value) => value.toString(),
      tooltipText: TooltipTexts.START_DATE,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.END_DATE,
      accessorKey: 'endDate',
      cell: (value) => value.toString(),
      tooltipText: TooltipTexts.END_DATE,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CLIENT,
      accessorKey: 'clientName',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.CLIENT,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.REGION,
      accessorKey: 'region',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.REGION,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    
    
  ],
];
export const allColumnsByName = allColumns.map((columns) =>
  _.indexBy(columns, 'header')
);

