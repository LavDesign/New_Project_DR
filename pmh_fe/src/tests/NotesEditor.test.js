import React from 'react';
import { fireEvent } from '@testing-library/react';
import NotesEditor from 'views/campaignDash/NotesEditor';
import CustomModal from 'views/UI/CustomModal';
import { cellData } from '_testhelpers/mockReponse';
import { customRenderComponentWithRedux } from '_testhelpers/test-utils';
import ReactDOM from 'react-dom';
import campaignReducer from 'common/Redux/Reducers/campaignReducer';

// Mock the createPortal method from react-dom
ReactDOM.createPortal = (element, _target) => {
  return element; // Mocked implementation of createPortal, just returns the element
};

const componentToTest = (
  <NotesEditor
    openModal={cellData.openModal}
    title={cellData.title}
    onSaveText={cellData.onSaveText}
    onCloseText={cellData.onCloseText}
    data={cellData}
    onAccept={() => {}}
  />
);

const storeData = {
  reducer: { getCampaignData: campaignReducer },
  initialState: {
    getCampaignData: {
      bulkWarningModel: false,
    },
  },
};
describe('NotesEditor Component', () => {
  test('Check whether the textarea is present', () => {
    const { getByTestId } = customRenderComponentWithRedux(
      componentToTest,
      storeData
    );
    expect(getByTestId('notes-text-area-id')).toBeInTheDocument();
  });

  test('Check Text Value', () => {
    const { getByTestId } = customRenderComponentWithRedux(
      <CustomModal>
        <textarea data-testid='text-area-id' defaultValue={'test'}></textarea>
      </CustomModal>,
      storeData
    );
    const value = getByTestId('text-area-id').innerHTML;
    expect(value).toBe('test');
  });

  test('Check whether the title is present', () => {
    const { getByText } = customRenderComponentWithRedux(
      componentToTest,
      storeData
    );
    expect(getByText(/Test Title/i)).toBeInTheDocument();
  });

  test('Check whether the Ok button is present', () => {
    const { getByText } = customRenderComponentWithRedux(
      componentToTest,
      storeData
    );

    expect(getByText(/ok/i)).toBeInTheDocument();
  });

  test('Check Ok button is clicked', () => {
    const onConfirmHandler = vi.fn();
    const { getByText } = customRenderComponentWithRedux(
      <CustomModal
        onSaveText={cellData.onSaveText}
        onAccept={onConfirmHandler}
      />,
      storeData
    );
    fireEvent.click(getByText(/ok/i));
    expect(onConfirmHandler).toHaveBeenCalledTimes(1);
  });

  test('Check whether the Cancel button is present', () => {
    const { getByText } = customRenderComponentWithRedux(
      componentToTest,
      storeData
    );

    expect(getByText(/cancel/i)).toBeInTheDocument();
  });

  test('Check Cancel button is clicked', () => {
    const handleEditorModalClose = vi.fn();
    const { getByText } = customRenderComponentWithRedux(
      <CustomModal
        onCloseText={cellData.onCloseText}
        onClose={handleEditorModalClose}
      />,
      storeData
    );
    fireEvent.click(getByText(/cancel/i));
    expect(handleEditorModalClose).toHaveBeenCalledTimes(1);
  });

  test('Render the Bulk Operation Warning model', () => {
    customRenderComponentWithRedux(componentToTest, {
      reducer: { getCampaignData: campaignReducer },
      initialState: {
        getCampaignData: {
          bulkWarningModel: true,
        },
      },
    });
  });

  test('Validate the warning message in Bulk Operation Warning model', () => {
    const { getByText } = customRenderComponentWithRedux(componentToTest, {
      reducer: { getCampaignData: campaignReducer },
      initialState: {
        getCampaignData: {
          bulkWarningModel: true,
        },
      },
    });
    expect(
      getByText(/This action will overwrite the existing data/i)
    ).toBeInTheDocument();
  });
});
