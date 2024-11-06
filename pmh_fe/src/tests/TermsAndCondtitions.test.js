import React from 'react';
import { render } from '@testing-library/react';
import TermsAndConditions from 'views/TermsAndConditions/TermsAndConditions';

describe('Terms And Conditions Component', () => {
  test('Rendering the component', () => {
    render(<TermsAndConditions/>);
  });
});
