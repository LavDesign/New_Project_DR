import React from 'react';
import PlatformSection from 'views/PlatformAuthentication/PlatformSection';
import {
  customRenderComponent,
} from '_testhelpers/test-utils';


describe('PlatformSection Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<PlatformSection />);
  });

});




