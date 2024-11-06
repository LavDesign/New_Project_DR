import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import {
  renderComponent,
} from '_testhelpers/test-utils';
import ReactDOM from "react-dom";

import KPIOptions  from 'views/campaignDash/KpiOptions';

// Mock the createPortal method from react-dom
ReactDOM.createPortal = (element, _target) => {
  return element; // Mocked implementation of createPortal, just returns the element
};

export const kpiStandardMetrics = {
  formHeight: '450px',
  selectOption: 'impressions',
  params:{cell: {column: {id: "kpi1"}}}
}
const kpiData = [
  {label: 'Remove KPI', value: 'remove_kpi'},
  {label: 'Impressions', value: 'impressions'},
  {label: 'Video Views', value: 'video_view'},
  {label: 'Page Likes', value: 'page_like'},
  {label: 'Post Engagement', value: 'post_engagement'},
  {label: 'Mobile App Installs', value: 'mobile_app_install'},
  {label: 'Reach', value: 'reach'},
  {label: 'Link Clicks', value: 'link_click'},
  {label: 'Custom Formula', value: 'custom_formula'}
]
const componentToTest = (
  <KPIOptions
      openModal={() => {}}
      setOpenModal={() => {}}
      formHeight={kpiStandardMetrics.formHeight}
      data={kpiData}
      selectOption={() => kpiStandardMetrics.selectOption}
      params={kpiStandardMetrics.params}
      handleSave={() => {}}
      setModalOpen={() => {}}
  />
)


describe('KpiOptions Component - Standard KPI', () => {
  test('Rendering the KpiOptions component', () => {
    renderComponent(
      componentToTest
    );
  });

  test('Check whether the "Impressions" option is present', () => {
      const { getByText } = renderComponent(componentToTest);

      expect(getByText(/impressions/i)).toBeInTheDocument();
  });

  test('Check if api was called with correct data', () => {
    const kpiSelect = vi.fn();
    const { getByTestId } = render(
        <KPIOptions
            handleSave={kpiSelect}
            openModal={() => {}}
            setOpenModal={() => {}}
            formHeight={kpiStandardMetrics.formHeight}
            data={kpiData}
            selectOption={() => kpiStandardMetrics.selectOption}
            params={kpiStandardMetrics.params}
            setModalOpen={() => {}}
        />
    );

    fireEvent.click(getByTestId('kpiOptions_1'));
    expect(kpiSelect).toHaveBeenCalledTimes(1);

  });

  test('Check if Custom Formula is selected, the save function is not called', () => {
    const kpiSelect = vi.fn()
    const { getByTestId } = render(
        <KPIOptions
            handleSave={kpiSelect}
            openModal={() => {}}
            setOpenModal={() => {}}
            formHeight={kpiStandardMetrics.formHeight}
            data={kpiData}
            selectOption={() => kpiStandardMetrics.selectOption}
            params={kpiStandardMetrics.params}
            setModalOpen={() => {}}
        />
    );

    fireEvent.click(getByTestId('kpiOptions_8'));
    expect(kpiSelect).toHaveBeenCalledTimes(0);

  });
});
