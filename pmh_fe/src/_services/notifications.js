import { baseURL } from '_helpers/baseApi';
import * as signalR from '@microsoft/signalr';
import { msalInstance } from '_helpers/Auth/authMsalContext';
import { loginRequest } from '_helpers/Auth/authConfig';

async function getJwtToken() {
  await msalInstance.initialize();
  try {
    const account = msalInstance?.getAllAccounts()[0];
    // If an account is found, acquire the token silently
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    });
    return tokenResponse.accessToken;
  } catch (error) {
    console.error('Error acquiring token:', error);
  }
}

export const getConnection = async () => {
  const token = await getJwtToken();
  try {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}/notificationsHub`, {
        accessTokenFactory: () => {
          return token;
        },
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
      }) // Ensure this matches your backend configuration
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    if (connection) {
      return connection;
    }
  } catch (error) {
    console.error('Error creating connection:', error);
  }
};

