import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './budgetGroupsHeaderNames';
import TooltipTexts from './budgetGroupsHeaderTooltipTexts';
export const allColumnslist = [
  [
    HeaderNames.CAMPAIGN,
    HeaderNames.CAMPAIGN_ID,
    HeaderNames.ACCOUNT,
    HeaderNames.ACCOUNT_ID,
    HeaderNames.PLATFORM,
  ],
];


export const allColumns = [
  [
    {
      header: HeaderNames.CAMPAIGN,
      accessorKey: 'campaignName',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.CAMPAIGN,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.CAMPAIGN_ID,
      accessorKey: 'campaignKey',
      cell: (value) => value || 0,
      tooltipText: TooltipTexts.CAMPAIGN_ID,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    
    {
      header: HeaderNames.ACCOUNT,
      accessorKey: 'accountName',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.ACCOUNT,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.ACCOUNT_ID,
      accessorKey: 'accountKey',
      cell: (value) => value || 0,
      tooltipText: TooltipTexts.ACCOUNT_ID,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.PLATFORM,
      accessorKey: 'platformName',
      cell: (value) => CellFormatters.nativeAppUrlLink(value, true),
      tooltipText: TooltipTexts.PLATFORM,
      canGroupBy: true,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    
  ],
];
export const allColumnsByName = allColumns.map((columns) =>
  _.indexBy(columns, 'header')
);


