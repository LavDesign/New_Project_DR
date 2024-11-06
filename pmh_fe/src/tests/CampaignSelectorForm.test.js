import React from 'react';
import CampaignSelectorForm from 'views/shared/CampaignSelectorForm';
import {
  customRenderComponent, renderComponent,
} from '_testhelpers/test-utils';

describe('CampaignSelectorForm Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<CampaignSelectorForm />);
  });
});
