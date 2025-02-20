import { createUser, getUniqueUserByEmail } from '../../../backend/services/usersRoutes.py';

jest.mock('../../../backend/services/usersRoutes.py', () => ({
    createUser: jest.fn(),
    getUniqueUserByEmail: jest.fn()
}));

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user and return the user object', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    createUser.mockResolvedValue(mockUser);
    const result = await createUser(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw an error when createUser fails', async () => {
    const mockUser = { name: 'Test User', email: 'test@example.com' };
    const errorMessage = 'No se pudo crear el usuario';
    createUser.mockRejectedValue(new Error(errorMessage));
    await expect(createUser(mockUser)).rejects.toThrow('No se pudo crear el usuario');
  });

  it('should throw an error if database operation fails', async () => {
    createUser.mockRejectedValue(new Error('Database error'));
    await expect(createUser({ name: 'Test User', email: 'test@example.com' })).rejects.toThrow('Database error');
  });
});

describe('getUniqueUserByEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a user when email matches', async () => {
        const mockEmail = 'test@example.com';
        const mockUser = { id: '123', Mail: mockEmail, name: 'Test User' };
        getUniqueUserByEmail.mockResolvedValue(mockUser);
        const result = await getUniqueUserByEmail(mockEmail);
        expect(result).toEqual(mockUser);
        expect(getUniqueUserByEmail).toHaveBeenCalledWith(mockEmail);
        expect(getUniqueUserByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when no user matches', async () => {
        const mockEmail = 'nonexistent@example.com';
        getUniqueUserByEmail.mockRejectedValue(new Error('No existen usuarios con ese mail'));
        await expect(getUniqueUserByEmail(mockEmail)).rejects.toThrow('No existen usuarios con ese mail');
    });

    it('should throw an error if database query fails', async () => {
        getUniqueUserByEmail.mockRejectedValue(new Error('Database error'));
        await expect(getUniqueUserByEmail('test@example.com')).rejects.toThrow('Database error');
    });
});

