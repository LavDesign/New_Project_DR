import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { StoreContext } from '_helpers/storeContext';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  BrowserRouter as Router,
} from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { userRes } from './mockReponse';
import { SelectedCampaignsContext } from '_helpers/SelectedCampaignsContext';
import { UserInfoContext } from '_helpers/userInfoContext';
import { UserViewsContext } from '_helpers/userViewsContext';
import { createMemoryHistory } from 'history';
import commonReducer from 'common/Redux/Reducers/commonReducer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const contextSelection = (children, type, contextValue) => {
  switch (type) {
    case 'sc':
      return (
        <SelectedCampaignsContext.Provider value={contextValue}>
          {children}
        </SelectedCampaignsContext.Provider>
      );
    case 'store':
      return (
        <StoreContext.Provider value={contextValue}>
          {children}
        </StoreContext.Provider>
      );
    case 'ui':
      return (
        <UserInfoContext.Provider value={contextValue}>
          {children}
        </UserInfoContext.Provider>
      );
    case 'uv':
      return (
        <UserViewsContext.Provider value={contextValue}>
          {children}
        </UserViewsContext.Provider>
      );
  }
};

export const renderComponent = (
  componentToTest,
  {
    route = ['/'],
    history = createMemoryHistory({ initialEntries: route }),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return <Router history={history}>{children}</Router>;
  }
  window.history.pushState({}, 'Test page', route);

  // Return an object with the store and all of RTL's query functions
  return {
    user: userEvent.setup(),
    ...render(componentToTest, { wrapper: Wrapper, ...renderOptions }),
  };
};

/*
  Below function to be used if your component is using context or any loader data 
  otherwise use the above function renderComponent
*/
export const customRenderComponent = (
  componentToTest,
  {
    route = <Route element={<Outlet />} exact={true} path='/' />,
    type = 'store',
    contextValue = { store: {}, setStore: {} },

    ...renderOptions
  } = {}
) => {
  const routes = createRoutesFromElements(route);

  const router = createBrowserRouter(routes);

  const Wrapper = ({ children }) => {
    return (
      <RouterProvider router={router}>
        {contextSelection(children, type, contextValue)}
      </RouterProvider>
    );
  };

  // Return an object with the store and all of RTL's query functions
  return {
    user: userEvent.setup(),
    ...render(componentToTest, { wrapper: Wrapper, ...renderOptions }),
  };
};

/*
  Below function to be used if your component is using redux 
*/

export const customRenderComponentWithRedux = (
  componentToTest,
  {
    initialState = {},
    reducer = commonReducer,
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer, initialState }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  // Return an object with the store and all of RTL's query functions
  return {
    user: userEvent.setup(),
    store,
    ...render(componentToTest, { wrapper: Wrapper, ...renderOptions }),
  };
};
export const mockServerSetup = (handler) => {
  let server;
  // Default responses of some common api:-
  const defaultApis = [
    http.get(`${import.meta.env.VITE_API}/user`, () => {
      return new HttpResponse(null, {
        status: 200,
        json: userRes
      })
    }),
  ];
  if (handler) {
    if (!server) {
      server = setupServer(...handler, ...defaultApis);
    }
  } else {
    server = setupServer(...defaultApis);
  }

  return server;
};
