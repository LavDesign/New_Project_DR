import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'common/Redux/store';

export function renderWithProviders(component) {
  return render(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>
  );
}
