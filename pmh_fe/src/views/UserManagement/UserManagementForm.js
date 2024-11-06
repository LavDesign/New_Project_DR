import { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllRoles, getAllAbilities,getAllClients} from '../../_services/userManagement';
import { getRolesInfoById } from '../../_helpers/Utils/rolesInfo';
import { trackButtonClick, pageSubCategory } from '_helpers/Utils/segmentAnalyticsUtil';
import Multiselect from 'multiselect-react-dropdown'; 
import styles from '../../_theme/modules/UserManagement/UserManagementForm.module.css'

const checkIfValid = (inputName, arr) => {
  return arr.filter(elem => elem === inputName).length === 0;
};

const UserManagementForm = props => {
  const { t } = useTranslation(['common']);
  const editUserData = props.editUserData;
  const [email, setEmail] = useState(editUserData && editUserData.email);
  const [allRoles, setAllRoles] = useState([]);
  const [allAbilities, setAllAbilities] = useState([]);
  const emailIsValid = useMemo(() => props.invalidInputs.length === 0 || checkIfValid('email', props.invalidInputs), [props.invalidInputs]);
  const roleIsValid = useMemo(() => props.invalidInputs.length === 0 || checkIfValid('role', props.invalidInputs), [props.invalidInputs]);
  const [allClients, setAllClients] = useState([]);
  const [selectedClientsEditUser, setSelectedClientsEditUser] = useState([]);
  
  useEffect(() => {

    let selectedRole;
    getAllRoles()
      .then(roles => {
        props.setAllRoles(roles);
        setAllRoles(roles.map(role => {

          if (!selectedRole && editUserData)
            selectedRole = editUserData.userRoleList?.find(x => x.roleId === 1) || editUserData.userRoleList?.find(x => x.roleId === role.roleId);

          if (selectedRole)
            props.setSelectedRole(selectedRole.roleId.toString());
          return {
            ...getRolesInfoById(role?.roleId),
            checked: editUserData?.userRoleList?.some(x => x.roleId === role.roleId),
          }
        }));
      });

    let selectedAbilities = [];
    getAllAbilities()
      .then(abilities => {
        props.setAllAbilities(abilities);
        setAllAbilities(abilities.map(ability => {

          if (editUserData && editUserData.userAbilitiesList.find(x => x.abilityId === ability.abilityId))
            selectedAbilities.push(ability.abilityId);
          return {
            id: ability.abilityId,
            name: ability.abilityName,
            checked: editUserData && editUserData.userAbilitiesList && editUserData.userAbilitiesList.some(x => x.abilityId === ability.abilityId),
            tag: ability && ability.abilityName ? ability.abilityName.toLowerCase().replaceAll(' ', '_') : ''
          }
        }))
      }
      );

    props.setSelectedAbilities(selectedAbilities);

    let selectedClients = [];
    let editSelectedValues = [];
   
    getAllClients()
      .then(clients => {
        props.setAllClients(clients);
         setAllClients(clients.map(client => {
         if (editUserData && editUserData.userClientList.find(x => x.clientId === client.clientId))
         {
           // to store the selected client ids to pass in to the api
            selectedClients.push(client.clientId);
            props.setSelectedClients(selectedClients);

            // to store the selected client ids and names to display in the multiselect dropdown during edit user
            editSelectedValues.push({id:client.clientId,name:client.clientName});
            setSelectedClientsEditUser(editSelectedValues);
                  
         }
           return {
             id: client.clientId,
             name: client.clientName
         }
         }))
      }
      );
      

  }, []);

  const onRoleSelectionChangedHandler = (name) => (event) => {
    var mode = (!editUserData) ? 'Add User' : 'Edit User';
    trackButtonClick(t(`selector_texts.roles.${name}`), `${pageSubCategory.userManagementModal} - ${mode}`, 'Check Box')
    props.setSelectedRole(event.target.value);
    let x = allRoles.map(role => {
      if (role.id === parseInt(event.target.value))
        role.checked = true;
      else role.checked = false;
      return role;
    })
    setAllRoles(x);

  }

  const onClientSelectionHandler = () => (selectedList, selectedItem) => {
    var mode = (!editUserData) ? 'Add User' : 'Edit User';
   let clients=[];
    trackButtonClick(selectedItem.name, `${pageSubCategory.userManagementModal} - ${mode}`, 'Check Box')
    selectedList.map(x => {  clients.push(x.id); })
    props.setSelectedClients(clients);
  }

  const onClientRemovalHandler = () => (selectedList, removedItem) => {
    var mode = (!editUserData) ? 'Add User' : 'Edit User';
   let clients=[];
    trackButtonClick(removedItem.name, `${pageSubCategory.userManagementModal} - ${mode}`, 'Remove client')
    selectedList.map(x => {  clients.push(x.id); })
    props.setSelectedClients(clients);
  }

  const onAbilitySelectionChangedHandler = (name) => (event) => {
    var mode = (!editUserData) ? 'Add User' : 'Edit User';
    trackButtonClick(name, `${pageSubCategory.userManagementModal} - ${mode}`, 'Check Box')
    let abilities = [];
    allAbilities.map(x => {
      if (x.id === parseInt(event.target.value))
        x.checked = event.target.checked
      if (x.checked) abilities.push(x.id);
      return x;
    })

    props.setSelectedAbilities(abilities);
  };

  const customStyles = {
    chips:{ background:'black'
  }

  }
  return (
    <>
      <div className="row">
        {props.serverSideErrorMsg && <div style={{ display: 'block' }} id="validationServerUsernameFeedback" className="invalid-feedback">{props.serverSideErrorMsg}</div>}
        <div className="col-md-6">
          <label htmlFor="user-email" className={`form-label ${styles['groove_label_text']}`}>{t('site_texts.email') + '*'}</label>
          <input placeholder={t('site_texts.email_placeholder')} type="email" className={`form-control ${styles['groove_textbox']}  ${!emailIsValid ? 'is-invalid' : ''}`} id="user-email" value={email} ref={props.emailReference} />
          {!emailIsValid && <div id="validationServerUsernameFeedback" className="invalid-feedback">{t('validation_messages.email_required')}</div>}
        </div>
      </div>
      <br/>
      <div className="row">
        <div className="col-md-6">
          <label 
          htmlFor="user-client" 
          className={`form-label ${styles['groove_label_text']}`}>{t('site_texts.clients')}
          </label>
         
          <Multiselect  
          style={customStyles} 
          options={allClients} 
          displayValue="name" 
          onSelect={onClientSelectionHandler()} 
          onRemove={onClientRemovalHandler()} 
          selectedValues={selectedClientsEditUser} 
          showCheckbox="true" 
          emptyRecordMsg='No clients available' 
          />
        
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="row mt-3 mb-2">
            <h4 className={`mb-0 ${styles['groove_label_text']}`}>{t('site_texts.role') + '*'}</h4>
            {!roleIsValid && <p className='text-danger mb-0' style={{ 'fontSize': '0.875em' }}>{t('validation_messages.role_required')}</p>}
          </div>
          <div className='row ms-1'>
            {allRoles.map((role) => {
              return role.name ? (
                <div key={role.id} className='form-check'>
                  <input
                    type='radio'
                    checked={role.checked}
                    className={`form-check-input ${styles['groove_radio']} ${roleIsValid ? '' : 'is-invalid'
                      }`}
                    id={role.id}
                    name='role'
                    value={role.id}
                    onChange={onRoleSelectionChangedHandler(role.name)}
                  />
                  <label className={`form-check-label ${styles['groove_radio_label']}`} htmlFor={role.id}>
                    {t(`selector_texts.roles.${role.name}`)}
                  </label>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="col-md-6">
          <div className="row mt-3 mb-2">
            <h4 className={`mb-0 ${styles['groove_label_text']}`}>{t('site_texts.additional_abilities')}</h4>
          </div>
          <div className="row ms-2">
            {allAbilities.map(ability => (
              <div key={ability.id} className="form-check">
                <input type="checkbox" className={`form-check-input ${styles['groove_checkbox']}`} checked={ability.checked} id={ability.id} value={ability.id} onChange={onAbilitySelectionChangedHandler(ability.name)} />
                <label className={`form-check-label ${styles['groove_checkbox_label']}`} htmlFor={ability.id}>{t(`selector_texts.abilities.${ability.tag}`)}</ label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
};

export default UserManagementForm;