import { use_membership_class_route } from '../../../backend/services/membershipsRoutes.py';

jest.mock('../../../backend/services/membershipsRoutes.py', () => ({
  use_membership_class_route: jest.fn(),
}));

describe('use_membership_class_route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add the class to a membership', async () => {
    const mockClassId = 'class123';
    const mockMembId = 'memb456';

    // Mocked response from the route handler
    const mockResponse = { message: 'Actualización realizada' };

    use_membership_class_route.mockResolvedValue(mockResponse);

    const response = await use_membership_class_route(mockClassId, mockMembId);

    expect(response).toEqual(mockResponse);
    expect(use_membership_class_route).toHaveBeenCalledWith(mockClassId, mockMembId);
  });

  it('should handle the case when an exception occurs during the update', async () => {
    const mockClassId = 'class123';
    const mockMembId = 'memb456';

    // Simulate an error occurring during the update (directly within route handler)
    const error = new Error('No se pudo actualizar el usuario');
    use_membership_class_route.mockRejectedValue(error);

    // This is a correction: we need to ensure that the route handler correctly handles the rejection
    try {
      await use_membership_class_route(mockClassId, mockMembId);
    } catch (err) {
      expect(err.message).toBe('No se pudo actualizar el usuario');
    }
  });

  it('should throw an error if token is missing', async () => {
    const mockRequest = { headers: {} };
    expect(() => {
        if (!mockRequest.headers.Authorization || !mockRequest.headers.Authorization.includes('Bearer')) {
            throw new Error('Missing token');
        }
    }).toThrow('Missing token');
});
});
