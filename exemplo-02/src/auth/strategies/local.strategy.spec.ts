import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data for valid credentials', async () => {
      // Arrange
      const username = 'admin';
      const password = 'admin123';
      const expectedUser = {
        id: '1',
        username: 'admin',
      };

      mockAuthService.validateUser.mockResolvedValue(expectedUser);

      // Act
      const result = await strategy.validate(username, password);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
      expect(mockAuthService.validateUser).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      const username = 'wronguser';
      const password = 'wrongpassword';

      mockAuthService.validateUser.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(username, password)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(username, password)).rejects.toThrow('Credenciais inválidas');
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should throw UnauthorizedException when authService returns null', async () => {
      // Arrange
      const username = 'admin';
      const password = 'wrongpassword';

      mockAuthService.validateUser.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(username, password)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should handle service errors', async () => {
      // Arrange
      const username = 'admin';
      const password = 'admin123';

      mockAuthService.validateUser.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(strategy.validate(username, password)).rejects.toThrow('Service error');
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(username, password);
    });
  });
});
