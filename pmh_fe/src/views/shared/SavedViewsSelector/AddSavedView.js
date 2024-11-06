import React, { useRef } from 'react';
import CustomButton from '../../UI/CustomButton';
import { useTranslation } from 'react-i18next';
import styles from '../../../_theme/modules/shared/SavedViewSelector.module.css';

const AddSavedView = (props) => {
    const { t } = useTranslation(['common']);
    const textRef = useRef();

    const handleTextChange = () => {
        props.handleNewViewNameChange(textRef.current.value.trim(), props.isDefaultViews);
    }

    return (
        <>
            {props.isError && <span className="invalid-feedback">{"error"}</span>}
            {props.columnSelectionState === 'toSave' &&
                <li>
                    <input
                        type='text'
                        defaultValue=''
                        data-testid='text-box-id'
                        ref={textRef}
                        className={`form-control ${styles['groove_add_view_input']} ${(props.isViewNameValid.length === 0 || props.isViewNameValid === 'duplicate' && textRef?.current?.value?.trim().length === 0) ? '' : 'is-invalid'}`}
                        placeholder='New View Name'
                        onChange={handleTextChange}
                        maxLength='30' />
                    {props.isViewNameValid === 'invalid' ? (
                        <span className="invalid-feedback">{t('validation_messages.view_name_required')}</span>
                    ) : props.isViewNameValid === 'duplicate' && textRef?.current?.value?.trim().length > 0 ? (
                        <span className="invalid-feedback">{t('validation_messages.view_name_duplicate')}</span>
                    ) : null}
                    {props.isError && <span className="invalid-feedback">{props.errorMessages}</span>}
                    <div className={`mt-1 border-top pt-1 bt-1 ${styles['dialog-buttons-container']}`}>
                        <CustomButton className={`btn-light ${styles['groove_saved_view_buttons']} ${styles['groove_view_cancel']}`} onClick={props.handleCancelSave}>{'Cancel'}</CustomButton>
                        <CustomButton
                            className={`btn-primary text-white ${styles['groove_saved_view_buttons']} ${styles['groove_view_save']}`}
                            onClick={() => props.saveOptions(props.isDefaultViews)}
                            disabled={(!props.savingIsValid && !props.isEditing) || props.disabledSaveButton} >{'Save'}</CustomButton>

                    </div>
                </li>
            }
            {props.editColumnSelectionState === 'isEditing' &&
                <div className={`mt-1 border-top pt-1 bt-1 ${styles['dialog-buttons-container']} ${styles['margin-top-1']}`}>
                    <CustomButton className={`btn-light ${styles['groove_saved_view_buttons']} ${styles['groove_view_cancel']}`} onClick={props.handleCancelSave}>{'Cancel'}</CustomButton>
                    <CustomButton
                        className={`btn-primary text-white ${styles['groove_saved_view_buttons']} ${styles['groove_view_save']}`}
                        onClick={() => props.handleNameEdit(props.isDefaultViews)}
                        disabled={textRef && textRef?.current?.value?.trim().length === 0 || props.editedOptionName.trim().length === 0}>{'Save'}</CustomButton>
                </div>
            }
        </>

    )
};

export default AddSavedView;