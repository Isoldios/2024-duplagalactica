import { getUser } from '../../firestoreService';

jest.mock('../../firestoreService', () => ({
    getUser: jest.fn()
}));

describe('getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when password and email match', async () => {
    const mockPassword = 'securepassword';
    const mockEmail = 'test@example.com';
    const mockUser = [{ id: '123', password: mockPassword, mail: mockEmail, name: 'Test User' }];

    getUser.mockResolvedValue(mockUser);
    const result = await getUser(mockPassword, mockEmail);

    expect(result).toEqual(mockUser);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('id', '123');
    expect(result[0]).toHaveProperty('password', 'securepassword');
    expect(result[0]).toHaveProperty('mail', 'test@example.com');
    expect(result[0]).toHaveProperty('name', 'Test User');
  });
});
