import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '_theme/modules/shared/GrooveDatePicker.scss';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import CEFooter from './CEFooter';
import styles from '_theme/modules/BudgetGrouping/CreateEditBudgetGroup/CreateEditMainContainer.module.css';
import {
  COMPLETION_STATE,
  FIELD_INFO,
  SECTION,
  allowCharacters,
  findLabelValue,
  validateNumberField,
} from '_helpers/Utils/mediaConsoleUtil';
import { getRegions, saveCampaignGroup } from '_services/budgetGrouping';
import {
  ASSOCIATED_ALL_ACCOUNTS,
  DROP_DOWN_LIST,
  EDIT_GROUP_DATA,
  ALL_USERS_LIST,
  BG_DETAILS_GROUP,
} from 'common/Redux/Constants';
import { fetchAvailableDashboards } from '_services/campaignDash';
import { useStore } from '_helpers/storeContext';
import { getPlatformsInfoById } from '_helpers/Utils/availablePlatformsInfo';
import AccountSection from './AccountSection';
import AddPlusImage from './AddPlusImage';
import InputFieldWithLabel from 'views/MediaConsole/Common/FormComponents/InputFieldWithLabel';
import DropdownFieldWithLabel from 'views/MediaConsole/Common/FormComponents/DropdownFieldWithLabel';
import ChannelComponent from './ChannelComponent';
import ManageChannelModel from './ManageChannelModel';
import CustomModal from 'views/UI/CustomModal';
import SkeletonLoaderComponent from 'views/MediaConsole/Common/SkeletonLoaderComponent';
import { getListOfUsers } from '_services/userManagement';
import { displayToolTipField } from '_helpers/Utils/mediaConsoleUtil';
import { customDropDownComponent } from 'views/MediaConsole/Common/FormComponents/CustomDropdown';
import { useLoaderData } from 'react-router-dom';

