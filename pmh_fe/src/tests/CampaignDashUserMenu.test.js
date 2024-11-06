import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  customRenderComponent,
  renderComponent,
} from '_testhelpers/test-utils';
import CampaignDashUserMenu from 'views/campaignDash/CampaignDashUserMenu';
import SearchInput from 'views/UI/SearchInput';

const searchComponent = <SearchInput placeholderText={'80 records...'} />;

describe('CampaignDashUserMenu Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<CampaignDashUserMenu />);
  });

  test('SearchInput component rendering', () => {
    customRenderComponent(searchComponent);
  });

  test('Search Icon is present', () => {
    const { getByTestId } = renderComponent(searchComponent);
    expect(getByTestId('SearchIcon')).toBeInTheDocument();
  });

  test('Search Input is present', () => {
    const { getByRole } = renderComponent(searchComponent);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  test('Search Input Placeholder is present', () => {
    const { getByRole } = renderComponent(searchComponent);
    const searchBox = getByRole('textbox');
    expect(searchBox.getAttribute('placeholder')).toBe('80 records...');
  });

  test('Search value is entered', () => {
    const { getByRole } = renderComponent(searchComponent);
    const searchBox = getByRole('textbox');
    expect(searchBox.value).toBe(''); // empty before
    fireEvent.change(searchBox, { target: { value: 'test' } });
    expect(searchBox.value).toBe('test');
  });
});
