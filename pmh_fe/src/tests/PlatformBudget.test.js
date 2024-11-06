import React from 'react';
import { renderComponent } from '_testhelpers/test-utils';
import ReactDOM from "react-dom";

import PlatformBudget from 'views/shared/PlatformBudget';
import { getPlatformBudgetRes } from '_testhelpers/mockReponse';

// Mock the createPortal method from react-dom
ReactDOM.createPortal = (element, _target) => {
  return element; // Mocked implementation of createPortal, just returns the element
};

const platformBudgetComponent = (
  <PlatformBudget
    platformBudgetData={getPlatformBudgetRes.json}
    onModelClose={() => {}}
    modalOpen={getPlatformBudgetRes.modalOpen}
    saveData={() => {}}
    budgetEditor={getPlatformBudgetRes.budgetEditor}
  />
);

const errorMsg = {
  message: 'There is an issue with the request. Please try again.',
};

describe('PlatformBudget Component', () => {
  test('Rendering the PlatformBudget component', () => {
    renderComponent(platformBudgetComponent);
  });

  test('Validate Data in Table', () => {
    const { getByTestId } = renderComponent(platformBudgetComponent);
    const budgetData = getByTestId('platform-segment');
    const tdData = budgetData.querySelectorAll('td');
    tdData.forEach((element, index) => {
      expect(element.textContent).toBe(getPlatformBudgetRes.rowData[index]);
    });
  });

  test('Validate if loader is display if data is not passed', () => {
    const { getByRole } = renderComponent(
      <PlatformBudget modalOpen={getPlatformBudgetRes.modalOpen} />
    );
    expect(getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('Validate if error message is display if there is any issue', () => {
    const { getByText } = renderComponent(
      <PlatformBudget
        platformBudgetData={errorMsg}
        modalOpen={getPlatformBudgetRes.modalOpen}
      />
    );
    expect(
      getByText(/there is an issue with the request\. please try again\./i)
    ).toBeInTheDocument();
  });
});

