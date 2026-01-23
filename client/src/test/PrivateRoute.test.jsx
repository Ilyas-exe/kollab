import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PrivateRoute from '../components/PrivateRoute.jsx';

const useAuthMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

describe('PrivateRoute', () => {
  it('shows loading state while auth is loading', () => {
    useAuthMock.mockReturnValue({ token: null, loading: true });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuthMock.mockReturnValue({ token: 'token', loading: false });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    useAuthMock.mockReturnValue({ token: null, loading: false });

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
