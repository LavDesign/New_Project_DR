import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLoaderData } from "react-router-dom";
import { getPlatformsInfo } from "../../_helpers/Utils/availablePlatformsInfo";
import useAccountAssociation from "../../_helpers/hooks/useAccountAssociation";
import AlertMessage from "../UI/AlertMessage";



const getAssociationObject = state => {
  const strongMessage = {
    'callback_failure': 'Bad callback response!',
    'saving_failure': "Can't save association!",
    'saving_success': 'Success!',
  };
  const message = {
    'callback_failure': 'You will be redirected, please try again.',
    'saving_failure': "You will be redirected, please try again!",
    'saving_success': "Account associated",
  };

  const alertType = {
    'callback_failure': 'alert-danger',
    'saving_failure': "alert-danger",
    'saving_success': "alert-success",
  }
  return {
    requestFinished: true,
    state,
    strongMessage: strongMessage[state],
    message: message[state],
    alertType: alertType[state]
  }
};

const AssociationCallbackPage = props => {
  const { platformInfo } = useLoaderData();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const { saveAccountCode } = useAccountAssociation();
  const [associationState, setAssociationState] = useState({ requestFinished: false, state: '', strongMessage: '', message: '', alertType: '' });

  const closeAssociationWindow = async () => {
    await new Promise(resolve => setTimeout(resolve, 3500));
    window.close();
  };

  const savingAssociationData = useCallback(async (associationData) => {
    const savingResult = await saveAccountCode(associationData);

    setAssociationState({ ...getAssociationObject(savingResult.statusCode === 200 ? 'saving_success' : 'saving_failure') });

    closeAssociationWindow();
  }, []);

  useEffect(() => {
    let callbackData = {};
    if (platformInfo.id === 2) {
      callbackData = { oauth_token: searchParams.get('oauth_token'), oauth_verifier: searchParams.get('oauth_verifier') };

      if (callbackData.oauth_token === null || callbackData.oauth_verifier === null) {
        setAssociationState({ ...getAssociationObject('callback_failure') });
        closeAssociationWindow();
        return;
      }
      savingAssociationData({ oauth_token: callbackData.oauth_token, oauth_verifier: callbackData.oauth_verifier, platformId: platformInfo.id, state: searchParams.get('state') })
    }
    else {
      callbackData = { code: searchParams.get('code') };

      if (callbackData.code === null) {
        setAssociationState({ ...getAssociationObject('callback_failure') });
        closeAssociationWindow();
        return;
      }
      savingAssociationData({ code: callbackData.code, platformId: platformInfo.id, state: searchParams.get('state') });
    }


  }, []);

  useEffect(() => {
    const clearAssociationState = async () => {
      await new Promise(resolve => setTimeout(resolve, 3500));
      setAssociationState({ requestFinished: false, state: '', strongMessage: '', message: '', alertType: '' });
    };

    if (associationState.requestFinished) {
      const intervalId = setInterval(clearAssociationState, 3500);
      return () => clearInterval(intervalId);
    }
  }, [associationState, setAssociationState]);

  return (
    <>
      {associationState.requestFinished &&
        <AlertMessage {...associationState} />}
      <div className="p-3 text-center text-primary">
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <strong className="p-2">{!associationState.requestFinished ? 'Associating Account' : 'Redirecting'}</strong>
      </div>
    </>
  )

};

export const associationCallbackLoader = async data => {
  return { platformInfo: getPlatformsInfo(data.platform) }
};

export default AssociationCallbackPage;
