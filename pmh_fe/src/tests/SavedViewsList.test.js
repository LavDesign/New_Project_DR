import React from "react";
import { fireEvent, render } from "@testing-library/react";
import SavedViewsList from "views/shared/SavedViewsSelector/SavedViewsList";
import { savedViewsListData } from '_testhelpers/mockReponse';

describe("SavedViewsList Component", () => {
    test("check whether delete buttons are present", () => {
        const { getByTestId } = render(<SavedViewsList
            columnSelectionState="saved"
            editedOptionName=""
            editedView='null'
            handleCheckClick={() => { }}
            handleEditName={() => { }}
            index='0'
            isDefaultViews='true'
            isEditing='false'
            isSavedViewAbility='true'
            isViewNameValid=""
            onDeleteOptionClickedFn={() => { }}
            onOptionClickedHandler={() => { }}
            option={savedViewsListData}
            setEditedOptionName={() => { }}
            showEdit='true'
        />);

        expect(getByTestId('DeleteIcon')).toBeInTheDocument();
    });

    test("check whether edit buttons are present", () => {
        const { getByTestId } = render(<SavedViewsList
            columnSelectionState="saved"
            editedOptionName=""
            editedView='null'
            handleCheckClick={() => { }}
            handleEditName={() => { }}
            index='0'
            isDefaultViews='true'
            isEditing='false'
            isSavedViewAbility='true'
            isViewNameValid=""
            onDeleteOptionClickedFn={() => { }}
            onOptionClickedHandler={() => { }}
            option={savedViewsListData}
            setEditedOptionName={() => { }}
            showEdit='true'
        />);
        expect(getByTestId('EditIcon')).toBeInTheDocument();
    });

    test("check whether checkbox is present", () => {
        const { getByRole } = render(<SavedViewsList
            columnSelectionState="toSave"
            editedOptionName=""
            editedView='null'
            handleCheckClick={() => { }}
            handleEditName={() => { }}
            index='0'
            isDefaultViews='true'
            isEditing='false'
            isSavedViewAbility='true'
            isViewNameValid=""
            onDeleteOptionClickedFn={() => { }}
            onOptionClickedHandler={() => { }}
            option={savedViewsListData}
            setEditedOptionName={() => { }}
            showEdit='true'
        />);
        expect(getByRole('checkbox')).toBeInTheDocument();
    });

});