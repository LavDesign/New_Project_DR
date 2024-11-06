import React from 'react';
import NotFound from 'views/NotFound/NotFound';
import { render } from '@testing-library/react';

describe('Not Found Component', () => {
  test('Rendering the component', () => {
    render(<NotFound />);
  });
});
