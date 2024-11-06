import React from 'react';
import CampaignDash, {
  campaignDashLoader,
} from 'views/campaignDash/CampaignDash';
import {
  customRenderComponent,
  mockServerSetup,
} from '_testhelpers/test-utils';
import { Route } from 'react-router-dom';
import { HttpResponse, http } from 'msw'
import {
  getCampaignDashRes,
  getColumnsInfoRes,
} from '_testhelpers/mockReponse';

const baseURL = import.meta.env.VITE_API;

const handlers = [
  http.get(`${baseURL}/campaigndash/getcampaigndash`, () => {
    return new HttpResponse(null, {
      status: 200,
      json: getCampaignDashRes
    })
  }),
  http.post(`${baseURL}/campaigndash/getcolumnsinfo`, () => {
    return new HttpResponse(null, {
      status: 200,
      json: getColumnsInfoRes
    })
  }),
];

const serverInstance = mockServerSetup(handlers);

const routeJSX = (
  <Route
    element={<CampaignDash />}
    exact={true}
    path='/management'
    loader={async () => campaignDashLoader()}
  />
);

beforeAll(() => {
  serverInstance.listen({
    onUnhandledRequest: 'bypass',
  });
});

afterEach(() => {
  serverInstance.resetHandlers();
});

afterAll(() => serverInstance.close());

describe('CampaignDash Component', () => {
  test('Rendering the component', async () => {
    customRenderComponent(<CampaignDash />, { route: routeJSX });
  });
});
