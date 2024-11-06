import React from 'react';
import CampaignTableSelector, { Table } from 'views/shared/CampaignSelector';
import {
  customRenderComponent, renderComponent, render
} from '_testhelpers/test-utils';


let selectedAccountData = {
  accountKey: '5118073839',
  parentKey: "login-customer-id:8141487271",
  currencyCode: "USD",
  id: 0,
  name: "",
  platformId: 4,
  userId: 3
};

describe('CampaignTableSelector Component', () => {

  test('Rendering Table', async () => {
    customRenderComponent(<Table
      viewCode='Dash'
      tab='0'
      onCheckboxChange={() => { }}
      selectedAccount={selectedAccountData}
    />);
  });
});
