import React from 'react';
import PlatformAuthentication from 'views/PlatformAuthentication/PlatformAuthentication';
import {
  customRenderComponent, renderComponent,
} from '_testhelpers/test-utils';

describe('AccountAssociation Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<PlatformAuthentication />);
  });
});
