# exemplo-01

## Descrição

Este projeto implementa um exemplo de CRUD, quer armazena dados dentro de um array em memória. Usa a biblioteca `Joi` para validação dos DTOs e o `pnpm` como gerenciador de pacotes.

## Instruções

O arquivo `recados.rest` tem exemplos de requisições. Se estiver usando o VSCode com a extensão REST Client, pode fazer as requisições diretamente diretamente na IDE.

## Setup do projeto

```bash
$ pnpm install
```

## Compilar e rodar o projeto

```bash
# ambiente de desenvolvimento
$ pnpm run start

# ambiente de desenvolvimento (watch mode)
$ pnpm run start:dev

# ambiente de produção
$ pnpm run start:prod
```

## Testes

Os testes foram gerados pelo GitHub Copilot.

```bash
# testes unitários
$ pnpm run test

# testes end to end
$ pnpm run test:e2e

# testes de cobertura
$ pnpm run test:cov
```
