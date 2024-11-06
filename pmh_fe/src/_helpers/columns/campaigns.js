import * as _ from 'underscore';
import HeaderNames from './campaignsHeaderNames';
import * as CellFormatters from './cellFormatters'
import TooltipTexts from './campaignsHeaderTooltipText';

export const allColumnslist = [
    [
      HeaderNames.NAME,
      HeaderNames.STATUS,
      HeaderNames.LIFETIME_SPEND,
      HeaderNames.PACING_BUDGET_LIFETIME,
      HeaderNames.PACING_LIFETIME,
      HeaderNames.BUDGET_PROGRESS_LIFETIME,
      HeaderNames.PACING_BUDGET_START_DATE_LIFETIME
    ]
  ];

  export const allColumns = [
    [
      {
        header: HeaderNames.NAME,
        accessorKey: 'name',
        cell: (value, status) => value && value.error ? '' : CellFormatters.campaignNameIcon(value, status),
        tooltipText: TooltipTexts.NAME,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.STATUS,
        accessorKey: 'status',
        cell: (value) => CellFormatters.showToolTipWithValue(value),
        tooltipText: TooltipTexts.STATUS,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.LIFETIME_SPEND,
        accessorKey: 'lifetime_spend',
        cell: (value) => CellFormatters.showToolTipWithValue(value),
        tooltipText: TooltipTexts.LIFETIME_SPEND,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.PACING_BUDGET_LIFETIME,
        accessorKey: 'pacing_budget_lifetime',
        cell: (value) => CellFormatters.convertToPercentage(value),
        tooltipText: TooltipTexts.PACING_BUDGET_LIFETIME,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.PACING_LIFETIME,
        accessorKey: 'pacing_lifetime',
        cell: (value) => CellFormatters.convertToPercentage(value),
        tooltipText: TooltipTexts.PACING_LIFETIME,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.BUDGET_PROGRESS_LIFETIME,
        accessorKey: 'budget_progress_lifetime',
        cell: (value) => CellFormatters.convertToPercentage(value),
        tooltipText: TooltipTexts.BUDGET_PROGRESS_LIFETIME,
        canGroupBy: true,
        canSortBy: true,
        filterFn: 'fuzzy',
      },
      {
        header: HeaderNames.PACING_BUDGET_START_DATE_LIFETIME,
        accessorKey: 'budget_progress_start_date_lifetime',
        cell: (value) => CellFormatters.dateCellRender(value),
        tooltipText: TooltipTexts.PACING_BUDGET_START_DATE_LIFETIME,
        canSortBy: true,
        filterFn: 'fuzzy',
      }
    ],
  ];
  export const allColumnsByName = allColumns.map((columns) =>
    _.indexBy(columns, 'header')
  );