import React from 'react';
import UserManagement from 'views/UserManagement/UserManagement';
import {
  customRenderComponent,
} from '_testhelpers/test-utils';
import CustomButton from 'views/UI/CustomButton';


describe('UserManagement Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<UserManagement />);
  });

  test('CustomButton component rendering', () => {
    customRenderComponent(<CustomButton />);
  });

});
