import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Multiselect from 'multiselect-react-dropdown';
import {
  getAllClients,
  saveUserAccessRequest,
  getUserAccessRequest,
} from '../../_services/userManagement';
import {
  trackButtonClick,
  getPageCategory,
} from '_helpers/Utils/segmentAnalyticsUtil';
import CssBaseline from '@mui/material/CssBaseline';
import CustomButton from '../UI/CustomButton';
import { SHOW_NOTIFICATION } from 'common/Redux/Constants';
import { getNotificationObject } from 'views/UI/notificationInfo';
import mfStyles from '../../_theme/modules/UserManagement/UserManagementForm.module.css';
import cmStyles from '../../_theme/modules/shared/CustomModal.module.css';
import Spinner from 'common/SmallSpinner';
import { useLoaderData } from 'react-router-dom';
import PageLoader from 'common/Spinner';

const AccessRequestForm = () => {
  const { t } = useTranslation(['common']);
  const { requestObj } = useLoaderData();
  const dispatch = useDispatch();
  const [allClients, setAllClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setInvalidInputs([]);
    if (requestObj?.pendingRequest) {
      setPendingRequest(true);
      return;
    }

    getAllClients().then((clients) => {
      setAllClients(clients);
    });
  }, []);

  const customStyles = {
    chips: { background: 'black' },
    searchBox: {
      border: 'none',
    },
  };

  const formStyles = {
    'border-radius': '.5rem',
    'background': '#FFF',
    'box-shadow': '0px 1px 16px 0px rgba(0, 0, 0, 0.10)',
  }

  const validateInputs = () => {
    let invalidArr = [];

    if (selectedClients.length === 0) invalidArr.push('client');
    else invalidArr = invalidArr.filter((input) => input !== 'client');

    setInvalidInputs(invalidArr);
    return invalidArr;
  };

  const onClientSelectionHandler = () => (selectedList) => {
    setSelectedClients((prev) => [
      ...prev,
      ...selectedList.filter(
        (selectedClient) =>
          !prev.some((client) => client.clientId === selectedClient.clientId)
      ),
    ]);
  };
  
  const onClientRemovalHandler = () => (removedItem) => {
    setSelectedClients(removedItem);
  };

  const handleSubmit = (e) => {
    trackButtonClick(requestObj.userId, getPageCategory(), 'Button');
    const invalidArray = validateInputs();
    if (invalidArray.length > 0) return;

    if(selectedClients.length>0){
    saveUserAccessRequest(selectedClients.map((client) => client.clientId))
      .then((response) => {
        const { statusCode, statusDescription } = response;
        if (statusCode === 200) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject(
              'success',
              'Your request has been submitted! You will receive an email when your request has been approved or denied.'
            ),
          });
          setShowLoader(true);
          setTimeout(() => {
            setPendingRequest(true);
            setShowLoader(false);
          }, 2000);
        } else {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: getNotificationObject('error', statusDescription),
          });
        }
      })
      .catch((error) => {
        const { statusDescription } = error;
        dispatch({
          type: SHOW_NOTIFICATION,
          payload: getNotificationObject('error', statusDescription),
        });
      });
    }
  };

  const requestForm = () => {
    return (
      <div className={`p-2 `} style={formStyles}>
        <CssBaseline />
        <div className='row'>
          <div className='col-md-6'>
            <label className={`form-label ${mfStyles['groove_label_text']}`}>
              {t('site_texts.access_request')}
            </label>
            <br />
            <br />
          </div>
        </div>
        <br />
        <div className={'row'}>
          <div
            className={`col-md-6 ${
              invalidInputs.includes('client') ? 'is-invalid' : ''
            }`}
          >
            <label
              htmlFor='user-client'
              className={`form-label ${mfStyles['groove_label_text']}`}
            >
              {t('site_texts.clients') + '*'}
            </label>

            {allClients.length > 0 ? (
              <Multiselect
                id='client-dropdown'
                style={customStyles}
                options={allClients || []}
                displayValue='clientName'
                onSelect={onClientSelectionHandler()}
                onRemove={onClientRemovalHandler()}
                selectedValues={selectedClients}
                showCheckbox='true'
                emptyRecordMsg='No clients available'
                className={`form-control ${
                  invalidInputs.includes('client') ? 'is-invalid' : ''
                }`}
              />
            ) : (
              <Spinner />
            )}
          </div>
          {invalidInputs.includes('client') && (
            <div className='invalid-feedback'>
              {t('validation_messages.client_required')}
            </div>
          )}
        </div>
        <br />
        <br />
        <div style={{ width: '50%', paddingTop: 'inherit' }} className='d-flex'>
          <CustomButton
            className={`btn-primary text-white ${cmStyles['groove_custom_save_button']}`}
            onClick={(e) => handleSubmit(e)}
          >
            <div className='flex-row align-items-center'>
              {t('button_text.submit')}
            </div>
          </CustomButton>
        </div>
      </div>
    );
  };

  const pendingRequestMessage = () => {
    return (
      <label
        className={`form-label ${mfStyles['groove_label_text']}`}
        style={{ padding: '2%' }}
      >
        {t('site_texts.pending_request')}
      </label>
    );
  };

  const pageLoader = () => {
    return (
      <div className='d-flex justify-content-center align-items-center'>
        <PageLoader />
      </div>
    );
  };

  return showLoader
    ? pageLoader()
    : pendingRequest
    ? pendingRequestMessage()
    : requestForm();
};

export const checkPendingRequest = async () => {
  return {
    requestObj: await getUserAccessRequest()
      .then((response) => {
        if (response?.requestStatus === 'REQ')
          return { userId: response?.userId, pendingRequest: true };
        else return { userId: response?.userId, pendingRequest: false };
      })
      .catch((error) => {
        return { userId: null, pendingRequest: false };
      }),
  };
};

export default AccessRequestForm;
