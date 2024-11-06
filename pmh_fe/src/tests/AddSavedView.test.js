import React from "react";
import { fireEvent, render } from "@testing-library/react";
import AddSavedView from "views/shared/SavedViewsSelector/AddSavedView";
import ReactDOM from "react-dom";

// Mock the createPortal method from react-dom
ReactDOM.createPortal = (element, _target) => {
    return element; // Mocked implementation of createPortal, just returns the element
};

describe("AddSavedView Component", () => {
    test('Check whether the save add view and cancel view button is present and clicked', () => {
        const saveOptions = vi.fn();
        const handleCancelSave = vi.fn();
        const handleNameEdit = vi.fn();
        const { getByTestId, getByText } = render(
            <AddSavedView
                isDefaultViews={true}
                editColumnSelectionState='toSave'
                columnSelectionState='toSave'
                isViewNameValid=""
                disabledSaveButton={false}
                isDuplicateView={false}
                handleCancelSave={handleCancelSave}
                handleNewViewNameChange={() => { }}
                handleNameEdit={handleNameEdit}
                saveOptions={saveOptions}
                savingIsValid={true}
                isEditing={false}
                editedOptionName='test'
                isError={false}
            />
        );
        expect(getByTestId('text-box-id')).toBeInTheDocument();
        fireEvent.change(getByTestId('text-box-id'), { target: { value: 'test' } });

        expect(getByText(/save/i)).toBeInTheDocument();
        fireEvent.click(getByText(/save/i));

        expect(getByText(/cancel/i)).toBeInTheDocument();
        fireEvent.click(getByText(/cancel/i));
        expect(handleCancelSave).toHaveBeenCalledTimes(1);
    });

    test('Check whether the save edit view and cancel view button is present and clicked', () => {
        const handleNameEdit = vi.fn();
        const handleCancelSave = vi.fn();

        const { getByText } = render(
            <AddSavedView
                isDefaultViews={true}
                editColumnSelectionState='isEditing'
                columnSelectionState='isEditing'
                isViewNameValid=''
                disabledSaveButton={false}
                isDuplicateView={false}
                handleCancelSave={handleCancelSave}
                handleNewViewNameChange={() => { }}
                handleNameEdit={handleNameEdit}
                saveOptions={() => { }}
                savingIsValid={true}
                isEditing={true}
                editedOptionName='default1'
                isError={false}
            />
        );
        expect(getByText(/save/i)).toBeInTheDocument();
        fireEvent.click(getByText(/save/i));
        expect(handleNameEdit).toHaveBeenCalledTimes(1);
        expect(getByText(/cancel/i)).toBeInTheDocument();
        fireEvent.click(getByText(/cancel/i));
        expect(handleCancelSave).toHaveBeenCalledTimes(1);
    });
});
