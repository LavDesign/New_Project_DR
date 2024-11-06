import * as _ from 'underscore';
import * as CellFormatters from './cellFormatters';
import HeaderNames from './budgetRecommendationHeaderNames';
import TooltipTexts from './budgetRecommendationHeaderTooltipTexts';

export const allColumnslist = [
  [
    HeaderNames.BUDGET_GROUP,
    HeaderNames.BUDGET_SPEND,
    HeaderNames.KPI,
    HeaderNames.KPI_VALUE,
    HeaderNames.REALIZED_LIFT,
    HeaderNames.PROJECTED_LIFT,
  ],
];
export const allColumns = [
  [
    {
      header: HeaderNames.BUDGET_GROUP,
      accessorKey: 'groupName',
      cell: (value) => CellFormatters.showToolTipWithValue(value),
      tooltipText: TooltipTexts.BUDGET_GROUP,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.BUDGET_SPEND,
      accessorKey: 'budgetSpend',
      cell: (value) => CellFormatters.numberToCurrency(value),
      tooltipText: TooltipTexts.BUDGET_SPEND,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.KPI,
      accessorKey: 'kpi',
      cell: (value) => CellFormatters.defaultTypeOrMicroCurrency(value),
      tooltipText: TooltipTexts.KPI,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.KPI_VALUE,
      accessorKey: 'kpiValue',
      cell: (value) => CellFormatters.kpiUnits(value),
      tooltipText: TooltipTexts.KPI_VALUE,
      canSortBy: true,
      filterFn: 'fuzzy',
    },
    {
      header: HeaderNames.REALIZED_LIFT,
      accessorKey: 'realizedLift',
      cell: (value) => CellFormatters.convertToPercentage(value),
      tooltipText: TooltipTexts.REALIZED_LIFT,
      canSortBy: true,
      filterFn: 'fuzzy',
    },

    {
      header: HeaderNames.PROJECTED_LIFT,
      accessorKey: 'projectedLift',
      cell: (value) => CellFormatters.convertToPercentage(value),
      tooltipText: TooltipTexts.PROJECTED_LIFT,
      canSortBy: true,
      filterFn: 'fuzzy',
      cellBackgroundColor: () => '#d9f6d7',
    },
  ],
];

export const allColumnsByName = allColumns.map((columns) =>
  _.indexBy(columns, 'header')
);
