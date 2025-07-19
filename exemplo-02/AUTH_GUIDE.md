# Autenticação JWT - Guia de Uso

## Visão Geral

A aplicação agora implementa autenticação JWT com as seguintes características:

- **Algoritmo de Hash**: Argon2 para senhas
- **Token JWT**: Válido por 24 horas
- **Guard Global**: Todos os endpoints são protegidos por padrão
- **Endpoints Públicos**: Marcados com decorator `@Public()`

## Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis no arquivo `.env`:

```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=24h

# Admin User
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Endpoints

### 1. Login

**POST** `/api/v1/auth/login`

Realiza login e retorna token JWT.

**Request:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin"
  }
}
```

### 2. Endpoints Protegidos

Todos os endpoints de recados (`/api/v1/recados/*`) requerem autenticação.

**Headers:**

```
Authorization: Bearer <seu-jwt-token>
```

### 3. Endpoints Públicos

- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/login` - Login

## Exemplos de Uso

### 1. Fazer Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Acessar Recados (com token)

```bash
curl http://localhost:3001/api/v1/recados \
  -H "Authorization: Bearer <seu-jwt-token>"
```

### 3. Testar sem token (deve retornar 401)

```bash
curl http://localhost:3001/api/v1/recados
```

## Swagger/OpenAPI

A documentação interativa está disponível em:

- **URL**: http://localhost:3001/api/docs
- **Autenticação**: Clique em "Authorize" e insira o token JWT

## Segurança

- Senhas são hasheadas com Argon2 (algoritmo vencedor do Password Hashing Competition)
- Tokens JWT são assinados com HS256
- Guard global aplicado a todos os endpoints
- Decorador `@Public()` para endpoints que não precisam de autenticação
- Rate limiting aplicado globalmente
- CORS configurado adequadamente

## Desenvolvimento

Para adicionar novos endpoints protegidos, simplesmente crie-os normalmente - eles serão protegidos automaticamente pelo guard global.

Para endpoints públicos, adicione o decorador `@Public()`:

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get('public-endpoint')
async publicMethod() {
  // Este endpoint não requer autenticação
}
```
