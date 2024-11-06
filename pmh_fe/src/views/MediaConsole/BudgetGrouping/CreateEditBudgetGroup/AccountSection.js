import { useEffect, useState, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import '_theme/modules/shared/CustomToolTip.css';
import _ from 'underscore';
import './AccountSection.scss';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import DropdownFieldWithLabel from 'views/MediaConsole/Common/FormComponents/DropdownFieldWithLabel';
import { useStore } from '_helpers/storeContext';
import { fetchAvailableCampaigns } from '_services/campaignDash';
import SearchComponent from 'views/MediaConsole/Common/FormComponents/SearchComponent';
import CustomModal from 'views/UI/CustomModal';
import SkeletonLoaderComponent from 'views/MediaConsole/Common/SkeletonLoaderComponent';
import { displayToolTipField, customEmptyComponent } from '_helpers/Utils/mediaConsoleUtil';
import { getPlatformsInfoById } from '_helpers/Utils/availablePlatformsInfo';

const AccountSection = ({
  filterCheckedChannelList,
  setFilterCheckedChannelList,
  clearAccountData,
  setClearAccountData,
  setShowFooterBtns,
}) => {
  const { t } = useTranslation(['common']);
  const {
    store: { currentUser },
  } = useStore();
  const [searchCampaignValue, setSearchCampaignValue] = useState(undefined);
  const [searchAccountValue, setSearchAccountValue] = useState(undefined);
  const [accountList, setAccountList] = useState(undefined);
  const [deleteInfo, setDeleteInfo] = useState(undefined);

  const [
    modifiedOriginalCampaignList,
    setModifiedOriginalCampaignList,
  ] = useState([]); // Needed this state for search to have the orignal list
  const [accountSelectionByPlatform, setAccountSelectionByPlatform] = useState(
    undefined
  );
  const [addAccBtnDisable, setAddAccBtnDisable] = useState(false);

  const originalCampaignList = useRef(null);
  const dropdownCampaignMenuRef = useRef(null);
  const dropdownAccountMenuRef = useRef(null);
  const currentAccountSelection = useRef(null);
  const isCampaignCalled = useRef(false);
  const originalAccountList = useRef(null);
  const currentPlatformId = useRef(null);
  const modifiedAccountList = useRef(null); // Needed this ref for search to have the orignal list

  useEffect(() => {
    // Clear data on channel switch
    if (clearAccountData) {
      setSearchCampaignValue(undefined);
      setSearchAccountValue(undefined);
      setAccountList(undefined);
      setModifiedOriginalCampaignList([]);
      setAccountSelectionByPlatform(undefined);
      setAddAccBtnDisable(false);
      setDeleteInfo(undefined);
      currentAccountSelection.current = null;
      originalCampaignList.current = null;
      isCampaignCalled.current = false;
      originalAccountList.current = null;
      dropdownCampaignMenuRef.current = null;
      currentPlatformId.current = null;
      modifiedAccountList.current = null;
      setClearAccountData(false);
    }
  }, [clearAccountData]);

  const modifiedAccountsList = (accounts, keyValue) => {
    const getRemovedAccount = keyValue
      ? originalAccountList.current.find(
          (acc) => acc.accountKeyString === keyValue
        )
      : undefined;

    const accountListCopy = JSON.parse(
      JSON.stringify(originalAccountList.current)
    );
    const availableAccounts = accountListCopy.filter(
      (acc) => !Object.keys(accounts).includes(acc.accountKeyString)
    );
    const addRemovedAccounts = getRemovedAccount
      ? [...availableAccounts, getRemovedAccount]
      : availableAccounts;
    const updatedList = sortByName(_.uniq(addRemovedAccounts, 'accountKey'));
    setAccountList(updatedList);
    modifiedAccountList.current = updatedList;
  };

  const navigationCode = (currentChannelActive) => {
    if (currentChannelActive?.accountDataForChannel) {
      const updateAccountData = JSON.parse(
        JSON.stringify(currentChannelActive.accountDataForChannel)
      );
      Object.values(updateAccountData).forEach((account) => {
        account.close = true; // or whatever value you want to assign to 'close'
      });

      for (let key in updateAccountData) {
        if (
          !updateAccountData[key].selectedCampaigns ||
          updateAccountData[key].selectedCampaigns?.length === 0
        ) {
          delete updateAccountData[key];
        }
      }
      if (Object.keys(updateAccountData).length) {
        if (Object.keys(updateAccountData).length === 1) {
          updateAccountData[Object.keys(updateAccountData)[0]].disabled = true;
        }
      } else {
        updateAccountData.emptyAccount = {
          close: false,
          accTitle: 'Account',
          disabled: true,
        };
      }
      setAccountSelectionByPlatform(updateAccountData);
      isCampaignCalled.current = true;
    } else {
      setAccountSelectionByPlatform({
        emptyAccount: {
          close: false,
          accTitle: 'Account',
          disabled: true,
        },
      });
    }
  };

  useEffect(() => {
    // Below block to handle navigation functionality
    if (filterCheckedChannelList?.length) {
      const currentChannelActive = filterCheckedChannelList.filter(
        (channel) => channel.currentActive
      );
      navigationCode(currentChannelActive[0]);
    }
  }, []);

  useEffect(() => {
    if (
      filterCheckedChannelList?.length &&
      originalAccountList.current === null
    ) {
      // Account List Dropdown
      const copyChannelList = JSON.parse(
        JSON.stringify(filterCheckedChannelList)
      );
      const currentChannelActive = copyChannelList.filter(
        (channel) => channel.currentActive
      );
      const accountList = currentChannelActive.flatMap((channel) => {
        channel.accounts?.forEach((element) => {
          element.label = element.name;
          element.value = element.accountKey;
          element.accountKeyString = `A_${element.accountKey}`; // this is used to add accountKey as string to object so that sorting can be removed
        });
        return channel.accounts;
      });
      originalAccountList.current = accountList;
      currentPlatformId.current = accountList?.[0]?.platformId;
      setAccountList(sortByName(accountList));
      modifiedAccountList.current = sortByName(accountList);

      // This line is needed if we are navigating back to this component from manage channel modal
      navigationCode(currentChannelActive[0]);
    }
  }, [filterCheckedChannelList]);

  const sortByName = (array) => {
    return array?.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownCampaignMenuRef.current &&
        !dropdownCampaignMenuRef.current.contains(event.target) &&
        event.target.className !== 'chip-clear'
      ) {
        setSearchCampaignValue(undefined);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownCampaignMenuRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownAccountMenuRef.current &&
        !dropdownAccountMenuRef.current.contains(event.target)
      ) {
        setSearchAccountValue(undefined);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownAccountMenuRef]);

  const updateAccountCampaigns = (
    accountData,
    currentAccountKey,
    campaigns,
    selectedCampaigns = []
  ) => {
    const updateCampaigns = JSON.parse(JSON.stringify(accountData));
    updateCampaigns[currentAccountKey].campaigns = sortByName(campaigns);
    updateCampaigns[currentAccountKey].selectedCampaigns = sortByName(
      selectedCampaigns
    );
    setAccountSelectionByPlatform(updateCampaigns);
  };

  const getCampaignList = (
    campaigns,
    selectedCampaigns,
    updatedListWithSearch
  ) => {
    if (currentAccountSelection.current?.accountKeyString) {
      if (
        updatedListWithSearch?.[
          currentAccountSelection.current.accountKeyString
        ]
      ) {
        updateAccountCampaigns(
          updatedListWithSearch,
          currentAccountSelection.current.accountKeyString,
          campaigns,
          selectedCampaigns
        );
      } else if (
        accountSelectionByPlatform?.[
          currentAccountSelection.current.accountKeyString
        ]
      ) {
        const selectedCampaignsList = selectedCampaigns
          ? selectedCampaigns
          : accountSelectionByPlatform?.[
              currentAccountSelection.current.accountKeyString
            ]?.selectedCampaigns || [];
        updateAccountCampaigns(
          accountSelectionByPlatform,
          currentAccountSelection.current.accountKeyString,
          campaigns,
          selectedCampaignsList
        );
      }
    }
  };

  useEffect(() => {
    if (
      currentUser &&
      currentAccountSelection.current &&
      !isCampaignCalled.current
    ) {
      isCampaignCalled.current = true;
      const {
        accountKey,
        platformId,
        parentKey,
      } = currentAccountSelection.current;
      fetchAvailableCampaigns({
        selectedDash: currentUser?.id,
        selectedAccount: accountKey,
        selectedAccountPlatformId: platformId,
        ...(parentKey && {
          parentKey: parentKey,
        }),
      }).then((data) => {
        const campaigns = data.map((data) => ({
          name: data.name,
          campaignKey: data.campaignKey,
          platformId: data.platformId,
          accountKey: accountKey,
          parentKey: parentKey,
          // following keys are required for BG details page
          platformName: getPlatformsInfoById(data.platformId)?.displayName,
          campaignName: data.name,
          accountName: data.accountSelectedName,

        }));
        originalCampaignList.current = campaigns;
        if (
          accountSelectionByPlatform?.[
            currentAccountSelection.current?.accountKeyString
          ]?.selectedCampaigns
        ) {
          const campaignsPresent =
            accountSelectionByPlatform[
              currentAccountSelection.current?.accountKeyString
            ].selectedCampaigns;
          const updatedCampaigns = campaigns.filter(
            (campaign) =>
              !campaignsPresent.some(
                (selected) => selected.campaignKey === campaign.campaignKey
              )
          );
          getCampaignList(updatedCampaigns, campaignsPresent);
        } else getCampaignList(campaigns);
      });
    }
  }, [
    accountSelectionByPlatform?.[
      currentAccountSelection.current?.accountKeyString
    ]?.account,
  ]);

  useEffect(() => {
    if (originalCampaignList.current?.length) {
      const updatedList = JSON.parse(
        JSON.stringify(originalCampaignList.current)
      ).filter((item1) => {
        return !accountSelectionByPlatform?.[
          currentAccountSelection.current?.accountKeyString
        ]?.selectedCampaigns?.some(
          (item2) => item2.campaignKey === item1.campaignKey
        );
      });
      setModifiedOriginalCampaignList(updatedList);
    }
  }, [
    accountSelectionByPlatform?.[
      currentAccountSelection.current?.accountKeyString
    ]?.campaigns,
  ]);

  useEffect(() => {
    if (
      accountSelectionByPlatform?.[
        currentAccountSelection.current?.accountKeyString
      ]
    ) {
      const updatedSearch = JSON.parse(
        JSON.stringify(accountSelectionByPlatform)
      );
      const selectedCampaigns =
        updatedSearch[currentAccountSelection.current.accountKeyString]
          ?.selectedCampaigns || [];
      updatedSearch[
        currentAccountSelection.current.accountKeyString
      ].searchCampaignValue = searchCampaignValue;
      if (searchCampaignValue) {
        const filteredData = modifiedOriginalCampaignList.filter((data) =>
          Object.values(data).some((value) =>
            value
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchCampaignValue?.toString()?.toLowerCase())
          )
        );
        getCampaignList(filteredData, selectedCampaigns, updatedSearch);
      } else {
        getCampaignList(
          modifiedOriginalCampaignList,
          selectedCampaigns,
          updatedSearch
        );
      }
    }
  }, [searchCampaignValue]);

  useEffect(() => {
    if (modifiedAccountList.current) {
      if (searchAccountValue) {
        const filteredData = modifiedAccountList.current.filter((data) =>
          Object.values(data).some((value) =>
            value
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchAccountValue?.toString()?.toLowerCase())
          )
        );
        setAccountList(sortByName(filteredData));
      } else {
        setAccountList(modifiedAccountList.current);
      }
    }
  }, [searchAccountValue]);

  useEffect(() => {
    if (accountSelectionByPlatform) {
      if (
        Object.keys(accountSelectionByPlatform).length ===
        originalAccountList.current.length
      )
        setAddAccBtnDisable(true);
      else setAddAccBtnDisable(false);
      const channelAccountUpdate = JSON.parse(
        JSON.stringify(accountSelectionByPlatform)
      );
      Object.values(channelAccountUpdate).forEach((data) => {
        // clear unused values
        delete data.searchCampaignValue;
      });
      delete channelAccountUpdate.emptyAccount;
      setFilterCheckedChannelList((prev) => {
        return prev.map((channel) => {
          const updateChannel = JSON.parse(JSON.stringify(channel));
          if (channel.platformId === currentPlatformId.current) {
            if (!_.isEmpty(channelAccountUpdate)) {
              updateChannel.accountDataForChannel = channelAccountUpdate;
            } else {
              delete updateChannel.accountDataForChannel;
            }
          }
          return updateChannel;
        });
      });
      const checkAccountHasCampaigns = Object.values(channelAccountUpdate).some(
        (account) => account.selectedCampaigns?.length
      );
      if (checkAccountHasCampaigns) {
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'active',
            name: 'Next',
          },
          secondary: {
            show: true,
            state: 'active',
            name: 'Back',
          },
        }));
      } else {
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'disabled',
            name: 'Next',
          },
          secondary: {
            show: true,
            state: 'active',
            name: 'Back',
          },
        }));
      }
    }
  }, [accountSelectionByPlatform]);

  const onAccountSelection = (item) => {
    isCampaignCalled.current = false;
    const updateAccounts = JSON.parse(
      JSON.stringify(accountSelectionByPlatform)
    );
    if (
      updateAccounts[currentAccountSelection.current?.accountKeyString]
        ?.selectedCampaigns.length === 0
    ) {
      delete updateAccounts[currentAccountSelection.current.accountKeyString];
    }
    delete updateAccounts.emptyAccount;

    updateAccounts[item.accountKeyString] = {
      account: item,
      close: false,
      disabled: Object.keys(updateAccounts).length === 0,
    };

    currentAccountSelection.current = item;
    setAccountSelectionByPlatform(updateAccounts);
  };

  const onSearch = (event, field = 'campaign') =>
    field === 'campaign'
      ? setSearchCampaignValue(event.target.value || undefined)
      : setSearchAccountValue(event.target.value || undefined);

  const onCampaignSelection = (item, accounts) => {
    const copyAccounts = JSON.parse(JSON.stringify(accounts));

    const campaignsCopy =
      copyAccounts[currentAccountSelection.current.accountKeyString].campaigns;
    const selectedCampaignsCopy =
      copyAccounts[currentAccountSelection.current.accountKeyString]
        .selectedCampaigns;

    const updateSelectedCampaigns = [...selectedCampaignsCopy, item];
    const updatedCampaignsByAccount = campaignsCopy.filter(
      (campaign) => campaign.campaignKey !== item.campaignKey
    );

    getCampaignList(updatedCampaignsByAccount, updateSelectedCampaigns);
  };

  const onCampaignRemove = (item, accounts) => {
    const copyAccounts = JSON.parse(JSON.stringify(accounts));

    const campaignsCopy =
      copyAccounts[currentAccountSelection.current.accountKeyString].campaigns;
    const selectedCampaignsCopy =
      copyAccounts[currentAccountSelection.current.accountKeyString]
        .selectedCampaigns;

    const updateSelectedCampaigns = selectedCampaignsCopy.filter(
      (campaign) => campaign.campaignKey !== item.campaignKey
    );
    const updatedCampaignsByAccount = [...campaignsCopy, item];

    getCampaignList(updatedCampaignsByAccount, updateSelectedCampaigns);
  };

  const customDropDownComponent = (accountSection, keyValue) => {
    const titleTextObj = {
      mainTitle: `${
        accountSection?.[keyValue]?.searchCampaignValue
          ? `No Campaigns matched your search`
          : `No Campaigns on this Account`
      }`,
      subTitle: `${
        accountSection?.[keyValue]?.searchCampaignValue
          ? `Try searching for something else`
          : `There aren’t any active campaigns on this account`
      }`,
    };
    return (
      <div className='account-item-container' ref={dropdownCampaignMenuRef}>
        <SearchComponent
          searchValue={accountSection?.[keyValue]?.searchCampaignValue}
          onSearchText={(event) => onSearch(event)}
          placeholderText='Search for campaigns'
          clearSearch={() => onSearch({ target: { value: '' } })}
        />
        <div className='list-container'>
          <div className='list-item' key={`list_header`}>
            <span className='list-item-id'>Campaign ID</span>
            <span>Campaign Name</span>
          </div>
          {accountSection?.[keyValue]?.campaigns?.length
            ? accountSection?.[keyValue]?.campaigns.map((item, index) => {
                return (
                  <div
                    className='list-item'
                    key={`list_${index}`}
                    onClick={() => onCampaignSelection(item, accountSection)}
                  >
                    <img
                      src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-campaign.svg`}
                      alt={`Plus Icon`}
                    />
                    <span className='list-item-id'>{item.campaignKey}</span>
                    <span>{item.name}</span>
                  </div>
                );
              })
            : customEmptyComponent(titleTextObj)}
        </div>
      </div>
    );
  };

  const onAccordionClick = (accountSection, keyValue) => {
    const updatedAccountSection = JSON.parse(JSON.stringify(accountSection));
    updatedAccountSection[keyValue].close = !updatedAccountSection[keyValue]
      .close;
    Object.keys(updatedAccountSection).forEach((key) => {
      if (key !== keyValue) {
        updatedAccountSection[key].close = true;
      }
    });
    if (keyValue !== 'emptyAccount') {
      currentAccountSelection.current = updatedAccountSection[keyValue].account;
      originalCampaignList.current = updatedAccountSection[keyValue].campaigns;
    }
    if (!updatedAccountSection[keyValue].campaigns)
      isCampaignCalled.current = false;

    modifiedAccountsList(updatedAccountSection, keyValue);
    setAccountSelectionByPlatform(updatedAccountSection);
  };

  const onAddAccountClick = () => {
    const accounts = JSON.parse(JSON.stringify(accountSelectionByPlatform));
    modifiedAccountsList(accounts);
    currentAccountSelection.current = null;
    originalCampaignList.current = null;

    Object.keys(accounts).forEach((key) => {
      if (key !== 'emptyAccount') {
        accounts[key].close = true;
        accounts[key].disabled = false;
      }
    });
    accounts.emptyAccount = {
      close: false,
      accTitle: 'Account',
      disabled: false,
    };

    setAccountSelectionByPlatform(accounts);
  };

  const onDeleteAccountClick = () => {
    const { accountSection, keyValue } = deleteInfo;
    const updatedAccountSection = JSON.parse(JSON.stringify(accountSection));
    delete updatedAccountSection[keyValue];
    if (Object.keys(updatedAccountSection).length === 1) {
      updatedAccountSection[
        Object.keys(updatedAccountSection)[0]
      ].disabled = true;
    }

    modifiedAccountsList(updatedAccountSection, keyValue);
    Object.values(updatedAccountSection).forEach((account) => {
      account.close = true;
    });
    setAccountSelectionByPlatform(updatedAccountSection);
    setDeleteInfo(undefined);
  };

  
  const displayAccountSection = (accountSection, keyValue) => {
    const titleTextObj = {
      mainTitle: `${
        searchAccountValue ? `No Accounts matched your search` : ''
      }`,
      subTitle: `${
        searchAccountValue ? `Try searching for something else` : ''
      }`,
    };
    return (
      <div
        className={`ce__account-section ${
          accountSection?.[keyValue]?.close
            ? 'ce__account-section-collapse'
            : ''
        }`}
        key={`account_${keyValue}`}
      >
        <div className='account-heading-container'>
          <div
            className='heading-container'
            onClick={() => onAccordionClick(accountSection, keyValue)}
          >
            <span className='heading'>
              {accountSection?.[keyValue]?.accTitle ||
                accountSection[keyValue]?.account?.name}
            </span>
            {accountSection?.[keyValue]?.close &&
            accountSection[keyValue]?.selectedCampaigns ? (
              <span className='campaigns-count'>{`(${accountSection[keyValue]?.selectedCampaigns.length} campaigns)`}</span>
            ) : null}
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/caret.svg`}
              alt={`Arrow`}
            />
          </div>
        </div>
        <div className='body-section'>
          <div className='divider' />
          <div className='account-section-body'>
            <div ref={dropdownAccountMenuRef}>
              <DropdownFieldWithLabel
                label='Account'
                optionsArray={accountList}
                placeholder='Choose account'
                selectedData={accountSection[keyValue]?.account}
                onClickHandler={(item) => {
                  setSearchAccountValue(undefined);
                  onAccountSelection(item);
                }}
                disabled={accountSection[keyValue]?.selectedCampaigns?.length}
                showSearch={true}
                placeholderText='Search for Account'
                searchValue={searchAccountValue}
                onSearchText={(event) => onSearch(event, 'account')}
                clearSearch={() =>
                  onSearch({ target: { value: '' } }, 'account')
                }
                customEmptyComponent={customEmptyComponent(titleTextObj)}
                showInfo={accountSection[keyValue]?.selectedCampaigns?.length}
                toolTipInfo={`Accounts with associated campaigns can’t be changed\nDelete the campaigns or add a new account`}
              />
            </div>
            <div
              className={`${
                originalCampaignList.current
                  ? ''
                  : 'selected-campaigns-disabled'
              }`}
            >
              <span
                className={`selected-campaigns-label ${
                  originalCampaignList.current ? '' : 'disabled'
                }`}
              >
                Selected Campaigns
              </span>
              <div
                className={`selected-campaigns-wrapper ${
                  originalCampaignList.current ? '' : 'disabled'
                }`}
              >
                <div className='selected-campaigns'>
                  {originalCampaignList.current ? (
                    accountSection[keyValue]?.selectedCampaigns?.length ? (
                      accountSection[keyValue]?.selectedCampaigns?.map(
                        (item, index) => {
                          const tooltipData = {
                            key: item.campaignKey,
                            name: item.name,
                          };
                          return (
                            <div
                              className='chip-wrapper'
                              onClick={(e) => e.stopPropagation()}
                              key={`sc_${index}`}
                            >
                              {displayToolTipField(tooltipData)}
                              <img
                                src={`${window.location.origin}${PUBLICURL}/assets/icons/clear-close.svg`}
                                alt='Clear Account'
                                className='chip-clear'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCampaignRemove(item, accountSection);
                                }}
                              />
                            </div>
                          );
                        }
                      )
                    ) : (
                      <span className='selected-campaigns-placeholder'>
                        Your selected campaigns will show here
                      </span>
                    )
                  ) : null}
                </div>
              </div>
            </div>
            <DropdownFieldWithLabel
              label='Select Campaigns'
              placeholder='Select Your Campaigns'
              closeDropdown='outside'
              customDropDownComponent={customDropDownComponent(
                accountSection,
                keyValue
              )}
              disabled={
                !(
                  accountSection[keyValue]?.campaigns &&
                  accountSection[keyValue]
                )
              }
            />
          </div>
        </div>

        <div
          className={`delete-container ${
            accountSection[keyValue]?.disabled ? `disabled-class` : ''
          }`}
          onClick={() =>
            setDeleteInfo({
              accountSection,
              keyValue,
            })
          }
        >
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/${
              accountSection[keyValue]?.disabled ? `trash-white` : 'trash'
            }.svg`}
            alt='Delete Icon'
          />
          <span>Delete Account</span>
        </div>
      </div>
    );
  };

  return accountSelectionByPlatform ? (
    <>
      {Object.keys(accountSelectionByPlatform).map((account) => {
        return displayAccountSection(accountSelectionByPlatform, account);
      })}
      <div className='ce__account-section-add-container'>
        {addAccBtnDisable ? (
          <div className='warning-msg-container'>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_laugh-wink.png`}
              alt='Warning icon'
            />
            <span>
              You can’t add another Account because there are no more accounts
              associated to this Channel
            </span>
          </div>
        ) : null}
        <div
          key={'addAccount'}
          className={`add-account-btn-container ${
            addAccBtnDisable ? ' disabled-class' : ''
          }`}
          style={{
            pointerEvents: accountSelectionByPlatform?.emptyAccount && 'none',
            cursor: accountSelectionByPlatform?.emptyAccount
              ? 'default'
              : 'pointer',
          }}
          onClick={() =>
            accountSelectionByPlatform?.emptyAccount
              ? null
              : onAddAccountClick()
          }
        >
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/${
              addAccBtnDisable ? 'plus-account-white' : 'plus-account'
            }.svg`}
            alt='Add Icon'
          />
          <span>Add Account</span>
        </div>
      </div>
      {deleteInfo && (
        <CustomModal
          open={true}
          onClose={() => setDeleteInfo(undefined)}
          onAccept={() => onDeleteAccountClick()}
          title={t('site_titles.delete_account')}
          onSaveText={t('button_text.yes_delete')}
          onCloseText={t('button_text.no_cancel')}
          isGroove={true}
          isSmallModal={true}
          actionType={'delete'}
        >
          <span>{t('site_texts.delete_account')}</span>
        </CustomModal>
      )}
    </>
  ) : (
    <SkeletonLoaderComponent />
  );
};

export default AccountSection;

