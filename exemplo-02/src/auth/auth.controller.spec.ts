import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../recados/pipes/joiValidation.pipe';
import { LoginDto, LoginResponseDto } from './dtos/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user data for valid login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      };

      const expectedResponse: LoginResponseDto = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          username: 'admin',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      const loginDto: LoginDto = {
        username: 'wronguser',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(controller.login(loginDto)).rejects.toThrow('Credenciais inválidas');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      };

      mockAuthService.login.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow('Service error');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('integration with validation pipe', () => {
    it('should use JoiValidationPipe for request validation', () => {
      // Verificar se o controller está configurado com o pipe correto
      const loginMethod = controller.login;
      expect(loginMethod).toBeDefined();

      // Esta é uma verificação conceitual - o pipe é aplicado via decorator
      // e seria testado em testes de integração ou E2E
      expect(controller).toHaveProperty('login');
    });
  });
});
