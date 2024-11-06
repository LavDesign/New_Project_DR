import React from 'react';
import ReactDOM from 'react-dom';

import CustomButton from './CustomButton';
import Spinner from 'common/SmallSpinner';
import styles from '../../_theme/modules/shared/CustomModal.module.css';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const CustomModal = ({
  open,
  modalWidth,
  title,
  children,
  disabledOkButton,
  onAccept,
  onSaveText,
  onClose,
  onCloseText,
  disabledCancelButton,
  showLoaderButton,
  isCloseButton,
  modalBodyClass,
  isModalWhiteBackground,
  isGroove,
  isSmallModal,
  modelFooterComponent,
  customModalStyle,
  modalContentHeight,
  actionType = '',
  customSecondaryAction,
}) => {
  const target = document.getElementById('overlay');

  let imageLink = '';

  switch (actionType) {
    case 'delete':
    case 'cancel':
    case '':
      imageLink = 'laugh-wink';
      break;
    case 'new':
    case 'edit':
      imageLink = 'check-with-green-circle';
      break;
    case 'error':
      imageLink = 'white-cross-red-circle';
      break;
    default:
      imageLink = '';
      break;
  }

  const content = (
    <div
      style={customModalStyle}
      className={`fade modal-backdrop${open && ' show'} ${
        styles['groove_modal_backdrop']
      }`}
    >
      <div
        className={`modal fade d-block gdpr-modal${open && ' show'} ${
          isSmallModal ? styles['groove_modal'] : ''
        }`}
        id='exampleModal'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div
          className={`modal-dialog  ${
            isSmallModal ? styles['groove_small_dialog'] : ''
          } ${isGroove ? styles['groove_modal_dialog'] : ''}`}
          style={{
            minWidth: '40rem',
            maxWidth: modalWidth || '58rem',
          }}
        >
          <div
            className='modal-content'
            style={{
              backgroundColor: isGroove && isModalWhiteBackground && 'white',
              height: isSmallModal ? '200px' : modalContentHeight || '',
            }}
          >
            <div
              className={`modal-header ${
                isSmallModal ? styles['groove_small_modal_header'] : ''
              }`}
              style={{
                justifyContent: isGroove ? 'left' : 'center',
                padding: '1rem 1.5rem',
              }}
            >
              {isSmallModal && (
                <img
                  src={`${window.location.origin}${PUBLICURL}/assets/icons/${imageLink}.svg`}
                  className={`${styles['groove_small_modal_icon']}`}
                />
              )}

              <h2
                className={`modal-title ${
                  isSmallModal ? styles['groove_small_modal_title'] : ''
                }   ${isGroove ? styles['groove_modal_title'] : ''}`}
                id='exampleModalLabel'
              >
                {title}
              </h2>
              {isSmallModal ? (
                <img
                  className={`${styles['groove_close_icon']}`}
                  src={`${window.location.origin}${PUBLICURL}/assets/icons/small-modal-close.svg`}
                  onClick={onClose}
                  data-bs-dismiss='modal'
                />
              ) : <button type="button" className={`btn-close ${styles['groove_close_icon']}`}
                onClick={onClose} data-bs-dismiss="modal" aria-label="Close">
              </button>} 
            </div>
            <div
              className={`modal-body ${
                isSmallModal ? styles['groove_small_modal_body'] : ''
              }`}
              style={modalBodyClass}
            >
              {children}
            </div>
            <div
              style={{ padding: '0.5rem 1.5rem' }}
              className={`modal-footer ${
                isSmallModal ? styles['groove_small_modal_footer'] : ''
              }${modelFooterComponent?.() ? ' justify-content-between' : ''}`}
            >
              {modelFooterComponent?.()}
              <div
                style={{
                  columnGap: '8px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {onCloseText && (
                  <CustomButton
                    className={`${
                      isGroove ? styles['groove_custom_cancel_button'] : ''
                    }  ${
                      isCloseButton ? 'btn-primary text-white' : 'btn-light'
                    }`}
                    onClick={
                      customSecondaryAction ? customSecondaryAction : onClose
                    }
                    disabled={disabledCancelButton}
                  >
                    {onCloseText}
                  </CustomButton>
                )}

                {onSaveText && (
                  <CustomButton
                    style={{ pointerEvents: showLoaderButton && 'none' }}
                    className={`btn-primary text-white ${
                      isGroove ? styles['groove_custom_save_button'] : ''
                    }`}
                    disabled={disabledOkButton}
                    onClick={onAccept}
                  >
                    {showLoaderButton ? (
                      <Spinner hideColor={showLoaderButton} />
                    ) : (
                      onSaveText
                    )}
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, target);
};

export default CustomModal;
