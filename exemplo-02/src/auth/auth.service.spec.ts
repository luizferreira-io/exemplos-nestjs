import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';

// Mock do argon2
jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'auth.adminUsername': 'testadmin',
        'auth.adminPassword': 'testpassword123',
      };
      return config[key];
    }),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    beforeEach(() => {
      // Setup dos mocks antes de cada teste
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (argon2.verify as jest.Mock).mockResolvedValue(true);
    });

    it('should validate user with correct credentials', async () => {
      // Act
      const result = await service.validateUser('testadmin', 'testpassword123');

      // Assert
      expect(result).toEqual({
        id: '1',
        username: 'testadmin',
      });
      // Verificar se argon2.verify foi chamado
      expect(argon2.verify).toHaveBeenCalledTimes(1);
      // Verificar se foi chamado com a senha correta
      expect((argon2.verify as jest.Mock).mock.calls[0][1]).toBe('testpassword123');
    });

    it('should return null with incorrect username', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      // Act
      const result = await service.validateUser('wronguser', 'testpassword123');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null with incorrect password', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser('testadmin', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when argon2.verify throws an error', async () => {
      // Arrange
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (argon2.verify as jest.Mock).mockRejectedValue(new Error('Argon2 error'));

      // Act
      const result = await service.validateUser('testadmin', 'testpassword123');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data for valid credentials', async () => {
      // Arrange
      const mockHashedPassword = 'hashed-password';
      const mockToken = 'jwt-token';
      const loginDto = {
        username: 'testadmin',
        password: 'testpassword123',
      };

      (argon2.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (mockJwtService.sign as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: '1',
          username: 'testadmin',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        username: 'testadmin',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      const loginDto = {
        username: 'wronguser',
        password: 'wrongpassword',
      };

      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('validateJwtPayload', () => {
    it('should validate JWT payload for admin user', async () => {
      // Arrange
      const mockHashedPassword = 'hashed-password';
      const payload = {
        sub: '1',
        username: 'testadmin',
      };

      (argon2.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      // Aguardar a inicialização do usuário admin
      await service.validateUser('testadmin', 'testpassword123');

      // Act
      const result = await service.validateJwtPayload(payload);

      // Assert
      expect(result).toEqual({
        id: '1',
        username: 'testadmin',
      });
    });

    it('should return null for invalid user in payload', async () => {
      // Arrange
      const mockHashedPassword = 'hashed-password';
      const payload = {
        sub: '2',
        username: 'invaliduser',
      };

      (argon2.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      // Act
      const result = await service.validateJwtPayload(payload);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should use default credentials when config is not provided', async () => {
      // Arrange
      const defaultConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: ConfigService,
            useValue: defaultConfigService,
          },
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
        ],
      }).compile();

      const serviceWithDefaults = module.get<AuthService>(AuthService);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-default');
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await serviceWithDefaults.validateUser('admin', 'admin123');

      // Assert
      expect(result).toEqual({
        id: '1',
        username: 'admin',
      });
    });
  });
});
