import { useState, useRef, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';

import styles from '../../_theme/modules/UserManagement/UserManagement.module.css'
import CustomButton from '../UI/CustomButton';
import CustomModal from '../UI/CustomModal';
import UserManagementTable from './UserManagementTable';
import UserManagementForm from './UserManagementForm';
import { userManagementColumns } from '../../_helpers/columns/userManagement';
import { addUser, removeUser, getListOfUsers } from '../../_services/userManagement';
import { useStore } from "../../_helpers/storeContext";
import { history } from '../../_helpers/history';
import { useNavigate } from "react-router-dom";
import { getRolesInfoById, rolesInfo } from '_helpers/Utils/rolesInfo';
import { validateEmail } from "../../_helpers/Utils/utils";
import { trackButtonClick, pageSubCategory, pageCategory, setCurrentPageCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const UserManagement = () => {
  const navigate = useNavigate();
  const { store, setStore } = useStore();
  const currentUser = store.currentUser;

  const { t } = useTranslation(['common']);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const columns = [...userManagementColumns()];
  const emailRef = useRef();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedAbilities, setSelectedAbilities] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [editUserData, setEditUserData] = useState([]);
  const [isUpdatedUser, setIsUpdatedUser] = useState(false);
  const [allRoles, setAllRoles] = useState();
  const [allAbilities, setAllAbilities] = useState();
  const [allClients, setAllClients] = useState([]);
  const [serverSideErrorMsg, setServerSideErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const updateUsersData = (data) => {
    if (data.length) {
      const updateUsers = data.map(user => {
        return {
          ...user,
          userRoleList: user?.userRoleList.map(role => {
            const roleInfo = getRolesInfoById(role?.roleId);
            return {
              ...role,
              roleName: roleInfo?.name ? t(`selector_texts.roles.${roleInfo?.name}`) : "",
            }
          })
        }
      });
      setUsersData(updateUsers);
    }
  };

  useEffect(() => {
    getListOfUsers().then(data => updateUsersData(data));

    return () => {
      // To reset the page category when the component is unmounted
      setCurrentPageCategory(null);
    };
  }, []);

  const onStartAddingUserHandler = () => {
    trackButtonClick(t('button_text.add_user'), pageCategory.managementTable)
    setServerSideErrorMsg('');
    setEditUserData(null);
    setModalOpen(true);
    setIsUpdatedUser(false);
  };

  const onCloseModalHandler = () => {
    setModalOpen(false);
    setInvalidInputs([]);
    setSelectedRole([]);
    setSelectedAbilities([]);
    setSelectedClients([]);
  };

  const onCancelModalHandler = () => {
    var mode = (isUpdatedUser === false) ? 'Add User' : 'Edit User';
    trackButtonClick(t('button_text.cancel'), `${pageSubCategory.userManagementModal} - ${mode}`)
    setModalOpen(false);
    setInvalidInputs([]);
    setSelectedRole([]);
    setSelectedAbilities([]);
    setSelectedClients([]);
  };


  const validateInputs = () => {
    let validationArray = [];
    if (!(emailRef.current.value && validateEmail(emailRef.current.value))) {
      validationArray = [...validationArray, 'email'];
    }

    if (selectedRole === null) {
      validationArray = [...validationArray, 'role'];
    }

    return validationArray;
  };

  const getRoleObj = (selectedRole) => {
    let role;
    if (parseInt(selectedRole) === 1) {
      return role = { roleId: 1, roleName: 'SuperAdmin' }
    } else
      return role = allRoles.find(role => role.roleId === parseInt(selectedRole));
  }

  const getClientsObj = (selectedClients) => {
    let clientsArr = [];
    allClients.map(client => {
      if (selectedClients.some(x => x === client.clientId))
        clientsArr.push({ clientId: client.clientId, clientName: client.clientName });
    })
    return clientsArr;
  }

  const getAbilitiesObj = (selectedAbilities) => {
    let abilitiesArr = [];
    allAbilities.map(ability => {
      if (selectedAbilities.some(x => x === ability.abilityId))
        abilitiesArr.push({ abilityId: ability.abilityId, abilityName: ability.abilityName });
    })
    return abilitiesArr;

  }

  const onSubmitUserHandler = () => {
    var mode = (isUpdatedUser === false) ? 'Add User' : 'Edit User';
    trackButtonClick(t('button_text.ok'), `${pageSubCategory.userManagementModal} - ${mode}`)
    setIsLoading(true);
    setServerSideErrorMsg('');
    const validationArray = validateInputs();

    if (validationArray.length > 0) {
      setInvalidInputs([...validationArray]);
      setIsLoading(false);
      return;
    }

    setInvalidInputs([]);

    addUser(
      {
        isUpdated: isUpdatedUser,
        newUser: {
          emailList: [emailRef.current.value],
          userRoleIdList: [...selectedRole],
          userAbilitiesIdList: selectedAbilities,
          UserClientIdList: selectedClients
        }
      }
    ).then(result => {
      if (result.statusCode !== 200) {
        setServerSideErrorMsg(result.statusDescription);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onCloseModalHandler();
        const currentUser = store.currentUser;
        if (currentUser && emailRef && emailRef.current && currentUser.email === emailRef.current.value) {
          const selectedRoleObj = getRoleObj(selectedRole);
          const selectedAbilitiesObj = getAbilitiesObj(selectedAbilities);
          const selectedClientsObj = getClientsObj(selectedClients);
          currentUser.userRoleList = [selectedRoleObj];
          currentUser.userAbilitiesList = selectedAbilitiesObj;
          currentUser.userClientList = selectedClientsObj;
          setStore({ currentUser: currentUser });

          if (parseInt(selectedRole) === 2) {
            history.push('/platform-auth');
            navigate('/platform-auth');
          } else
            getListOfUsers().then(data => setUsersData(data));
        } else
          getListOfUsers().then(data => setUsersData(data));
      }
    });
  }

  const onRemoveUser = () => {
    trackButtonClick(t('button_text.ok'), `${pageSubCategory.userManagementModal} - Remove User`)
    removeUser({ id: userToRemove })
      .then(result => {
        setUserToRemove(null);
        getListOfUsers().then(data => updateUsersData(data));
      });
  };

  const onCancelRemove = () => {
    trackButtonClick(t('button_text.cancel'), `${pageSubCategory.userManagementModal} - Remove User`)
    setUserToRemove(null);
  };

  const onStartRemoving = userId => {
    trackButtonClick(t('site_titles.remove_user'), pageCategory.userManagement)
    setUserToRemove(userId);
  };

  const onStartEditUser = (user) => {
    trackButtonClick(t('button_text.edit'), pageCategory.userManagement)
    setIsLoading(false);
    setServerSideErrorMsg('');
    setEditUserData(user);
    setModalOpen(true);
    setIsUpdatedUser(true);
  }

  const isSuperAdmin = currentUser?.userRoleList.some(x => x.roleId === rolesInfo.superadmin.id);

  return (
    <div className={`${styles['groove_parent_div']}`}>
      <div className={`p-2 ${styles['main-container']} ${styles['groove_main_container']}`}>
        <CssBaseline />
        <div style={{ 'width': '100%', 'display': 'inline-flex' }}>
          <h2 className={`${styles['groove_heading']}`}>{t('site_titles.amc_users')}</h2>
          {isSuperAdmin &&
            <div style={{ 'width': '50%' }} className='d-flex justify-content-end'>
              <CustomButton
                className={`${styles['groove_add_user_button']}`}
                onClick={onStartAddingUserHandler}>
                <div className='d-flex flex-row align-items-center'>
                  <img src={`${window.location.origin}${PUBLICURL}/assets/icons/plus.png`}
                    className='me-1' style={{ 'width': '16px', 'height': '16px' }} />
                  {t('button_text.add_user')}
                </div>
              </CustomButton>
            </div>
          }
        </div>
        <h4 className={`${styles['groove_manage_user_heading']}`}>{t('site_texts.manage_users')}</h4>

        {modalOpen && <CustomModal
          open={modalOpen}
          onClose={onCancelModalHandler}
          onAccept={onSubmitUserHandler}
          title={t('site_titles.user_info')}
          onSaveText={t('button_text.ok')}
          onCloseText={t('button_text.cancel')}
          showLoaderButton={isLoading}
          disabledCancelButton={isLoading}
          isGroove={true}>
          <UserManagementForm
            emailReference={emailRef}
            invalidInputs={invalidInputs}
            setSelectedRole={setSelectedRole}
            setSelectedAbilities={setSelectedAbilities}
            setSelectedClients={setSelectedClients}
            onSubmitUserData={onSubmitUserHandler}
            editUserData={editUserData}
            setAllRoles={setAllRoles}
            setAllAbilities={setAllAbilities}
            setAllClients={setAllClients}
            serverSideErrorMsg={serverSideErrorMsg}
          />
        </CustomModal>}
        {userToRemove !== null && <CustomModal
          open={userToRemove !== null}
          onClose={onCancelRemove}
          onAccept={onRemoveUser}
          title={t('site_titles.remove_user')}
          onSaveText={t('button_text.yes_remove')}
          onCloseText={t('button_text.no_cancel')}
          isGroove={true}
          isSmallModal={true}
          actionType='delete'
        >
          <h4 className={`${styles['groove_remove_user_text']}`}>{t('site_texts.remove_view_desc')}</h4>
        </CustomModal>}
        <div className='mt-2'>
          <UserManagementTable
            columns={columns}
            data={usersData}
            onRemoveUser={onStartRemoving}
            onEditUser={onStartEditUser} />
        </div>
      </div >
    </div >
  )
};

export default UserManagement;