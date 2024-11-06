import React from 'react';
import UserManagementTable from 'views/UserManagement/UserManagementTable';
import { customRenderComponent } from '_testhelpers/test-utils';
import CustomButton from 'views/UI/CustomButton';
import { getUserManagementRes } from '_testhelpers/mockReponse';


const userManagementTable = (
  <UserManagementTable data={getUserManagementRes} />
);

describe('UserManagementTable Component', () => {

  test('Rendering the UserManagementTable component', () => {
    customRenderComponent(userManagementTable);
  });


  test('Check whether the Close button is present in table', () => {
    customRenderComponent(<CustomButton />);
  });
});
