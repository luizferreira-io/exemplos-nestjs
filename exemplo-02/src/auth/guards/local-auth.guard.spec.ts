import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalAuthGuard],
    }).compile();

    guard = module.get<LocalAuthGuard>(LocalAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;

    beforeEach(() => {
      mockExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn(),
          getResponse: jest.fn(),
        }),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
      } as any;
    });

    it('should call parent canActivate method', () => {
      // Spy no método canActivate do parent (AuthGuard)
      const parentCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate');
      parentCanActivateSpy.mockReturnValue(Promise.resolve(true));

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(parentCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);

      parentCanActivateSpy.mockRestore();
    });

    it('should return parent canActivate result', async () => {
      // Arrange
      const expectedResult = true;
      const parentCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate');
      parentCanActivateSpy.mockReturnValue(Promise.resolve(expectedResult));

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(expectedResult);

      parentCanActivateSpy.mockRestore();
    });

    it('should handle rejection from parent canActivate', async () => {
      // Arrange
      const error = new Error('Authentication failed');
      const parentCanActivateSpy = jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate');
      parentCanActivateSpy.mockRejectedValue(error);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(error);

      parentCanActivateSpy.mockRestore();
    });
  });
});
