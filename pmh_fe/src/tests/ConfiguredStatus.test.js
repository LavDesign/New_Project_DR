import React from 'react';
import { customRenderComponentWithRedux } from '_testhelpers/test-utils';
import ConfiguredStatus from 'views/campaignDash/ConfiguredStatus';
import {
  mockConfigureStatusActiveData,
  mockConfigureStatusPausedData,
} from '_testhelpers/mockReponse';

describe('ConfiguredStatus Component', () => {
  test('Rendering the ConfiguredStatus component', () => {
    customRenderComponentWithRedux(
      <ConfiguredStatus
        rowData={mockConfigureStatusActiveData}
        cellData={'Active'}
      />
    );
  });
  test('Check the toogle on button is present', () => {
    const { getByRole } = customRenderComponentWithRedux(
      <ConfiguredStatus
        rowData={mockConfigureStatusActiveData}
        cellData={'Active'}
      />
    );

    // Check if the toggle image is present
    const toggleImg = getByRole('img');
    expect(toggleImg).toBeInTheDocument();

    // Check if the src attribute matches a regular expression
    const toggleOnPattern = /.*toggle-on.svg/;
    expect(toggleImg).toHaveAttribute(
      'src',
      expect.stringMatching(toggleOnPattern)
    );
  });

  test('Check the toogle off button is present', () => {
    const { getByRole } = customRenderComponentWithRedux(
      <ConfiguredStatus
        rowData={mockConfigureStatusPausedData}
        cellData={'Paused'}
      />
    );

    // Check if the toggle image is present
    const toggleImg = getByRole('img');
    expect(toggleImg).toBeInTheDocument();

    // Check if the src attribute matches a regular expression
    const toggleOffPattern = /.*toggle-off.svg/;
    expect(toggleImg).toHaveAttribute(
      'src',
      expect.stringMatching(toggleOffPattern)
    );
  });

  test('Check the disabled toogle off button is present', () => {
    const { getByRole } = customRenderComponentWithRedux(<ConfiguredStatus />);

    // Check if the toggle image is present
    const toggleImg = getByRole('img');

    expect(toggleImg).toBeInTheDocument();

    // Check if the button has the "disabled" class
    expect(toggleImg.getAttribute('class')).toMatch(/toggle-class-disabled/gi)
  });
});
