import React from 'react';
import CampaignSelector from 'views/shared/CampaignSelector';
import {
  customRenderComponent, renderComponent,
} from '_testhelpers/test-utils';

describe('CampaignSelector Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<CampaignSelector />);
  });
});
