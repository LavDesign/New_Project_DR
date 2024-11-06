import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { SHOW_NOTIFICATION, SHOW_RESPONSE } from 'common/Redux/Constants/index';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';

import '_theme/modules/UI/AlertMessage.scss';

const AlertMessage = ({
  alertType = '',
  strongMessage = '',
  message = '',
  autoClose = true,
}) => {
  const [showData, setShowData] = useState({
    alertType,
    strongMessage,
    message,
  });
  const [show, setShow] = useState(true);
  const { showNotification, showResponse } = useSelector(
    (store) => store.getCommonData
  );
  const dispatch = useDispatch();

  const onCloseHandler = () => {
    setShow(false);
    showNotification &&
      dispatch({
        type: SHOW_NOTIFICATION,
        payload: undefined,
      });
    showResponse &&
      dispatch({
        type: SHOW_RESPONSE,
        payload: undefined,
      });
  };
  useEffect(() => {
    if (showNotification) {
      setShowData(showNotification);
      setShow(true);
    }
  }, [showNotification]);

  useEffect(() => {
    if (!autoClose) {
      return;
    }

    const hideAfterDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onCloseHandler();
    };

    const intervalId = setInterval(hideAfterDelay, 3000);
    return () => {
      clearInterval(intervalId);
      onCloseHandler();
    };
  }, []);

  /*
  * Use bootstrap classes to show different alerts
    alert classes:
      alert-primary
      alert-secondary
      alert-success
      alert-warning
      alert-danger
      alert-info
   */
  return (
    <div
      className={`alert ${showData.alertType} alert-message d-flex fade ${
        show ? 'show' : ''
      } position-fixed top-0 end-0`}
      role='alert'
      style={{ zIndex: 9999 }}
    >
      <picture className='d-flex align-items-center'>
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_${showData.alertType}.svg`}
          alt=''
        />
      </picture>
      <div className='flex-grow-1 message_container'>
        {showData.strongMessage ? (
          <p className='strong-message mb-0'>{showData.strongMessage}</p>
        ) : null}
        {showData.message ? (
          <p className='message mb-0'>{showData.message}</p>
        ) : null}
      </div>
      <picture className='d-flex align-items-center'>
        <img
          className={'btn-close'}
          data-bs-dismiss='alert'
          onClick={onCloseHandler}
          src={`${window.location.origin}${PUBLICURL}/assets/icons/${showData.alertType}-close.svg`}
          alt='Close'
        />
      </picture>
    </div>
  );
};

AlertMessage.propTypes = {
  alertType: PropTypes.oneOf([
    'alert-primary',
    'alert-secondary',
    'alert-success',
    'alert-warning',
    'alert-danger',
    'alert-info',
  ]).isRequired,
  strongMessage: PropTypes.string,
  message: PropTypes.string,
  autoClose: PropTypes.bool,
};

export default AlertMessage;
