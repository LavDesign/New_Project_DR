// New platform data to be added in Platform object also whenever platform is intergerated in UI

export const Platform = {
  FACEBOOK: 1,
  LINKEDIN: 3,
  GOOGLE_ADS: 4,
  GOOGLE_DV360: 5,
  GOOGLE_SA360: 6,
};

export const availablePlatformsInfo = {
  facebook: { id: 1, platform: 'facebook', icon: 'facebook-dash.png', name: 'facebook', displayName: 'Facebook' },
  linkedin: { id: 3, platform: 'linkedin', icon: 'linkedin-dash.png', name: 'linkedin', displayName: 'LinkedIn' },
  googleads: { id: 4, platform: 'googleads', icon: 'google_ads.png', name: 'google_ads', displayName: 'Google Ads' },
  googledv360: { id: 5, platform: 'googledv360', icon: 'google_dbm.png', name: 'google_dv360', displayName: 'Google DV360' },
  googlesa360: { id: 6, platform: 'googlesa360', icon: 'google_sa360.png', name: 'google_sa360', displayName: 'Google SA360' },
};

export const getPlatformsInfo = (key) => availablePlatformsInfo[key];

export const getKeys = () => Object.keys(availablePlatformsInfo);

export const getPlatformsInfoById = (id) => {
  for (const key in availablePlatformsInfo) {
    if (availablePlatformsInfo[key].id === id)
      return availablePlatformsInfo[key];
  }
  return null;
};

export const evaluatePlatform = (value) =>
  [Platform.LINKEDIN, Platform.GOOGLE_DV360].includes(value);
