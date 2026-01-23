import { jest } from '@jest/globals';

const saveMock = jest.fn();
const NotificationMock = jest.fn(() => ({ save: saveMock }));

await jest.unstable_mockModule('../models/Notification.js', () => ({
  default: NotificationMock,
}));

const { createNotification } = await import('../utils/notificationService.js');

describe('createNotification', () => {
  afterEach(() => {
    NotificationMock.mockClear();
    saveMock.mockClear();
  });

  it('does not create a notification when required fields are missing', async () => {
    await createNotification(null, 'text', '/link');

    expect(NotificationMock).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('creates and saves a notification when all fields exist', async () => {
    await createNotification('user-id', 'New notification', '/projects/1');

    expect(NotificationMock).toHaveBeenCalledWith({
      recipient: 'user-id',
      text: 'New notification',
      link: '/projects/1',
    });
    expect(saveMock).toHaveBeenCalled();
  });
});
