import { jest } from '@jest/globals';

const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));

await jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

const { default: sendEmail } = await import('../utils/sendEmail.js');

describe('sendEmail', () => {
  beforeEach(() => {
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'test-pass';
  });

  afterEach(() => {
    sendMailMock.mockClear();
    createTransportMock.mockClear();
  });

  it('sends an email with the provided options', async () => {
    await sendEmail({
      email: 'recipient@example.com',
      subject: 'Test Subject',
      message: '<p>Hello</p>',
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'test@example.com',
        pass: 'test-pass',
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'Kollab <test@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Hello</p>',
    });
  });
});
