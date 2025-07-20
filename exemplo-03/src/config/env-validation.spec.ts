import { validateEnv } from './env-validation';

describe('validateEnv', () => {
  const originalProcessExit = process.exit;
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Mock process.exit para não terminar os testes
    process.exit = jest.fn() as never;
    // Mock console.error para silenciar os logs nos testes
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restaura as funções originais
    process.exit = originalProcessExit;
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  describe('quando a configuração é válida', () => {
    it('deve retornar os valores validados', () => {
      const validConfig = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      const result = validateEnv(validConfig);

      expect(result).toEqual(expect.objectContaining(validConfig));
      expect(process.exit).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('deve permitir NODE_ENV como test', () => {
      const validConfig = {
        NODE_ENV: 'test',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      const result = validateEnv(validConfig);

      expect(result.NODE_ENV).toBe('test');
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('deve permitir NODE_ENV como production', () => {
      const validConfig = {
        NODE_ENV: 'production',
        POSTGRESQL_SERVER: 'prod-server',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'proddb',
        POSTGRESQL_USER: 'produser',
        POSTGRESQL_PASSWORD: 'prodpass',
      };

      const result = validateEnv(validConfig);

      expect(result.NODE_ENV).toBe('production');
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('deve remover variáveis não conhecidas quando stripUnknown é true', () => {
      const configWithExtra = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
        EXTRA_VAR: 'extra_value',
      };

      const result = validateEnv(configWithExtra);

      expect(result.EXTRA_VAR).toBeUndefined(); // stripUnknown: true remove variáveis extras
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe('quando a configuração é inválida', () => {
    it('deve chamar process.exit(1) quando NODE_ENV está faltando', () => {
      const invalidConfig = {
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      validateEnv(invalidConfig);

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('deve chamar process.exit(1) quando NODE_ENV tem valor inválido', () => {
      const invalidConfig = {
        NODE_ENV: 'invalid',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      validateEnv(invalidConfig);

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('deve chamar process.exit(1) quando POSTGRESQL_SERVER está faltando', () => {
      const invalidConfig = {
        NODE_ENV: 'development',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      validateEnv(invalidConfig);

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('deve chamar process.exit(1) quando POSTGRESQL_PORT não é um número', () => {
      const invalidConfig = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 'not-a-number',
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      validateEnv(invalidConfig);

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('deve chamar process.exit(1) quando POSTGRESQL_PORT está fora do range válido', () => {
      const invalidConfig = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 70000, // Porta inválida
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      validateEnv(invalidConfig);

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
    });

    it('deve exibir mensagens de erro formatadas quando há múltiplos problemas', () => {
      const invalidConfig = {
        NODE_ENV: 'invalid',
        POSTGRESQL_PORT: 'not-a-number',
        // Faltando outras variáveis obrigatórias
      };

      validateEnv(invalidConfig);

      expect(console.error).toHaveBeenCalledWith('\n\n');
      expect(console.error).toHaveBeenCalledWith('--------------------------------------------------------------------------------');
      expect(console.error).toHaveBeenCalledWith('🚨 ERRO DE CONFIGURAÇÃO!');
      expect(console.error).toHaveBeenCalledWith('📋 Problemas encontrados:');
      expect(console.error).toHaveBeenCalledWith('💡 Verifique se:');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('conversão de tipos', () => {
    it('deve converter POSTGRESQL_PORT de string para number quando válido', () => {
      const configWithStringPort = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: '5432', // String que representa um número válido
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      const result = validateEnv(configWithStringPort);

      expect(typeof result.POSTGRESQL_PORT).toBe('number');
      expect(result.POSTGRESQL_PORT).toBe(5432);
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
