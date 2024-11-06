import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../_theme/modules/shared/SavedViewSelector.module.css';
import { PUBLICURL } from '../../../_helpers/Utils/dashboardUtil';

const TextItem = props => {
    const { t } = useTranslation(['common']);
    const handleNameChanged = e => {
        props.setEditedOptionName(e.target.value)
        e.preventDefault();
    };

    return (<>
        <div>
            {props.columnSelectionState === 'isEditing' && props.isEditing === true && props.editedViewId === props.option.viewId ?
                <input type="text" defaultValue={props.editedOptionName} onChange={handleNameChanged} className={`${styles['groove_edit_view_text']} ${props.isViewNameValid.length === 0 ? '' : 'is-invalid'}`} />
                : <div style={{ fontWeight: props.option.selected ? '500' : '400' }} className={`${styles['groove_global_li']} ${styles['text-item']} ${props.selectedOption ? props.columnSelectionState === 'toSave' ? styles['italic-bold-item'] : styles['bold-item'] : ''}`}>{props.children}</div>}
            {props.isViewNameValid === 'invalid' ? (
                <span className={`invalid-feedback ${styles['error-span-margin']} ${styles['error-span-width']} `}>{t('validation_messages.view_name_required')}</span>
            ) : props.isViewNameValid === 'duplicate' ? (
                <span className={`invalid-feedback ${styles['error-span-margin']}  ${styles['error-span-width']} `}>{t('validation_messages.view_name_duplicate')}</span>
            ) : null}
        </div>
    </>)
}

const SavedViewCheckBox = props => {
    const checkboxRef = useRef();
    const checkboxChangedHandler = () => {
        props.handleCheckClick(checkboxRef.current.checked, props.option, props.isDefaultViews);
    };
    return (
        <input
            ref={checkboxRef}
            type="checkbox"
            className={`form-check-input  align-middle ${styles['groove_checkbox']}`}
            onChange={checkboxChangedHandler}
            style={{ marginTop: "10px" }}
        />
    )
};

const SavedViewsList = (props) => {
    return (
        <div style={{ marginTop: '10px' }} key={props.index} className='container g-0'>
            <div style={{ marginBottom: props.isViewNameValid === 'invalid' || props.isViewNameValid === 'duplicate' ? '7%' : '0%' }} className={`row ${styles['delete-icon-container']}`}>
                {props.columnSelectionState === 'toSave' && props.option.viewId !== 1 && props.isSavedViewAbility &&
                    <div className={`col-1 ${styles['checkbox-container']}`}>
                        <SavedViewCheckBox
                            data-testid='checkbox'
                            option={props.option}
                            handleCheckClick={props.handleCheckClick}
                            isDefaultViews={props.isDefaultViews}
                        />
                    </div>
                }

                <div className={`col-9 pl-2 ${styles['groove_text_item']}`}>
                    <a className={`dropdown-item text-truncate ${styles['groove_li_a']}`} onClick={() => { if (props.columnSelectionState !== 'isEditing') { props.onOptionClickedHandler(props.option) } }}>
                        <TextItem
                            selectedOption={props.option.selected}
                            isEditing={props.isEditing}
                            option={props.option}
                            editedViewId={props.editedView ? props.editedView.viewId : 0}
                            editedOptionName={props.editedOptionName}
                            isViewNameValid={props.isViewNameValid}
                            columnSelectionState={props.columnSelectionState}
                            setEditedOptionName={props.setEditedOptionName} >
                            {props.option.label}
                        </TextItem>
                    </a>
                </div>

                {props.showEdit && (
                    <div style={{ marginTop: '5px' }} className={`col${props.columnSelectionState === 'toSave' ? '-1' : '-2'} g-0 `}>
                        <span >
                            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_delete.png`} data-testid='DeleteIcon'
                                className='me-1' style={{ width: '16px', height: '16px' }} onClick={props.onDeleteOptionClickedFn(props.option)} />
                            {props.columnSelectionState === 'saved' ?
                                <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_edit.png`} data-testid='EditIcon'
                                    className='me-1' style={{ width: '16px', height: '16px' }} onClick={() => props.handleEditName(props.option, props.isDefaultViews)} />
                                : null}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
};

export default SavedViewsList;