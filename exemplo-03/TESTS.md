# Testes Automatizados

Esta aplicação NestJS possui um conjunto abrangente de testes automatizados que cobrem diferentes aspectos da aplicação.

## Estrutura dos Testes

### Testes Unitários (`*.spec.ts`)
- **env-validation.spec.ts**: Testa a função de validação de variáveis de ambiente
- **dotEnv.schema.spec.ts**: Testa o schema Joi de validação
- **app.service.spec.ts**: Testa o serviço principal da aplicação
- **app.controller.spec.ts**: Testa o controller principal (existente)
- **app.module.spec.ts**: Testa a configuração do módulo principal

### Testes de Integração
- **configuration.integration.spec.ts**: Testa a integração entre ConfigModule, validateEnv e schemas

### Testes End-to-End (`*.e2e-spec.ts`)
- **app.e2e-spec.ts**: Testa os endpoints da aplicação de ponta a ponta

## Como Executar

### Todos os testes
```bash
pnpm test
```

### Testes em modo watch
```bash
pnpm run test:watch
```

### Testes com cobertura
```bash
pnpm run test:cov
```

### Testes E2E
```bash
pnpm run test:e2e
```

### Teste específico
```bash
pnpm test -- --testNamePattern="validateEnv"
```

## Cobertura dos Testes

Os testes cobrem:

### 🔧 Configuração e Validação
- ✅ Validação de variáveis de ambiente obrigatórias
- ✅ Tratamento de configurações inválidas
- ✅ Conversão de tipos (string para number)
- ✅ Valores válidos para NODE_ENV
- ✅ Validação de portas PostgreSQL
- ✅ Mensagens de erro formatadas

### 🏗️ Módulos e Injeção de Dependência
- ✅ Carregamento do AppModule
- ✅ Injeção do ConfigService
- ✅ Configuração global do ConfigModule
- ✅ Integração entre controllers e services

### 🌐 Endpoints HTTP
- ✅ Endpoint raiz (GET /)
- ✅ Respostas corretas
- ✅ Códigos de status HTTP
- ✅ Headers de resposta
- ✅ Métodos HTTP não permitidos
- ✅ Rotas inexistentes (404)
- ✅ Performance (tempo de resposta)

### 🧪 Cenários de Erro
- ✅ Configurações inválidas
- ✅ Variáveis obrigatórias ausentes
- ✅ Tipos incorretos
- ✅ Valores fora do range permitido
- ✅ Múltiplos erros simultâneos

## Arquivos de Apoio

### test-helpers.ts
Utilitários para configuração de testes:
- Configuração de ambiente de teste
- Mocks do ConfigService
- Helpers para setup/cleanup

### .env.test
Variáveis de ambiente específicas para testes.

## Configuração Jest

Os testes usam a configuração Jest padrão do NestJS com:
- TypeScript support via ts-jest
- Cobertura de código
- Ambiente Node.js
- Arquivos de teste: `*.spec.ts` e `*.e2e-spec.ts`

## Boas Práticas Implementadas

1. **Isolamento**: Cada teste é independente e não afeta outros
2. **Mocking**: Process.exit e console.error são mockados para não interferir
3. **Setup/Teardown**: Configuração e limpeza adequada entre testes
4. **Cobertura**: Testes cobrem casos de sucesso e falha
5. **Nomenclatura**: Descrições claras em português
6. **Organização**: Testes agrupados por funcionalidade
7. **Edge Cases**: Cenários limites e casos extremos testados

## Comandos Úteis

```bash
# Rodar testes específicos por arquivo
pnpm test env-validation

# Rodar testes com cobertura detalhada
pnpm run test:cov -- --verbose

# Rodar apenas testes que falharam
pnpm test -- --onlyFailures

# Rodar testes em modo debug
pnpm run test:debug

# Limpar cache do Jest
pnpm test -- --clearCache
```
