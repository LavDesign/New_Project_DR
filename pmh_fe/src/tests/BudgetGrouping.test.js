import { React } from 'react';
import { render, screen } from '@testing-library/react';
import BudgetGrouping from 'views/MediaConsole/BudgetGrouping/BudgetGrouping';
import { renderWithProviders } from '_testhelpers/provider-helper';

describe('BudgetGrouping Component', () => {

  test('check if title is present', () => {
    // renderWithProviders(<BudgetGrouping/>)
    // expect(screen.getByText(/site_titles.budget_grouping/i)).toBeInTheDocument();
  });

  test('check if add button is present', () => {
    // renderWithProviders(<BudgetGrouping/>)
    // expect(screen.getByText(/button_text.add_budget_group/i)).toBeInTheDocument();
  });

  test('displays loading spinner initially', async () => {
    // renderWithProviders(<BudgetGrouping/>)
    // expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

});
