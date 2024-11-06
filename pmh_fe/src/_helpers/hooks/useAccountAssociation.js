import {
  getAuthorizationUrl,
  saveAuthorizationCode,
  disassociateAccount,
} from '../../_services/accountAssociation';
import { fetchAccountsByPlatformId } from '_services/campaignDash';
import { isValidUrl } from '../Utils/utils';

const useAccountAssociation = () => {
  const initAccountAssociation = async (platformInfo) => {
    const authorizationURL = await getAuthorizationUrl({
      platformId: platformInfo.id,
    });

    const strWindowFeatures =
      'popup=true, toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    const authURL =
      import.meta.env.VITE_ENV === 'local'
        ? authorizationURL.json.replace(
            'https%3a%2f%2fsynopsformarketing-stage.accenture.com%2famc-dev',
            import.meta.env.VITE_URL
          )
        : authorizationURL.json;
    const platformAccountAssociation = 'PlatformAccountAssociation';

    if (isValidUrl(authURL)) {
      return window.open(
        `${authURL}`,
        `${platformAccountAssociation}`,
        `${strWindowFeatures}`
      );
    } else {
      console.error('Invalid URL:', authURL);
      return null;
    }
  };

  const saveAccountCode = async (data) => {
    return saveAuthorizationCode({ data });
  };

  const getAccountsByPlatformId = async (platformInfo) => {
    return fetchAccountsByPlatformId({ platformId: platformInfo.id });
  };

  const disassociatePlatformAccount = (platformInfo) => {
    return disassociateAccount({ platformId: platformInfo.id });
  };

  return {
    initAccountAssociation,
    saveAccountCode,
    getAccountsByPlatformId,
    disassociatePlatformAccount,
  };
};

export default useAccountAssociation;
