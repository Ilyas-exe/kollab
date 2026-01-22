import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';

describe('LandingPage', () => {
  it('renders the main headline', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /collaborate seamlessly/i })
    ).toBeInTheDocument();
  });
});
