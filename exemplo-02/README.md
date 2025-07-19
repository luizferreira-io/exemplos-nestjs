# Recados API - NestJS Melhorado

Uma API REST moderna para gerenciamento de recados construída com NestJS, incluindo **autenticação JWT com Argon2**, documentação Swagger, validação avançada, logging, rate limiting e testes abrangentes.

## 🚀 Melhorias Implementadas

### **1. Arquitetura e Organização**

- **Modularização**: Separação clara entre `RecadosModule`, `AuthModule` e `CommonModule`
- **Configuração centralizada**: Sistema de configuração usando `@nestjs/config`
- **Separação de responsabilidades**: Controllers, Services, DTOs, Entities, Schemas organizados

### **2. Autenticação e Segurança**

- **JWT Authentication**: Autenticação baseada em tokens JWT
- **Argon2 Hashing**: Senhas hasheadas com o algoritmo Argon2 (vencedor do Password Hashing Competition)
- **Guard Global**: Proteção automática de todos os endpoints
- **Passport Integration**: Estratégias Local e JWT para autenticação
- **Credenciais em .env**: Usuário e senha do admin armazenados em variáveis de ambiente

### **3. API Melhorada**

- **Paginação avançada**: Resposta estruturada com metadata de paginação
- **Novos endpoints**:
  - `POST /auth/login` - Autenticação e obtenção de token JWT
  - `PATCH /recados/:id/read` - Marcar recado como lido
  - `GET /health` - Health check da aplicação (público)
- **Prefixo global**: Todas as rotas sob `/api/v1`
- **Documentação OpenAPI/Swagger**: Disponível em `/api/docs` com suporte a JWT

### **4. Validação e Segurança**

- **Rate Limiting**: Middleware personalizado limitando 100 requests por 15 minutos
- **CORS configurado**: Suporte para ambientes de desenvolvimento e produção
- **Validação Joi**: Schemas de validação robustos para todos os endpoints
- **Endpoints protegidos**: Todos os recados requerem autenticação JWT

### **5. Logging e Monitoramento**

- **Interceptor de Logging**: Log automático de todas as requisições com tempo de resposta
- **Health Check**: Endpoint para verificar status, uptime e uso de memória
- **Logs estruturados**: Informações detalhadas sobre método, URL, status e latência

### **6. Testes Abrangentes**

- **64 testes** cobrindo todos os componentes
- **Testes unitários** para Controllers, Services, Interceptors, Middlewares
- **Testes de integração** para módulos
- **Cobertura alta** dos principais fluxos da aplicação

## 🔐 Autenticação

A API utiliza autenticação JWT com as seguintes características:

- **Login**: `POST /api/v1/auth/login` com username e password
- **Token JWT**: Válido por 24 horas
- **Headers**: `Authorization: Bearer <token>`
- **Usuário padrão**: admin / admin123 (configurável via .env)

Ver [AUTH_GUIDE.md](./AUTH_GUIDE.md) para detalhes completos.

## 📋 Endpoints da API

### Autenticação (Público)

- `POST /api/v1/auth/login` - Fazer login e obter token JWT

### Recados (Protegidos - Requer JWT)

- `GET /api/v1/recados` - Listar recados com paginação
- `GET /api/v1/recados/:id` - Buscar recado específico
- `POST /api/v1/recados` - Criar novo recado
- `PATCH /api/v1/recados/:id` - Atualizar recado parcialmente
- `PATCH /api/v1/recados/:id/read` - Marcar como lido
- `PUT /api/v1/recados/:id` - Substituir recado completamente
- `DELETE /api/v1/recados/:id` - Remover recado

### Sistema

- `GET /api/v1/health` - Verificar saúde da aplicação

## 🛠️ Setup do projeto

```bash
# Instalar dependências
$ pnpm install
```

## Compilar e executar

```bash
# Desenvolvimento
$ pnpm start:dev

# Produção
$ pnpm build
$ pnpm start:prod

# Testes
$ pnpm test              # Executar todos os testes
$ pnpm test:watch        # Testes em modo watch
$ pnpm test:cov          # Testes com cobertura
$ pnpm test:e2e          # Testes end-to-end

# Linting e formatação
$ pnpm lint              # Verificar código
$ pnpm format            # Formatar código
```

## 📊 Estrutura de Resposta da API

### Listagem Paginada

```json
{
  "data": [...],
  "total": 10,
  "offset": 0,
  "limit": 10
}
```

### Health Check

```json
{
  "status": "ok",
  "timestamp": "2025-07-19T17:41:01.025Z",
  "uptime": 13.467438857,
  "memory": {
    "rss": 125620224,
    "heapTotal": 60465152,
    "heapUsed": 28423680,
    "external": 2145803,
    "arrayBuffers": 18639
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
PORT=3000
NODE_ENV=development
API_PREFIX=api
API_VERSION=v1
```

### Recursos Principais

- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health
- **Rate Limiting**: 100 requests/15min por IP
- **CORS**: Habilitado para desenvolvimento
- **Logging**: Interceptor global com timing

## 📈 Qualidade do Código

- ✅ **77.9%** de cobertura de testes
- ✅ **64 testes** passando
- ✅ **8 suítes de teste**
- ✅ **Linting** configurado com ESLint
- ✅ **Formatação** com Prettier
- ✅ **TypeScript** strict mode

## 🏗️ Arquitetura

```
src/
├── app.module.ts           # Módulo raiz com configurações
├── main.ts                 # Bootstrap da aplicação
├── config/
│   └── app.config.ts       # Configurações centralizadas
├── common/                 # Recursos compartilhados
│   ├── common.module.ts
│   ├── controllers/
│   │   └── health.controller.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   ├── middleware/
│   │   └── rate-limit.middleware.ts
│   └── interfaces/
│       └── health.interface.ts
└── recados/                # Módulo de recados
    ├── recados.module.ts
    ├── recados.controller.ts
    ├── recados.service.ts
    ├── dtos/               # Data Transfer Objects
    ├── entities/           # Entidades de dados
    ├── interfaces/         # Interfaces TypeScript
    ├── pipes/              # Pipes de validação
    └── schemas/            # Schemas Joi
```

Esta aplicação demonstra as melhores práticas para desenvolvimento NestJS com foco em qualidade, manutenibilidade e documentação.
