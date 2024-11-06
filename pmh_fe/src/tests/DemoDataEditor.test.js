import React from 'react';
import { fireEvent } from '@testing-library/react';
import CustomModal from 'views/UI/CustomModal';
import { cellDataForDemoValues } from '_testhelpers/mockReponse';
import { renderComponent } from '_testhelpers/test-utils';
import ReactDOM from "react-dom";
import DemoDataEditor from 'views/campaignDash/DemoDataEditor';

// Mock the createPortal method from react-dom
ReactDOM.createPortal = (element, _target) => {
  return element; // Mocked implementation of createPortal, just returns the element
};

const componentToTest = (
  <DemoDataEditor
    openModal={cellDataForDemoValues.openModal}
    title={cellDataForDemoValues.title}
    onSaveText={cellDataForDemoValues.onSaveText}
    onCloseText={cellDataForDemoValues.onCloseText}
    data={cellDataForDemoValues.data}
    getValueToShow={() => {return ""}}
    onAccept={() => {}}
  />
);
describe('DemoEditor Component', () => {
  test('Check whether the textarea is present', () => {
    const { getByTestId } = renderComponent(componentToTest);

    expect(getByTestId('text-area-id')).toBeInTheDocument();
  });

  test('Check whether the textarea for tooltip is present', () => {
    const { getByTestId } = renderComponent(componentToTest);

    expect(getByTestId('text-area-br-id')).toBeInTheDocument();
  });

  test('Check Text Value', () => {
    const { getByTestId } = renderComponent(
      <CustomModal>
        <textarea data-testid='text-area-id' defaultValue={'test'}></textarea>
      </CustomModal>
    );
    const value = getByTestId('text-area-id').innerHTML;
    expect(value).toBe('test');
  });

  test('Check whether the title is present', () => {
    const { getByText } = renderComponent(componentToTest);

    expect(getByText(/Test Title/i)).toBeInTheDocument();
  });

  test('Check whether the Ok button is present', () => {
    const { getByText } = renderComponent(componentToTest);

    expect(getByText(/ok/i)).toBeInTheDocument();
  });

  test('Check Ok button is clicked', () => {
    const onConfirmHandler = vi.fn();
    const { getByText } = renderComponent(
      <CustomModal
        onSaveText={cellDataForDemoValues.onSaveText}
        onAccept={onConfirmHandler}
      />
    );
    fireEvent.click(getByText(/ok/i));
    expect(onConfirmHandler).toHaveBeenCalledTimes(1);
  });

  test('Check whether the Cancel button is present', () => {
    const { getByText } = renderComponent(componentToTest);

    expect(getByText(/cancel/i)).toBeInTheDocument();
  });

  test('Check Cancel button is clicked', () => {
    const handleEditorModalClose = vi.fn();
    const { getByText } = renderComponent(
      <CustomModal
        onCloseText={cellDataForDemoValues.onCloseText}
        onClose={handleEditorModalClose}
      />
    );
    fireEvent.click(getByText(/cancel/i));
    expect(handleEditorModalClose).toHaveBeenCalledTimes(1);
  });

});