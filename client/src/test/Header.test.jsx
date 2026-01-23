import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Header from '../components/Header.jsx';

const useAuthMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

describe('Header', () => {
  it('renders user info when authenticated', async () => {
    const logout = vi.fn();
    const apiClient = { get: vi.fn().mockResolvedValue({ data: { notifications: [] } }) };

    useAuthMock.mockReturnValue({
      user: { name: 'Ilyas', role: 'Client' },
      logout,
      apiClient,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(await screen.findByText('Ilyas')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
