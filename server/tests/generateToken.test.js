import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';

describe('generateToken', () => {
  it('creates a JWT with the user id payload', () => {
    process.env.JWT_SECRET = 'test-secret';

    const token = generateToken('user-123');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.id).toBe('user-123');
  });
});