const listBodyComponent = (data, selectionFn, showPlusIcon) => {
  return data.map((item, index) => {
    return (
      <div
        className='list-item-user'
        key={`list_${index}`}
        onClick={() => selectionFn(item)}
      >
        {showPlusIcon ? (
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/plus-campaign.svg`}
            alt={`Plus Icon`}
          />
        ) : null}
        <span>{item}</span>
      </div>
    );
  });
};
const initialStateValues = {
  budgetName: '',
  budgetValue: '',
  kpiValue: {
    label: 'Select KPI',
    value: '',
  },
  clientValue: {
    label: 'Select Client',
    value: '',
  },
  regionValue: {
    label: 'Select Region',
    value: '',
  },
  budgetNameError: {
    error: false,
    msg: '',
  },
  budgetValueError: {
    error: false,
    msg: '',
  },
  startDate: null,
  startDateOpen: false,
  endDate: null,
  endDateOpen: false,
  startDateError: {
    error: false,
    msg: '',
  },
  endDateError: {
    error: false,
    msg: '',
  },
  budgetUpdateMailList: null,
};

const FOOTER_BTNS = {
  cancel: {
    show: true,
    state: 'active',
    name: 'Cancel',
  },
  secondary: {
    show: false,
    state: 'active',
    name: 'Back',
  },
  primary: {
    show: true,
    state: 'disabled',
    name: 'Next',
  },
};

const PAGE_INFO = {
  GENERAL: {
    name: SECTION.GENERAL,
    state: COMPLETION_STATE.PROGRESS,
    data: FIELD_INFO.MANDATORY,
    active: true,
    label: 'General Information',
  },
  CHANNEL: {
    name: SECTION.CHANNEL,
    state: COMPLETION_STATE.NOT_STARTED,
    data: FIELD_INFO.OPTIONAL,
    active: false,
    label: 'Manage Channels',
  },
  FINISH: {
    name: SECTION.FINISH,
    state: COMPLETION_STATE.FINISH,
    data: FIELD_INFO.MANDATORY,
    active: false,
    label: 'Finish',
  },
};

const CreateEditMainContainer = () => {
  const { t } = useTranslation(['common']);

  const {
    store: { currentUser },
  } = useStore();

  const [formValues, setFormValues] = useState(undefined);
  const [channelList, setChannelList] = useState([]);
  const [filterCheckedChannelList, setFilterCheckedChannelList] = useState([]);
  const [stepInfo, setStepInfo] = useState(undefined);
  const [showFooterBtns, setShowFooterBtns] = useState();
  const [clearAccountData, setClearAccountData] = useState(false);
  const [manageChannels, setManageChannels] = useState(false);
  const [callPrimaryBtnClick, setCallPrimaryBtnClick] = useState(false);
  const [modalInfo, setModalInfo] = useState(undefined);
  const [renderkey, setRenderKey] = useState(Date.now()); // This state is used to render the current route again
  const [disabledField, setDisabledField] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchValue, setUserSearchValue] = useState('');

  const startDateDivRef = useRef(undefined);
  const endDateDivRef = useRef(undefined);
  const channelListSet = useRef(false);
  const updateChannelState = useRef(false);
  const manageChannelRef = useRef(false);
  const aggreMentCheckRef = useRef(undefined);
  const copyPayloadRef = useRef(undefined);
  const dropdownUserRef = useRef(null);
  const copyPayloadBgDetailsRef = useRef(undefined);

  const {
    associatedAllAccounts,
    dropdownList,
    budgetGroupsList,
    editGroupData,
    allUsersList,
  } = useSelector((store) => store.getMediaConsole);

  const { kpiOptionsArray } = useLoaderData();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onUserSearch = (event) =>
    setUserSearchValue(event.target.value || undefined);

  const onUserSelection = (user) => {
    setUserSearchValue(undefined);
    let emailList = [];
    if (formValues.budgetUpdateMailList?.length > 0) {
      emailList = getExistingUsers();
    }
    emailList.push(user);
    setUserList(emailList);
  };

  const onUserRemove = (user) => {
    let emailList = [];
    if (formValues.budgetUpdateMailList?.length > 0) {
      emailList = getExistingUsers();
    }
    emailList = emailList.filter((email) => email !== user);
    setUserList(emailList);
  };

  const resetData = () => {
    setFormValues(JSON.parse(JSON.stringify(initialStateValues)));
    setChannelList([]);
    setFilterCheckedChannelList([]);
    setStepInfo(JSON.parse(JSON.stringify(PAGE_INFO)));
    setShowFooterBtns(JSON.parse(JSON.stringify(FOOTER_BTNS)));
    setClearAccountData(false);
    setManageChannels(false);
    setCallPrimaryBtnClick(false);
    setModalInfo(undefined);
    setRenderKey(Date.now());
    setDisabledField(false);
    startDateDivRef.current = undefined;
    endDateDivRef.current = undefined;
    channelListSet.current = false;
    updateChannelState.current = false;
    manageChannelRef.current = false;
    aggreMentCheckRef.current = undefined;
    copyPayloadRef.current = undefined;
    setChannelListData();
    dispatch({ type: EDIT_GROUP_DATA, payload: undefined });
    dropdownUserRef.current = null;
  };

  const componentReRender = () => {
    resetData();
    // Navigate to the current location again
    navigate('/new-edit-budget-group');
  };

  const setChannelListData = () => {
    if (!associatedAllAccounts) return;
    const channelData = JSON.parse(JSON.stringify(associatedAllAccounts))
      .reduce((unique, element) => {
        const platformId = element.platformId;
        if (!unique.some((obj) => obj.platformId === platformId)) {
          unique.push({
            platformId: platformId,
            platformName: getPlatformsInfoById(element.platformId)?.displayName,
            checked: false,
            state: COMPLETION_STATE.NOT_STARTED,
            accounts: associatedAllAccounts.filter(
              (account) => account.platformId === platformId
            ),
          });
        }
        return unique;
      }, [])
      .sort((a, b) => a.platformId - b.platformId);
    if (editGroupData) {
      channelData.forEach((channel) => {
        if (
          editGroupData.campaigns.some(
            (campaign) => campaign.platformId === channel.platformId
          )
        ) {
          channel.checked = true;
        }
        channel.accountDataForChannel = editGroupData.campaigns.reduce(
          (acc, campaign) => {
            if (campaign.platformId === channel.platformId) {
              if (acc[`A_${campaign.accountKey}`]?.selectedCampaigns) {
                acc[`A_${campaign.accountKey}`].selectedCampaigns.push({
                  name: campaign.campaignName,
                  campaignKey: campaign.campaignKey,
                  platformId: campaign.platformId,
                  accountKey: campaign.accountKey,
                  parentKey: campaign.parentKey,
                  // following keys are required for bg details page to populate the data
                  platformName: campaign.platformName,
                  campaignName: campaign.campaignName,
                  accountName: campaign.accountName,
                });
              } else {
                acc[`A_${campaign.accountKey}`] = {
                  account: {
                    accountKey: campaign.accountKey,
                    name: campaign.accountName,
                    platformId: campaign.platformId,
                    parentKey: campaign.parentKey,
                    currencyCode: campaign.currencyCode,
                    label: campaign.accountName,
                    value: campaign.accountKey,
                    accountKeyString: `A_${campaign.accountKey}`,
                  },
                  close: true,
                  disabled: false,
                  selectedCampaigns: [
                    {
                      name: campaign.campaignName,
                      campaignKey: campaign.campaignKey,
                      platformId: campaign.platformId,
                      accountKey: campaign.accountKey,
                      parentKey: campaign.parentKey,
                      // following keys are required for bg details page to populate the data

                      platformName: campaign.platformName,
                      campaignName: campaign.campaignName,
                      accountName: campaign.accountName,
                    },
                  ],
                };
              }
            }
            return acc;
          },
          {}
        );
      });
    }
    setChannelList(channelData);
  };

  const tryAgainBtnClick = () => {
    setModalInfo((prevState) => {
      return {
        ...prevState,
        show: false,
      };
    });
    setShowFooterBtns((prevShowFooterBtns) => ({
      ...prevShowFooterBtns,
      primary: {
        show: true,
        state: 'loader',
        name: 'Save',
      },
    }));
    if (copyPayloadRef.current?.count < 4) {
      saveCampaignGroup(copyPayloadRef.current.data)
        .then((response) => {
          const { statusCode } = response;
          if (statusCode === 200) {
            if (editGroupData) {
              dispatch({
                type: BG_DETAILS_GROUP,
                payload: copyPayloadBgDetailsRef.current,
              });
              setModalInfo({
                ...MODAL_INFO.EDIT_SUCCESS,
                show: true,
              });
            } else
              setModalInfo({
                ...MODAL_INFO.NEW_SUCCESS,
                show: true,
              });
            copyPayloadRef.current = undefined;
            copyPayloadBgDetailsRef.current = undefined;
          } else {
            if (copyPayloadRef.current.count === 3) {
              copyPayloadRef.current = undefined;
              setModalInfo({
                ...MODAL_INFO.MULTIPLE_ERROR,
                show: true,
              });
            } else {
              copyPayloadRef.current.count += 1;
              setModalInfo({
                ...MODAL_INFO.NEW_EDIT_ERROR,
                show: true,
              });
            }
          }
          setShowFooterBtns((prevShowFooterBtns) => ({
            ...prevShowFooterBtns,
            primary: {
              show: true,
              state: 'active',
              name: 'Save',
            },
          }));
        })
        .catch((_error) => {
          if (copyPayloadRef.current.count === 3) {
            copyPayloadRef.current = undefined;
            copyPayloadBgDetailsRef.current = undefined;
            setModalInfo({
              ...MODAL_INFO.MULTIPLE_ERROR,
              show: true,
            });
          } else {
            copyPayloadRef.current.count += 1;
            setModalInfo({
              ...MODAL_INFO.NEW_EDIT_ERROR,
              show: true,
            });
          }
          setShowFooterBtns((prevShowFooterBtns) => ({
            ...prevShowFooterBtns,
            primary: {
              show: true,
              state: 'active',
              name: 'Save',
            },
          }));
        });
    }
  };

  const MODAL_INFO = {
    CANCEL_NEW: {
      title: t('site_titles.cancel_request'),
      onSaveText: t('button_text.yes_cancel'),
      onCloseText: t('button_text.no_back'),
      actionType: 'cancel',
      content: t('site_texts.new_group_cancel'),
      onBtnClick: () => navigate('/budget-grouping'),
      onClose: () =>
        setModalInfo((prevState) => {
          return {
            ...prevState,
            show: false,
          };
        }),
    },
    CANCEL_EDIT: {
      title: t('site_titles.cancel_request'),
      onSaveText: t('button_text.yes_cancel'),
      onCloseText: t('button_text.no_back'),
      actionType: 'cancel',
      content: t('site_texts.edit_group_cancel'),
      onBtnClick: () => navigate(-1),
      onClose: () =>
        setModalInfo((prevState) => {
          return {
            ...prevState,
            show: false,
          };
        }),
    },
    NEW_SUCCESS: {
      title: t('site_titles.new_group_success'),
      onSaveText: t('button_text.finish'),
      onCloseText: t('button_text.new_group'),
      actionType: 'new',
      content: t('site_texts.new_group_success'),
      onBtnClick: () => navigate(-1),
      customSecondaryAction: () => componentReRender(),
      onClose: () => navigate(-1),
    },
    NEW_EDIT_ERROR: {
      title: t('site_titles.new_edit_budget_group_error'),
      onSaveText: t('button_text.try_again'),
      onCloseText: t('button_text.back'),
      actionType: 'error',
      content: t('site_texts.new_edit_budget_group_error'),
      onBtnClick: () => tryAgainBtnClick(),
      onClose: () =>
        setModalInfo((prevState) => {
          return {
            ...prevState,
            show: false,
          };
        }),
    },
    MULTIPLE_ERROR: {
      title: t('site_titles.multipe_errors_budget_group'),
      onSaveText: t('button_text.new_group'),
      onCloseText: t('button_text.dashboard'),
      actionType: 'error',
      content: t('site_texts.multipe_errors_budget_group'),
      onBtnClick: () => componentReRender(),
      onClose: () => navigate(-1),
    },
    EDIT_SUCCESS: {
      title: t('site_titles.edit_group_success'),
      onSaveText: t('button_text.finish'),
      onCloseText: t('button_text.new_group'),
      actionType: 'edit',
      content: t('site_texts.edit_group_success'),
      onBtnClick: () => navigate(-1),
      customSecondaryAction: () => componentReRender(),
      onClose: () => navigate(-1),
    },
  };

  const getCheckedChannelList = (channels) =>
    channels ? channels.filter((channel) => channel.checked) : [];

  const getDropdownList = async () => {
    const dropdownList = {};
    await getRegions().then((response) => {
      dropdownList.regionOptions = response.map((region) => {
        return {
          value: region,
          label: region,
        };
      });
    });

    dropdownList.clientOptions = currentUser?.userClientList?.map((client) => {
      return {
        value: client.clientId,
        label: client.clientName,
      };
    });

    dispatch({
      type: DROP_DOWN_LIST,
      payload: dropdownList,
    });
  };

  const displayFinalWithoutChannel = () => {
    setStepInfo((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        newState[key] = {
          ...newState[key],
          active: key === 'FINISH',
          state:
            key === 'GENERAL' ? COMPLETION_STATE.FINISH : newState[key].state,
          data: key === 'FINISH' ? FIELD_INFO.MANDATORY : newState[key].data,
        };
      });

      return newState;
    });
    setShowFooterBtns((prevShowFooterBtns) => ({
      ...prevShowFooterBtns,
      primary: {
        show: true,
        state: 'active',
        name: 'Save',
      },
      secondary: {
        show: true,
        state: 'active',
        name: 'Back',
      },
    }));
  };

  useEffect(() => {
    if (associatedAllAccounts === undefined) {
      fetchAvailableDashboards({
        selectedDash: currentUser?.id,
      }).then((data) => {
        const copiedData = JSON.parse(JSON.stringify(data));
        dispatch({
          type: ASSOCIATED_ALL_ACCOUNTS,
          payload: copiedData,
        });
      });
    }
    if (dropdownList === undefined) getDropdownList();
  }, []);

  const getAllUsers = async () => {
    await getListOfUsers()
      .then((response) => {
        response = response.map((user) => {
          user.email = user.email.replace('ds.dev.', '').toLowerCase();
          return user;
        });
        setAllUsers(response);
        dispatch({ type: ALL_USERS_LIST, payload: response });
      })
      .catch((err) => {
        setAllUsers([]);
        dispatch({ type: ALL_USERS_LIST, payload: [] });
      });
  };

  const getExistingUsers = () => {
    return formValues.budgetUpdateMailList.includes(';')
      ? formValues.budgetUpdateMailList.split(';')
      : [formValues.budgetUpdateMailList];
  };

  const setUserList = (emailList) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      budgetUpdateMailList:
        emailList.length > 1 ? emailList.join(';') : emailList[0],
    }));
  };

  const filterExistingUsers = () => {
    if (formValues?.budgetUpdateMailList?.length > 0) {
      let emailList = getExistingUsers();
      setAllUsers(
        allUsersList.filter((user) => !emailList.includes(user.email))
      );
    } else {
      setAllUsers(allUsersList);
    }
  };
  useEffect(() => {
    if (allUsersList.length === 0) getAllUsers();
    filterExistingUsers();
  }, []);

  useEffect(() => {
    filterExistingUsers();
  }, [formValues?.budgetUpdateMailList]);

  useEffect(() => {
    if (userSearchValue?.length > 0) {
      let currentUsers = allUsersList.filter(
        (user) => !formValues.budgetUpdateMailList?.includes(user.email)
      );
      setAllUsers(
        currentUsers.filter((user) =>
          user.email.includes(userSearchValue.toLowerCase())
        )
      );
    } else setAllUsers(allUsersList);
  }, [userSearchValue]);

  useEffect(() => {
    if (editGroupData) {
      const {
        groupName,
        budgetValue,
        kpi,
        startDate,
        endDate,
        clientName,
        clientId,
        region,
        campaigns,
        budgetUpdateMailList,
      } = JSON.parse(JSON.stringify(editGroupData));
      setFormValues(() => ({
        ...initialStateValues,
        budgetName: groupName,
        budgetValue: budgetValue,
        kpiValue:
          findLabelValue(kpi, kpiOptionsArray) || initialStateValues.kpiValue,
        startDate:
          startDate && startDate !== '--'
            ? moment(startDate).format('YYYY-MM-DD')
            : null,
        endDate:
          endDate && endDate !== '--'
            ? moment(endDate).format('YYYY-MM-DD')
            : null,
        clientValue: {
          label: clientName,
          value: clientId,
        },
        regionValue: {
          label: region,
          value: region,
        },
        budgetUpdateMailList: budgetUpdateMailList,
      }));
      setStepInfo(() => {
        const stepInfoDetails = JSON.parse(JSON.stringify(PAGE_INFO));
        stepInfoDetails.GENERAL = {
          ...stepInfoDetails.GENERAL,
          active: true,
          state: COMPLETION_STATE.FINISH,
          data: campaigns.length ? FIELD_INFO.OPTIONAL : FIELD_INFO.MANDATORY,
        };
        return stepInfoDetails;
      });
      setShowFooterBtns(() => ({
        ...FOOTER_BTNS,
        primary: {
          show: true,
          state: 'disabled',
          name: 'Next',
        },
      }));
      if (moment().isSameOrAfter(startDate, 'day')) setDisabledField(true);
    } else {
      setFormValues(JSON.parse(JSON.stringify(initialStateValues)));
      setStepInfo(JSON.parse(JSON.stringify(PAGE_INFO)));
      setShowFooterBtns(JSON.parse(JSON.stringify(FOOTER_BTNS)));
    }
  }, [editGroupData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateDivRef.current &&
        !startDateDivRef.current.contains(event.target)
      ) {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          startDateOpen: false,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startDateDivRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        endDateDivRef.current &&
        !endDateDivRef.current.contains(event.target)
      ) {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          endDateOpen: false,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [endDateDivRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownUserRef.current &&
        !dropdownUserRef.current.contains(event.target) &&
        dropdownUserRef.current.parentNode
      ) {
        setUserSearchValue(undefined);
        dropdownUserRef.current.parentNode.classList.remove('show');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownUserRef]);

  useEffect(() => {
    if (!channelListSet.current && associatedAllAccounts?.length) {
      setChannelListData();
      channelListSet.current = true;
    }
  }, [associatedAllAccounts]);

  useEffect(() => {
    const filterCheckedChannelList = JSON.parse(
      JSON.stringify(getCheckedChannelList(channelList))
    );
    if (manageChannelRef.current) {
      if (filterCheckedChannelList.length) {
        let getNotStartedChannelStep = filterCheckedChannelList.findIndex(
          (channel) => channel.state === COMPLETION_STATE.NOT_STARTED
        );
        if (getNotStartedChannelStep === -1 || getNotStartedChannelStep > 0) {
          const checkChannelFinalState = filterCheckedChannelList.every(
            (channel) => channel.state === COMPLETION_STATE.FINISH
          );
          if (checkChannelFinalState) {
            setStepInfo((prevState) => {
              const newState = { ...prevState };
              Object.keys(newState).forEach((key) => {
                newState[key] = {
                  ...newState[key],
                  active: key === 'FINISH',
                  state: COMPLETION_STATE.FINISH,
                  data:
                    key === 'FINISH' ? FIELD_INFO.OPTIONAL : newState[key].data,
                };
              });
              return newState;
            });
            setFilterCheckedChannelList((prevChannelList) => {
              const newChannelList = [...prevChannelList];
              newChannelList.forEach((channel, index) => {
                if (index === 0) {
                  channel.prevStep =
                    newChannelList.length - 1 < 0
                      ? 0
                      : newChannelList.length - 1;
                  channel.nextStep = newChannelList.length;
                } else {
                  delete channel.nextStep;
                  delete channel.prevStep;
                }
                delete channel.currentActive;
              });
              return newChannelList;
            });
            setShowFooterBtns((prevShowFooterBtns) => ({
              ...prevShowFooterBtns,
              primary: {
                show: true,
                state: 'active',
                name: 'Save',
              },
              secondary: {
                show: true,
                state: 'active',
                name: 'Back',
              },
            }));
          } else {
            let getProgressChannelStep = filterCheckedChannelList.findIndex(
              (channel) => channel.state === COMPLETION_STATE.PROGRESS
            );
            getProgressChannelStep =
              getProgressChannelStep > -1 ? getProgressChannelStep + 1 : 0;
            filterCheckedChannelList.forEach((data, index) => {
              data.step = index + 1;
              if (index === 0) {
                data.nextStep =
                  getProgressChannelStep < filterCheckedChannelList.length
                    ? getProgressChannelStep + 1
                    : getProgressChannelStep;
                data.prevStep = getProgressChannelStep - 1;
              } else {
                delete data.nextStep;
                delete data.prevStep;
              }
              if (index + 1 === getProgressChannelStep) {
                data.currentActive = true;
                data.state = COMPLETION_STATE.PROGRESS;
              } else {
                delete data.currentActive;
                if (index + 1 < getProgressChannelStep) {
                  data.state = COMPLETION_STATE.FINISH;
                } else if (index + 1 > getNotStartedChannelStep) {
                  data.state = COMPLETION_STATE.NOT_STARTED;
                }
              }
            });

            setClearAccountData(true);
          }
        } else {
          getNotStartedChannelStep =
            getNotStartedChannelStep > -1 ? getNotStartedChannelStep + 1 : 0;
          filterCheckedChannelList.forEach((data, index) => {
            data.step = index + 1;
            if (index === 0) {
              data.nextStep =
                getNotStartedChannelStep < filterCheckedChannelList.length
                  ? getNotStartedChannelStep + 1
                  : getNotStartedChannelStep;
              data.prevStep = getNotStartedChannelStep - 1;
            } else {
              delete data.nextStep;
              delete data.prevStep;
            }
            if (index + 1 === getNotStartedChannelStep) {
              data.currentActive = true;
              data.state = COMPLETION_STATE.PROGRESS;
            } else {
              delete data.currentActive;
              if (index + 1 > getNotStartedChannelStep) {
                data.state = COMPLETION_STATE.NOT_STARTED;
              }
            }
          });

          setClearAccountData(true);
        }
      } else {
        displayFinalWithoutChannel();
        setChannelList((prevChannelList) => {
          const newChannelList = [...prevChannelList];
          newChannelList.forEach((channel) => {
            channel.state = COMPLETION_STATE.NOT_STARTED;
            channel.checked = false;
            delete channel.accountDataForChannel;
            delete channel.currentActive;
            delete channel.showHelperText;
            delete channel.step;
            delete channel.nextStep;
            delete channel.prevStep;
          });
          return newChannelList;
        });
      }
      manageChannelRef.current = false;
    } else {
      filterCheckedChannelList.forEach((data, index) => {
        data.step = index + 1;
        if (index === 0) {
          data.nextStep = 1;
          data.prevStep = 0;
        }
      });
    }

    setFilterCheckedChannelList(filterCheckedChannelList);
  }, [channelList]);

  useEffect(() => {
    // Final Section Page. Clear account which is not having any selected campaigns
    if (filterCheckedChannelList.length) {
      const data = JSON.parse(JSON.stringify(filterCheckedChannelList)).map(
        (channel) => {
          if (channel.accountDataForChannel) {
            const updateAccountData = JSON.parse(
              JSON.stringify(channel.accountDataForChannel)
            );
            for (let key in updateAccountData) {
              if (updateAccountData[key].selectedCampaigns.length === 0) {
                delete updateAccountData[key];
              }
            }
            return {
              ...channel,
              accountDataForChannel: updateAccountData,
            };
          }
          return channel;
        }
      );
      setFilterCheckedChannelList(data);
    }
  }, [stepInfo?.FINISH?.active]);

  useEffect(() => {
    if (callPrimaryBtnClick && stepInfo.GENERAL.active) {
      primaryBtnOperation();
      setCallPrimaryBtnClick(false);
    }
  }, [callPrimaryBtnClick]);

  const updateStepsFooterBtns = (formValues, channelList) => {
    const {
      budgetName,
      budgetValue,
      kpiValue: { value: kpiData },
      clientValue: { value: clientData },
      regionValue: { value: regionData },
    } = formValues;
    if (
      budgetName !== '' &&
      budgetValue !== '' &&
      kpiData !== '' &&
      clientData !== '' &&
      regionData !== ''
    ) {
      if (getCheckedChannelList(channelList).length) {
        setStepInfo((prevState) => ({
          ...prevState,
          GENERAL: {
            ...prevState.GENERAL,
            data: FIELD_INFO.OPTIONAL,
          },
        }));
      } else {
        setStepInfo((prevState) => ({
          ...prevState,
          GENERAL: {
            ...prevState.GENERAL,
            data: FIELD_INFO.MANDATORY,
          },
        }));
      }
      if (!validateFields()) {
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'disabled',
            name: 'Next',
          },
        }));
      }
      if (stepInfo.GENERAL.active && validateFields()) {
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state:
              aggreMentCheckRef.current !== undefined &&
              aggreMentCheckRef.current
                ? 'disabled'
                : 'active',
            name: 'Next',
          },
          secondary: {
            show: false,
            state: 'active',
            name: 'Back',
          },
        }));
      } else if (stepInfo.FINISH.active) {
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'active',
            name: 'Save',
          },
          secondary: {
            show: true,
            state: 'active',
            name: 'Back',
          },
        }));
      }
    } else {
      setShowFooterBtns((prevShowFooterBtns) => ({
        ...prevShowFooterBtns,
        primary: {
          show: true,
          state: 'disabled',
          name: 'Next',
        },
        secondary: {
          show: false,
          state: 'active',
          name: 'Back',
        },
      }));
    }
  };

  useEffect(() => {
    if (formValues && channelList)
      updateStepsFooterBtns(formValues, channelList);
  }, [
    formValues?.budgetName,
    formValues?.budgetValue,
    formValues?.kpiValue,
    formValues?.clientValue,
    formValues?.regionValue,
    channelList,
  ]);

  const validateFields = () => {
    let {
      budgetName,
      budgetNameError,
      startDate,
      startDateError,
      endDate,
      endDateError,
    } = JSON.parse(JSON.stringify(formValues));
    let flag = true;
    if (budgetName === '') {
      budgetNameError.error = true;
      budgetNameError.msg = 'This field is mandatory';
      flag = false;
    } else if (budgetName !== '') {
      const editBudgetName = editGroupData?.groupName;
      if (!allowCharacters(budgetName)) {
        budgetNameError.error = true;
        budgetNameError.msg = 'This field should have a valid value';
        flag = false;
      } else if (
        budgetGroupsList.some(
          (obj) =>
            obj.groupName?.toLowerCase() === budgetName.toLowerCase() &&
            obj.groupName?.toLowerCase() !== editBudgetName?.toLowerCase()
        )
      ) {
        budgetNameError.error = true;
        budgetNameError.msg = 'Budget Group Name already exists';
        flag = false;
      }
    }

    if (startDate && endDate === null) {
      endDateError.error = true;
      endDateError.msg = 'This field is mandatory';
      flag = false;
    }
    if (endDate && startDate === null) {
      startDateError.error = true;
      startDateError.msg = 'This field is mandatory';
      flag = false;
    }
    if (startDate && endDate) {
      if (moment(startDate).isAfter(moment(endDate))) {
        startDateError.error = true;
        startDateError.msg = 'Start Date should be less than end date.';
        flag = false;
      }
      if (moment(endDate).isBefore(moment(startDate))) {
        endDateError.error = true;
        endDateError.msg = 'End Date should be greater than start date.';
        flag = false;
      }
    }
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      budgetNameError,
      startDateError,
      endDateError,
    }));
    return flag;
  };

  const handleInputChange = (event, type) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      budgetName:
        type === 'budgetName' ? event?.target?.value : formValues.budgetName,
      budgetValue:
        type === 'budgetValue'
          ? validateNumberField(event?.target?.value)
          : formValues.budgetValue,
      budgetNameError:
        type === 'budgetName'
          ? initialStateValues.budgetNameError
          : formValues.budgetNameError,
      budgetValueError:
        type === 'budgetValue'
          ? initialStateValues.budgetValueError
          : formValues.budgetValueError,
    }));
  };

  const onDateClick = (type) => {
    if (type === 'startDate') {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        startDateOpen: !formValues.startDateOpen,
        endDateOpen: false,
      }));
    } else if (type === 'endDate') {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        endDateOpen: !formValues.endDateOpen,
        startDateOpen: false,
      }));
    }
    return;
  };

  const handleDateChange = (type, e) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [type]: moment(e[0]).format('MM/DD/YYYY'),
      startDateOpen: false,
      endDateOpen: false,
      startDateError: initialStateValues.startDateError,
      endDateError: initialStateValues.endDateError,
    }));
  };

  const displayDateField = (type, label) => {
    return (
      <div className='w-100 position-relative'>
        <label
          className={`form-label ${styles['form-label-date-picker']} ${
            formValues[`${type}Error`].error ? styles['error-color'] : ''
          } ${disabledField ? styles['disabled-field'] : ''}`}
        >
          {label}
        </label>
        <div className='d-flex align-items-center gap-2'>
          <div className='d-inline-block position-relative w-100'>
            <input
              type='text'
              placeholder='MM/DD/YYYY'
              className={`${styles['date-box']} ${
                formValues[`${type}Error`].error ? styles['error-ouline'] : ''
              } ${
                formValues[`${type}Open`] ? styles['date-box-focus-border'] : ''
              } ${disabledField ? styles['disabled-field-input'] : ''}`}
              value={
                formValues[type]
                  ? moment(formValues[type]).format('MM/DD/YYYY')
                  : ''
              }
              onClick={() => onDateClick(type)}
              readOnly
              tabIndex={0}
            />
            <div className={`${styles['date-icon-clear-container']}`}>
              {formValues[type] && formValues[`${type}Open`] && (
                <button
                  className={`${styles['date-input-clear-button']}`}
                  onClick={() =>
                    setFormValues((prevFormValues) => ({
                      ...prevFormValues,
                      [type]: null,
                      startDateError: initialStateValues.startDateError,
                      endDateError: initialStateValues.endDateError,
                    }))
                  }
                >
                  <img
                    src={`${window.location.origin}${PUBLICURL}/assets/icons/clear-date.svg`}
                    alt={`clear`}
                  />
                </button>
              )}
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/${
                  formValues[type] || formValues[`${type}Open`]
                    ? 'date-icon-active'
                    : 'date-icon'
                }.svg`}
                className={`${styles['date-icon']} ${
                  disabledField ? styles['disabled-field'] : ''
                }`}
                alt={`date`}
                onClick={() => onDateClick(type)}
              />
            </div>
            {formValues[`${type}Open`] && (
              <div className='position-absolute z-2'>
                <DatePicker
                  inline
                  selectsRange
                  calendarClassName='groove-date-picker'
                  selected={formValues[type] ? new Date(formValues[type]) : ''}
                  onChange={(e) => handleDateChange(type, e)}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
        </div>
        {formValues[`${type}Error`].error || disabledField ? (
          <div
            className={`${styles['helper-text-container']} ${
              disabledField
                ? styles['helper-text-container-disabled-field']
                : ''
            }`}
          >
            {formValues[`${type}Error`]?.msg ||
              `This field can not longer be edited`}
          </div>
        ) : null}
      </div>
    );
  };

  const onChannelSelection = (channel) => {
    const mergedFilterAndChannel = channelList.map((channel) => {
      const commonChannel = filterCheckedChannelList.find(
        (filterChannel) => filterChannel.platformId === channel.platformId
      );
      return commonChannel ? { ...channel, ...commonChannel } : channel;
    });
    mergedFilterAndChannel.forEach((data) => {
      if (channel.platformId === data.platformId) {
        data.checked = !data.checked;
        if (
          data?.accountDataForChannel &&
          Object.values(data?.accountDataForChannel)?.some(
            (account) => account.selectedCampaigns?.length
          )
        ) {
          data.showHelperText = !data.checked;
        }
      }
      data.state = COMPLETION_STATE.NOT_STARTED;
    });
    setChannelList(mergedFilterAndChannel);
  };

  const displayChannels = () => {
    return (
      <div className='w-100 position-relative'>
        <label className={`form-label ${styles['form-label-select-channels']}`}>
          Select Channels
        </label>
        <ChannelComponent
          channelList={channelList}
          onChannelSelection={onChannelSelection}
          checkboxState={(flag) => {
            aggreMentCheckRef.current = flag;
            setShowFooterBtns((prevShowFooterBtns) => ({
              ...prevShowFooterBtns,
              primary: {
                show: true,
                state: flag ? 'disabled' : 'active',
                name: 'Next',
              },
              secondary: {
                show: false,
                state: 'active',
                name: 'Back',
              },
            }));
          }}
          disabledField={disabledField}
        />
      </div>
    );
  };

  const leftPanel = () => {
    return (
      <div className={styles['ce__left-panel-container']}>
        <div className={styles['ce__steps-title-container']}>
          <div className={styles['ce__steps-container-label-container']}>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/steps.svg`}
              alt='Steps'
            />
            <span className={styles['ce__steps-container-label-title']}>
              Steps
            </span>
          </div>
        </div>
        <div className={styles['ce__steps-flow-container']}>
          <div className={styles['ce__steps-item']}>
            <div
              className={`${styles['ce__oval-icon']} ${
                stepInfo.GENERAL.state === COMPLETION_STATE.PROGRESS
                  ? styles['ce__blue-bg-color']
                  : styles['ce__green-bg-color']
              }`}
            >
              {stepInfo.GENERAL.state === COMPLETION_STATE.FINISH && (
                <img
                  src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-icon.svg`}
                  alt='Checked Icon'
                />
              )}
              <span style={{ backgroundColor: 'inherit' }}></span>
            </div>
            <div className={styles['ce__steps-item-title']}>
              {stepInfo.GENERAL.label}
            </div>
          </div>
          {!stepInfo.GENERAL.active &&
            filterCheckedChannelList.map((channel, index) => {
              return (
                <div
                  className={styles['ce__steps-item']}
                  key={`channel-step-${index}`}
                >
                  <div
                    className={`${styles['ce__oval-icon']} ${
                      channel.state === COMPLETION_STATE.NOT_STARTED
                        ? styles['ce__gray-bg-color']
                        : channel.state === COMPLETION_STATE.PROGRESS
                        ? styles['ce__blue-bg-color']
                        : styles['ce__green-bg-color']
                    }`}
                  >
                    {channel.state === COMPLETION_STATE.FINISH && (
                      <img
                        src={`${window.location.origin}${PUBLICURL}/assets/icons/checked-icon.svg`}
                        alt='Checked Icon'
                      />
                    )}
                    <span style={{ backgroundColor: 'inherit' }}></span>
                  </div>
                  <div className={styles['ce__steps-item-title']}>
                    {channel.platformName}
                  </div>
                </div>
              );
            })}
          {stepInfo.CHANNEL.active && (
            <div
              className={`${styles['ce__steps-item']} ${styles['ce__plus-circle-img']} ${styles['ce__plus-circle-blue-img']}`}
              onClick={() => setManageChannels(true)}
            >
              <div className={`${styles['ce__oval-icon']}`}>
                <AddPlusImage />
                <span className={`${styles['ce__gray-bg-color']}`}></span>
              </div>
              <div
                className={`${styles['ce__steps-item-title']} ${styles['ce__gray-color']}`}
              >
                {stepInfo.CHANNEL.label}
              </div>
            </div>
          )}

          <div className={styles['ce__steps-item']}>
            <div
              className={`${styles['ce__oval-icon']} ${
                stepInfo.FINISH.active
                  ? styles['ce__green-bg-color']
                  : styles['ce__gray-bg-color']
              }`}
            >
              <img
                src={`${window.location.origin}${PUBLICURL}/assets/icons/star-icon.svg`}
                alt='Finish'
              />
            </div>
            <div
              className={`${styles['ce__steps-item-title']}  ${
                stepInfo.FINISH.active
                  ? styles['ce__green-color']
                  : styles['ce__light-black-color']
              }`}
            >
              Finish
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onDropdownSelection = (item, field) => {
    switch (field) {
      case 'kpi':
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          kpiValue: item,
        }));
        break;
      case 'client':
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          clientValue: item,
        }));
        break;
      case 'region':
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          regionValue: item,
        }));
        break;
      default:
        break;
    }
  };

  const generalSection = () => {
    return (
      <>
        <div className={styles['ce__section']}>
          <div className={styles['field-container']}>
            <InputFieldWithLabel
              label='Budget Group Name'
              value={formValues.budgetName}
              onChange={(event) => handleInputChange(event, 'budgetName')}
              placeholder='Name your group'
              isInvalid={formValues.budgetNameError.error}
              errorMsg={formValues.budgetNameError.msg}
              maxLength={25}
              showAsterisk={true}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownFieldWithLabel
              label='KPI'
              showAsterisk={true}
              optionsArray={kpiOptionsArray}
              placeholder='Choose KPI'
              selectedData={formValues.kpiValue}
              onClickHandler={(item) => onDropdownSelection(item, 'kpi')}
            />
          </div>
          <div className={styles['field-container']}>
            <InputFieldWithLabel
              label='Budget'
              value={formValues.budgetValue}
              onChange={(event) => handleInputChange(event, 'budgetValue')}
              placeholder='Define the Budget'
              isInvalid={formValues.budgetValueError.error}
              errorMsg={formValues.budgetValueError.msg}
              maxLength={25}
              showAsterisk={true}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownFieldWithLabel
              label='Client'
              showAsterisk={true}
              optionsArray={dropdownList?.clientOptions}
              placeholder='Choose Client'
              selectedData={formValues.clientValue}
              onClickHandler={(item) => onDropdownSelection(item, 'client')}
            />
          </div>
          <div className={styles['field-container']}>
            <DropdownFieldWithLabel
              label='Region'
              showAsterisk={true}
              optionsArray={dropdownList?.regionOptions}
              placeholder='Choose Region'
              selectedData={formValues.regionValue}
              onClickHandler={(item) => onDropdownSelection(item, 'region')}
            />
          </div>
          <div className={`ce__main-section ${styles['field-container']}`}>
            <div className='user-notification'>User Notification</div>
            <div className='body-section'>
              <DropdownFieldWithLabel
                label='Select Users'
                placeholder='Choose User'
                closeDropdown='outside'
                customDropDownComponent={customDropDownComponent(
                  allUsers?.length > 0,
                  {
                    mainTitle: `${
                      userSearchValue && `No Users matched your search`
                    }`,
                    subTitle: `${
                      userSearchValue && `Try searching for something else`
                    }`,
                  },
                  userSearchValue,
                  onUserSearch,
                  dropdownUserRef,
                  'Users',
                  null,
                  listBodyComponent(
                    allUsers?.length > 0
                      ? allUsers?.map((user) => {
                          return user.email;
                        })
                      : [],
                    onUserSelection,
                    true
                  )
                )}
                disabled={allUsers.length === 0}
              />
            </div>
          </div>
        </div>
        <div className={styles['ce__section']}>
          <div ref={startDateDivRef} className={styles['field-container']}>
            {displayDateField('startDate', 'Start Date')}
          </div>
          <div ref={endDateDivRef} className={styles['field-container']}>
            {displayDateField('endDate', 'End Date')}
          </div>
          <div className={styles['field-container']}>{displayChannels()}</div>

          <div className={`ce__main-section ${styles['field-container']}`}>
            <div className='body-section'>
              <div className='user-list-margin-top'>
                <span className={`selected-entity-label`}>Selected Users</span>
                <div className={`selected-entity-wrapper`}>
                  <div className='selected-entity'>
                    {formValues?.budgetUpdateMailList?.length ? (
                      formValues?.budgetUpdateMailList
                        .split(';')
                        ?.map((item, index) => {
                          return (
                            <div
                              className='chip-wrapper'
                              onClick={(e) => e.stopPropagation()}
                              key={`sc_${index}`}
                            >
                              {displayToolTipField(item, 50)}
                              <img
                                src={`${window.location.origin}${PUBLICURL}/assets/icons/clear-close.svg`}
                                alt='Clear User'
                                className='chip-clear'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUserRemove(item);
                                }}
                              />
                            </div>
                          );
                        })
                    ) : (
                      <span className='selected-entity-placeholder'>
                        Your selected users will show here
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const accountSection = () => {
    return (
      <div className='d-flex flex-column w-100 '>
        <AccountSection
          filterCheckedChannelList={filterCheckedChannelList}
          setFilterCheckedChannelList={setFilterCheckedChannelList}
          clearAccountData={clearAccountData}
          setClearAccountData={setClearAccountData}
          setShowFooterBtns={setShowFooterBtns}
        />
      </div>
    );
  };

  const finalSection = () => {
    return (
      <div className={styles['ce__final-section']}>
        <div className={styles['main-title']}>
          <span>You are almost done!</span>
        </div>
        <div className={styles['content']}>
          {stepInfo.FINISH.data === FIELD_INFO.MANDATORY
            ? `The Budget Group won’t be reflected on “Daily Review” as it has no
          campaigns associated to it`
            : 'Check that all your data is correct before creating a new Budget Group'}
        </div>
        <div className={styles['divider']} />
        {stepInfo.FINISH.data === FIELD_INFO.OPTIONAL && (
          <>
            <div className={styles['channel-title']}>Channels</div>

            {filterCheckedChannelList.map((channel, index) => {
              const totalAccounts = Object.keys(channel.accountDataForChannel)
                ?.length;
              const totalSelectedCampaignsLength = Object.values(
                channel?.accountDataForChannel
              ).reduce(
                (total, account) => total + account.selectedCampaigns.length,
                0
              );
              return (
                <div
                  className={styles['channel-list']}
                  key={`channel_${index}`}
                >
                  <span className={styles['channel-title']}>
                    {channel.platformName}
                  </span>
                  <span
                    className={styles['channel-item']}
                  >{`${totalAccounts} Accounts`}</span>
                  <span
                    className={styles['channel-item']}
                  >{`${totalSelectedCampaignsLength} Campaigns`}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const displayPage = () => {
    const activePage = Object.values(stepInfo).find((page) => page.active);
    const { GENERAL, CHANNEL, FINISH } = SECTION;
    switch (activePage.name) {
      case GENERAL:
        return generalSection();
      case CHANNEL:
        return accountSection();
      case FINISH:
        return finalSection();
      default:
        return generalSection();
    }
  };

  const rightPanel = () => {
    return (
      <div className={styles['ce__right-panel-container']}>{displayPage()}</div>
    );
  };

  const primaryBtnOperation = () => {
    if (disabledField) {
      /* 
        This block is to navigate directly Finish block as there is no changes can be
        made for account section in ongoing budget recommendation group in edit mode
      */
      setStepInfo((prevState) => {
        const newState = { ...prevState };
        Object.keys(newState).forEach((key) => {
          newState[key] = {
            ...newState[key],
            active: key === 'FINISH',
            state: COMPLETION_STATE.FINISH,
            data:
              key === 'FINISH'
                ? filterCheckedChannelList.length
                  ? FIELD_INFO.OPTIONAL
                  : FIELD_INFO.MANDATORY
                : newState[key].data,
          };
        });
        return newState;
      });
      setShowFooterBtns((prevShowFooterBtns) => ({
        ...prevShowFooterBtns,
        primary: {
          show: true,
          state: 'active',
          name: 'Save',
        },
        secondary: {
          show: true,
          state: 'active',
          name: 'Back',
        },
      }));
      if (filterCheckedChannelList.length) {
        setFilterCheckedChannelList((prevChannelList) => {
          const newChannelList = [...prevChannelList];
          newChannelList.forEach((channel, index) => {
            if (index === 0) {
              channel.prevStep =
                newChannelList.length - 1 < 0 ? 0 : newChannelList.length - 1;
              channel.nextStep = newChannelList.length;
            } else {
              delete channel.nextStep;
              delete channel.prevStep;
            }
            channel.state = 'finish';
            delete channel.currentActive;
          });
          return newChannelList;
        });
      }
    } else if (stepInfo.GENERAL.data === FIELD_INFO.OPTIONAL) {
      setStepInfo((prevState) => {
        const newState = { ...prevState };

        Object.keys(newState).forEach((key) => {
          newState[key] = {
            ...newState[key],
            active: key === 'CHANNEL',
            state:
              key === 'CHANNEL'
                ? COMPLETION_STATE.PROGRESS
                : key === 'GENERAL'
                ? COMPLETION_STATE.FINISH
                : newState[key].state,
          };
        });

        return newState;
      });
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
      if (
        filterCheckedChannelList.filter(
          (channel) => channel.state === COMPLETION_STATE.NOT_STARTED
        ).length === filterCheckedChannelList.length
      ) {
        if (validateFields()) {
          updateChannelState.current = false;
          setFilterCheckedChannelList((prevChannelList) => {
            const newChannelList = [...prevChannelList];
            const nextChannelStep = newChannelList.find(
              (channel) => channel.nextStep
            )?.nextStep;
            newChannelList.forEach((channel) => {
              if (
                channel.state === COMPLETION_STATE.NOT_STARTED &&
                nextChannelStep === channel.step &&
                !updateChannelState.current
              ) {
                channel.state = COMPLETION_STATE.PROGRESS;
                channel.currentActive = true;
                updateChannelState.current = true;
                channel.nextStep =
                  channel.step >= newChannelList.length
                    ? channel.step
                    : channel.step + 1;
              }
            });
            return newChannelList;
          });
        }
      } else {
        const channelAccountsDone =
          filterCheckedChannelList?.every(
            (item) => 'accountDataForChannel' in item
          ) &&
          filterCheckedChannelList[filterCheckedChannelList.length - 1]
            .state === COMPLETION_STATE.PROGRESS;

        if (channelAccountsDone) {
          setStepInfo((prevState) => {
            const newState = { ...prevState };
            Object.keys(newState).forEach((key) => {
              newState[key] = {
                ...newState[key],
                active: key === 'FINISH',
                state: COMPLETION_STATE.FINISH,
                data:
                  key === 'FINISH' ? FIELD_INFO.OPTIONAL : newState[key].data,
              };
            });
            return newState;
          });
          setFilterCheckedChannelList((prevChannelList) => {
            const newChannelList = [...prevChannelList];
            newChannelList.forEach((channel, index) => {
              if (index === 0) {
                channel.prevStep =
                  newChannelList.length - 1 < 0 ? 0 : newChannelList.length - 1;
                channel.nextStep = newChannelList.length;
              } else {
                delete channel.nextStep;
                delete channel.prevStep;
              }
              channel.state = 'finish';
              delete channel.currentActive;
            });
            return newChannelList;
          });
          setShowFooterBtns((prevShowFooterBtns) => ({
            ...prevShowFooterBtns,
            primary: {
              show: true,
              state: 'active',
              name: 'Save',
            },
            secondary: {
              show: true,
              state: 'active',
              name: 'Back',
            },
          }));
        } else {
          updateChannelState.current = false;
          setFilterCheckedChannelList((prevChannelList) => {
            const newChannelList = [...prevChannelList];
            const nextChannelStep = newChannelList.find(
              (channel) => channel.nextStep
            )?.nextStep;
            newChannelList.forEach((channel) => {
              if (
                channel.state === COMPLETION_STATE.NOT_STARTED &&
                nextChannelStep === channel.step &&
                !updateChannelState.current
              ) {
                channel.state = COMPLETION_STATE.PROGRESS;
                channel.currentActive = true;
                channel.nextStep =
                  nextChannelStep >= newChannelList.length
                    ? nextChannelStep
                    : channel.step + 1;
                channel.prevStep = channel.step;
                updateChannelState.current = true;
              } else if (channel.state === COMPLETION_STATE.PROGRESS) {
                channel.currentActive = false;
                channel.state = COMPLETION_STATE.FINISH;
                channel.prevStep = channel.step;
                delete channel.nextStep;
              } else {
                delete channel.nextStep;
                delete channel.prevStep;
              }
            });
            return newChannelList;
          });
        }
        setClearAccountData(true);
      }
    } else {
      if (validateFields()) {
        displayFinalWithoutChannel();
      }
    }
  };

  const onSaveBtnClick = () => {
    const {
      budgetName,
      budgetValue,
      kpiValue: { value: kpi },
      clientValue: { value: clientId },
      regionValue: { value: region },
      startDate,
      endDate,
      budgetUpdateMailList,
      clientValue: { label: clientName },
    } = formValues;

    const payload = {
      groupName: budgetName,
      kpi,
      clientId,
      region,
      budgetValue: budgetValue,
      startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
      endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
      campaigns: filterCheckedChannelList
        .flatMap((platform) => Object.values(platform.accountDataForChannel))
        .flatMap((account) => account.selectedCampaigns),
      budgetUpdateMailList: budgetUpdateMailList,
    };

    const payloadForBgDetails = {
      groupName: budgetName,
      kpi,
      clientId,
      clientName,
      region,
      budgetValue: budgetValue,
      budgetUpdateMailList: budgetUpdateMailList,
      isGroupSubscribed: budgetUpdateMailList
        ? budgetUpdateMailList.includes(
            currentUser?.email?.split('@')[0].toString()
          )
        : false,
      startDate: payload.startDate
        ? moment(payload.startDate).format('MM/DD/YYYY')
        : '--',
      endDate: payload.endDate
        ? moment(payload.endDate).format('MM/DD/YYYY')
        : '--',
      campaigns: payload.campaigns,
      allAccounts: Array.from(
        new Set(
          payload.campaigns?.map((element) => {
            return element.accountKey;
          })
        )
      ),
      allPlatforms: Array.from(
        new Set(
          filterCheckedChannelList?.map((element) => {
            return element.platformName;
          })
        )
      ),
    };

    if (editGroupData) {
      payload.groupId = editGroupData.groupId;
      payloadForBgDetails.groupId = editGroupData.groupId;
      payloadForBgDetails.currency_code = editGroupData.currency_code;
    }

    setShowFooterBtns((prevShowFooterBtns) => ({
      ...prevShowFooterBtns,
      primary: {
        show: true,
        state: 'loader',
        name: 'Save',
      },
    }));
    /*
      Need this payload for api failure. So that we can retry this operation
      maximum 3 times on try again button
    */
    copyPayloadRef.current = {
      data: JSON.parse(JSON.stringify(payload)),
      count: 1,
    };
    copyPayloadBgDetailsRef.current = JSON.parse(
      JSON.stringify(payloadForBgDetails)
    );

    saveCampaignGroup(payload)
      .then((data) => {
        const { statusCode } = data;
        if (statusCode === 200) {
          if (editGroupData) {
            dispatch({
              type: BG_DETAILS_GROUP,
              payload: payloadForBgDetails,
            });
            setModalInfo({
              ...MODAL_INFO.EDIT_SUCCESS,
              show: true,
            });
          } else
            setModalInfo({
              ...MODAL_INFO.NEW_SUCCESS,
              show: true,
            });
          copyPayloadRef.current = undefined;
          copyPayloadBgDetailsRef.current = undefined;
        } else {
          setModalInfo({
            ...MODAL_INFO.NEW_EDIT_ERROR,
            show: true,
          });
        }
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'active',
            name: 'Save',
          },
        }));
      })
      .catch((_error) => {
        setModalInfo({
          ...MODAL_INFO.NEW_EDIT_ERROR,
          show: true,
        });
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'active',
            name: 'Save',
          },
        }));
      });
  };

  const onPrimaryBtnClick = () => {
    const { name } = Object.values(stepInfo).find((page) => page.active);
    if (name === SECTION.FINISH) {
      onSaveBtnClick();
    } else if (aggreMentCheckRef.current !== undefined) {
      // if any channel is modified in general section, then update the channel list
      const updateChangedChannelList = JSON.parse(JSON.stringify(channelList));
      updateChangedChannelList.forEach((channel) => {
        if (!channel.checked) {
          delete channel.accountDataForChannel;
        }
        delete channel.showHelperText;
      });
      setChannelList(updateChangedChannelList);
      setCallPrimaryBtnClick(true);
      aggreMentCheckRef.current = undefined;
    } else primaryBtnOperation();
  };

  const onSecondaryBtnClick = () => {
    const activePage = Object.values(stepInfo).find((page) => page.active);
    const { MANDATORY, OPTIONAL } = FIELD_INFO;
    if (activePage) {
      const { name, data } = activePage;
      if (data === MANDATORY && name === SECTION.FINISH) {
        setStepInfo((prevState) => {
          const newState = { ...prevState };
          Object.keys(newState).forEach((key) => {
            newState[key] = {
              ...newState[key],
              active: key === 'GENERAL',
              state:
                key === 'GENERAL'
                  ? COMPLETION_STATE.PROGRESS
                  : COMPLETION_STATE.NOT_STARTED,
            };
          });

          return newState;
        });
        setShowFooterBtns((prevShowFooterBtns) => ({
          ...prevShowFooterBtns,
          primary: {
            show: true,
            state: 'active',
            name: 'Next',
          },
          secondary: {
            show: false,
            state: 'active',
            name: 'Back',
          },
        }));
      } else if (data === OPTIONAL) {
        if (disabledField) {
          // This block is to navigate back to general section from finish block for ongoing budget recommendation group in edit mode
          setStepInfo((prevState) => {
            const newState = { ...prevState };
            Object.keys(newState).forEach((key) => {
              newState[key] = {
                ...newState[key],
                active: key === 'GENERAL',
                state:
                  key === 'GENERAL'
                    ? COMPLETION_STATE.PROGRESS
                    : COMPLETION_STATE.NOT_STARTED,
              };
            });

            return newState;
          });
          setShowFooterBtns((prevShowFooterBtns) => ({
            ...prevShowFooterBtns,
            primary: {
              show: true,
              state: 'active',
              name: 'Next',
            },
            secondary: {
              show: false,
              state: 'active',
              name: 'Back',
            },
          }));
        } else {
          const prevChannelStep = filterCheckedChannelList.find(
            (channel) => channel.prevStep !== undefined
          )?.prevStep;
          const nextChannelStep = filterCheckedChannelList.find(
            (channel) => channel.nextStep
          )?.nextStep;
          if (prevChannelStep === 0) {
            if (name === SECTION.FINISH) {
              setStepInfo((prevState) => {
                const newState = { ...prevState };
                Object.keys(newState).forEach((key) => {
                  newState[key] = {
                    ...newState[key],
                    active: key === 'CHANNEL',
                    state:
                      key === 'CHANNEL'
                        ? COMPLETION_STATE.PROGRESS
                        : key === 'GENERAL'
                        ? COMPLETION_STATE.FINISH
                        : COMPLETION_STATE.NOT_STARTED,
                  };
                });
                return newState;
              });
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
              setFilterCheckedChannelList((prevChannelList) => {
                const newChannelList = [...prevChannelList];
                newChannelList.forEach((channel) => {
                  if (nextChannelStep === channel.step) {
                    channel.currentActive = true;
                    channel.state = COMPLETION_STATE.PROGRESS;
                    channel.nextStep = channel.step;
                    channel.prevStep =
                      channel.step - 1 < 0 ? 0 : channel.step - 1;
                  }
                });
                return newChannelList;
              });
            } else {
              setStepInfo((prevState) => {
                const newState = { ...prevState };
                Object.keys(newState).forEach((key) => {
                  newState[key] = {
                    ...newState[key],
                    active: key === 'GENERAL',
                    state:
                      key === 'GENERAL'
                        ? COMPLETION_STATE.PROGRESS
                        : COMPLETION_STATE.NOT_STARTED,
                  };
                });

                return newState;
              });
              setShowFooterBtns((prevShowFooterBtns) => ({
                ...prevShowFooterBtns,
                primary: {
                  show: true,
                  state: 'active',
                  name: 'Next',
                },
                secondary: {
                  show: false,
                  state: 'active',
                  name: 'Back',
                },
              }));
              const updateManageChannels = JSON.parse(
                JSON.stringify(channelList)
              );
              const mergedFilterAndChannel = updateManageChannels.map(
                (channel) => {
                  const commonChannel = filterCheckedChannelList.find(
                    (filterChannel) =>
                      filterChannel.platformId === channel.platformId
                  );
                  return commonChannel
                    ? { ...channel, ...commonChannel }
                    : channel;
                }
              );
              mergedFilterAndChannel.forEach((channel) => {
                delete channel.showHelperText;
                delete channel.nextStep;
                delete channel.prevStep;
                delete channel.currentActive;
                channel.state = COMPLETION_STATE.NOT_STARTED;
              });
              setChannelList(mergedFilterAndChannel);
            }
          } else {
            setStepInfo((prevState) => {
              const newState = { ...prevState };
              Object.keys(newState).forEach((key) => {
                newState[key] = {
                  ...newState[key],
                  active: key === 'CHANNEL',
                  state:
                    key === 'CHANNEL'
                      ? COMPLETION_STATE.PROGRESS
                      : COMPLETION_STATE.NOT_STARTED,
                };
              });
              return newState;
            });
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
            if (name === SECTION.FINISH) {
              setFilterCheckedChannelList((prevChannelList) => {
                const newChannelList = [...prevChannelList];
                newChannelList.forEach((channel) => {
                  if (nextChannelStep === channel.step) {
                    channel.state = COMPLETION_STATE.PROGRESS;
                    channel.currentActive = true;
                    channel.nextStep = channel.step;
                    channel.prevStep =
                      channel.step - 1 < 0 ? 0 : channel.step - 1;
                  } else {
                    delete channel.nextStep;
                    delete channel.prevStep;
                  }
                });
                return newChannelList;
              });
            } else {
              setFilterCheckedChannelList((prevChannelList) => {
                const newChannelList = [...prevChannelList];
                const prevChannelStep = newChannelList.find(
                  (channel) => channel.prevStep !== undefined
                )?.prevStep;
                newChannelList.forEach((channel) => {
                  if (prevChannelStep === channel.step) {
                    channel.state = COMPLETION_STATE.PROGRESS;
                    channel.currentActive = true;
                    channel.nextStep = channel.step + 1;
                    channel.prevStep =
                      channel.step - 1 < 0 ? 0 : channel.step - 1;
                  } else if (channel.state === COMPLETION_STATE.PROGRESS) {
                    channel.currentActive = false;
                    channel.state = COMPLETION_STATE.NOT_STARTED;
                    delete channel.nextStep;
                    delete channel.prevStep;
                  }
                });
                return newChannelList;
              });
            }
          }
          setClearAccountData(true);
        }
      }
    }
  };

  return formValues ? (
    <div
      key={renderkey}
      style={{
        pointerEvents: showFooterBtns?.primary?.state === 'loader' && 'none',
      }}
    >
      <div className={styles['ce__container']}>
        <div className={styles['ce__title-container']}>
          <div className={styles['ce__title-container-label']}>
            {editGroupData?.groupName
              ? editGroupData.groupName
              : 'Unnamed New Group'}
          </div>
        </div>
        <div className={styles['ce__panel']}>
          {leftPanel()}
          {rightPanel()}
        </div>
      </div>
      <CEFooter
        onPrimaryBtnClick={() => onPrimaryBtnClick()}
        onSecondaryBtnClick={() => onSecondaryBtnClick()}
        onCancelBtnClick={() => {
          if (editGroupData)
            setModalInfo({
              ...MODAL_INFO.CANCEL_EDIT,
              show: true,
            });
          else
            setModalInfo({
              ...MODAL_INFO.CANCEL_NEW,
              show: true,
            });
        }}
        showFooterBtns={showFooterBtns}
      />
      {manageChannels && (
        <ManageChannelModel
          onClose={(flag) => {
            if (flag) manageChannelRef.current = true;
            setManageChannels(false);
          }}
          channelList={channelList}
          setChannelList={setChannelList}
          filterCheckedChannelList={filterCheckedChannelList}
        />
      )}
      {modalInfo?.show && (
        <CustomModal
          open={modalInfo.show}
          onClose={modalInfo.onClose}
          onAccept={() => modalInfo.onBtnClick()}
          title={modalInfo.title}
          onSaveText={modalInfo.onSaveText}
          onCloseText={modalInfo.onCloseText}
          isGroove={true}
          isSmallModal={true}
          actionType={modalInfo.actionType}
          customSecondaryAction={modalInfo.customSecondaryAction}
        >
          <span>{modalInfo.content}</span>
        </CustomModal>
      )}
    </div>
  ) : (
    <SkeletonLoaderComponent />
  );
};

export default CreateEditMainContainer;
