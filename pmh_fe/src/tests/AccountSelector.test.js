import React from 'react';
import AccountSelector from 'views/shared/AccountSelector';
import {
  customRenderComponent, renderComponent,
} from '_testhelpers/test-utils';

describe('AccountSelector Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<AccountSelector />);
  });

});
