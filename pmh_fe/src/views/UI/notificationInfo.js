export const getNotificationObject = (state, customMsg, cutomStrongMsg) => {
  const strongMessage = {
    clear: '',
    error: 'Error:',
    success: 'Success:',
  };
  const message = {
    clear: '',
    error: 'An error occurred while updating. Please try again!',
    success: 'Success',
  };
  const alertType = {
    clear: '',
    error: 'alert-danger',
    success: 'alert-success',
  };
  const requestFinished = {
    clear: false,
    error: true,
    success: true,
  };
  return {
    requestFinished: requestFinished[state],
    state,
    strongMessage: cutomStrongMsg || strongMessage[state],
    message: customMsg || message[state],
    alertType: alertType[state],
  };
};
