import React, { createContext, useContext, useState } from "react";
import { useStore } from "./storeContext";

export const SelectedCampaignsContext = createContext(null);
export const useSelectedCampaigns = () => useContext(SelectedCampaignsContext);

/**
 * Exposes context for store. A very simple dataObject state hook.
 * Please consider the use of proper state manager.
 */
export const SelectedCampaignsProvider = ({ children }) => {
  const [initialList, setInitialList] = useState([]); // * Keeps the initial list, doesn't change
  const [campaignList, setCampaignList] = useState([]); // * Keeps the list updated
  const { store } = useStore();

  const setInitialStateHandler = (campaigns) => {
    setCampaignList(campaigns);
    setInitialList(campaigns.map((campaign) => campaign.id));
  };
  const addOrRemoveSelectionsHandler = ({ tab, value, account }) => {
    setCampaignList((prevState) => {
      if (
        tab === 1 ||
        prevState.filter((elem) => value.campaignKey === elem.campaignKey)
          .length > 0
      ) {
        return prevState.map((campaign) =>
          value.campaignKey === campaign.campaignKey
            ? { ...campaign, isActive: !campaign.isActive }
            : campaign
        ); //prevState.filter(elem => value.campaignKey !== elem.campaignKey)
      }
      return [
        {
          id: 0,
          name: value.name,
          accountSelectedKey: account.accountKey,
          accountSelectedName: account.name,
          parentKey: account.parentKey,
          platformId: account.platformId,
          isActive: true,
          status: value.status,
          campaignKey: value.campaignKey,
          userId: store.selectedDash?.userId || store.currentUser?.id,
        },
        ...prevState,
      ];
    });
  };

  return (
    <SelectedCampaignsContext.Provider
      value={{
        campaigns: campaignList,
        initialList: initialList,
        setInitialState: setInitialStateHandler,
        addOrRemoveSelections: addOrRemoveSelectionsHandler,
      }}
    >
      {children}
    </SelectedCampaignsContext.Provider>
  );
};
