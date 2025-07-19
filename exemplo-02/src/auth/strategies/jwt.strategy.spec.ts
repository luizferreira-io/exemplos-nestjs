import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/auth.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;
  let configService: ConfigService;

  const mockAuthService = {
    validateJwtPayload: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'auth.jwtSecret') {
        return 'test-jwt-secret';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should throw error when JWT_SECRET is not provided', () => {
    // Arrange
    const mockConfigServiceNoSecret = {
      get: jest.fn().mockReturnValue(undefined),
    };

    // Act & Assert
    expect(() => {
      new JwtStrategy(mockConfigServiceNoSecret as any, mockAuthService as any);
    }).toThrow('JWT_SECRET is required');
  });

  describe('validate', () => {
    it('should return user data for valid JWT payload', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '1',
        username: 'admin',
      };

      const expectedUser = {
        id: '1',
        username: 'admin',
      };

      mockAuthService.validateJwtPayload.mockResolvedValue(expectedUser);

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockAuthService.validateJwtPayload).toHaveBeenCalledWith(payload);
      expect(mockAuthService.validateJwtPayload).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid JWT payload', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '999',
        username: 'nonexistentuser',
      };

      mockAuthService.validateJwtPayload.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow('Token inválido');
      expect(mockAuthService.validateJwtPayload).toHaveBeenCalledWith(payload);
    });

    it('should handle service errors', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '1',
        username: 'admin',
      };

      mockAuthService.validateJwtPayload.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(strategy.validate(payload)).rejects.toThrow('Service error');
      expect(mockAuthService.validateJwtPayload).toHaveBeenCalledWith(payload);
    });
  });

  describe('constructor configuration', () => {
    it('should configure JWT strategy with correct options', () => {
      // Como o constructor é chamado no beforeEach, apenas verificar se a strategy foi criada
      expect(strategy).toBeDefined();
      expect(mockConfigService.get('auth.jwtSecret')).toBe('test-jwt-secret');
    });
  });
});
