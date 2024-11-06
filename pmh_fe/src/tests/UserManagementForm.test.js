import React from 'react';
import UserManagementForm from 'views/UserManagement/UserManagementForm';
import { customRenderComponent } from '_testhelpers/test-utils';

describe('UserManagementForm Component', () => {

  test('Rendering the UserManagementForm component', () => {
    customRenderComponent(<UserManagementForm />);
  });

});
