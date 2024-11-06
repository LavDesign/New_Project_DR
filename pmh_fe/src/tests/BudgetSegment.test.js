import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  customRenderComponent,
  renderComponent,
} from '_testhelpers/test-utils';

import BudgetSegment, {
  BudgetSegmentContainer,
  getEndDate,
  numberToCurrencyFormat,
  totalBudget,
  totalSpend,
  validateBudgetAmount,
} from 'views/shared/BudgetSegment';
import { budgetSegmentData, pacingBudgetData } from '_testhelpers/mockReponse';

const budgetSegmentContainer = (
  <BudgetSegmentContainer data={budgetSegmentData.data} />
);

describe('BudgetSegment Component', () => {
  test('Rendering the BudgetSegment component', () => {
    customRenderComponent(
      <BudgetSegment
        selectedCampaign={budgetSegmentData.selectedCampaign}
        data={budgetSegmentData.data}
        modalOpen={budgetSegmentData.modalOpen}
      />
    );
  });

  test('To show maximum 2 decimals', () => {
    const value = numberToCurrencyFormat(50.1);
    expect(value).toBe('50.10');
  });

  test('To show 2nd digit less than 5 on basis of decimal', () => {
    const lessThan5 = numberToCurrencyFormat(50.342);
    expect(lessThan5).toBe('50.34');
  });

  test('To show 2nd digit more than 5 on basis of decimal', () => {
    const moreThan5 = numberToCurrencyFormat(50.347);
    expect(moreThan5).toBe('50.35');
  });

  test('Accept Numbers Only', () => {
    const value = validateBudgetAmount('25');
    expect(value).toBe('25');
  });
  test('Ignore other digits in value if its not a number digit', () => {
    const value = validateBudgetAmount('25a');
    expect(value).toBe('25');
  });

  test('Ignore the values if its not a number with character as input', () => {
    const value = validateBudgetAmount('a');
    expect(value).toBe('');
  });

  test('Rendering the BudgetSegmentContainer component', () => {
    renderComponent(budgetSegmentContainer);
  });

  test('Validate Data in Table', () => {
    const { getByTestId } = renderComponent(budgetSegmentContainer);
    const budgetData = getByTestId('budget-segment');
    const tdData = budgetData.querySelectorAll('td');
    tdData.forEach((element, index) => {
      expect(element.textContent).toBe(budgetSegmentData.rowData[index]);
    });
  });

  test('Check whether the Close button is present in table', () => {
    const { getByTestId } = renderComponent(budgetSegmentContainer);

    expect(getByTestId('CloseIcon')).toBeInTheDocument();
  });

  test('Check Cancel button is clicked', () => {
      const mokcFunctions = {
          handleRemoveRow: () => {},
    };
    const handleRemoveRow = vi.spyOn(mokcFunctions, "handleRemoveRow");

    const { getByTestId } = renderComponent(
      <BudgetSegmentContainer
        data={budgetSegmentData.data}
        handleRemoveRow={handleRemoveRow}
      />
    );

    fireEvent.click(getByTestId('CloseIcon'));
    expect(handleRemoveRow).toHaveBeenCalledTimes(1);
  });
  test('Check whether the Add Segment button is present and is clicked', () => {
    const handleAddSegment = vi.fn();
    const { getByTestId } = renderComponent(
      <BudgetSegmentContainer
        data={budgetSegmentData.data}
        handleAddSegment={handleAddSegment}
      />
    );
    expect(getByTestId('budget-segment-add-segment')).toBeInTheDocument();
    fireEvent.click(getByTestId('budget-segment-add-segment'));
    expect(handleAddSegment).toHaveBeenCalledTimes(1);
  });
  test('Validate getEndDate function', () => {
    const value = getEndDate(pacingBudgetData);
    expect(value).toBe('Jul-25-2023');
  });

  test('Validate totalBudget function', () => {
    const value = totalBudget(pacingBudgetData);
    expect(value).toBe('600.00');
  });

  test('Validate totalSpend function', () => {
    const value = totalSpend(pacingBudgetData);
    expect(value).toBe('230.20');
  });
});
