import { TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

/**
 * Configuração base para testes que precisam de variáveis de ambiente válidas
 */
export const testEnvConfig = {
  NODE_ENV: 'test',
  POSTGRESQL_SERVER: 'localhost',
  POSTGRESQL_PORT: '5432',
  POSTGRESQL_DATABASE: 'testdb',
  POSTGRESQL_USER: 'testuser',
  POSTGRESQL_PASSWORD: 'testpass',
};

/**
 * Aplica as variáveis de ambiente de teste
 */
export function setupTestEnvironment() {
  Object.assign(process.env, testEnvConfig);
}

/**
 * Limpa as variáveis de ambiente de teste
 */
export function cleanupTestEnvironment() {
  Object.keys(testEnvConfig).forEach(key => {
    delete process.env[key];
  });
}

/**
 * Obtém o ConfigService de um módulo de teste
 */
export function getConfigService(module: TestingModule): ConfigService {
  return module.get<ConfigService>(ConfigService);
}

/**
 * Cria um mock básico do ConfigService para testes unitários
 */
export function createMockConfigService(overrides: Record<string, unknown> = {}) {
  const defaultConfig = { ...testEnvConfig, ...overrides };
  
  return {
    get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
      return defaultConfig[key] ?? defaultValue;
    }),
  };
}

// Auto-configura as variáveis de ambiente quando este arquivo é importado
setupTestEnvironment();
