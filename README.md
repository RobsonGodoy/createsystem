# Site Builder

Sistema de construção de sites por blocos com drag and drop, desenvolvido com Vue.js, Vuetify, Node.js e MySQL.

## Funcionalidades Principais

- Sistema de autenticação (login/registro)
- Interface drag and drop para construção de sites
- Blocos pré-prontos com diferentes funcionalidades
- Sistema de salvamento de layouts
- Geração de build para download
- Interface amigável para usuários sem conhecimento em programação

## Estrutura do Projeto

- `/frontend` - Aplicação Vue.js com Vuetify
- `/backend` - API Node.js com Express
- `/database` - Scripts SQL e configurações do banco de dados

## Requisitos

- Node.js 18+
- MySQL 8+
- NPM ou Yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm run install:all
```

3. Configure o banco de dados:
   - Crie um banco de dados MySQL
   - Configure as variáveis de ambiente no arquivo .env

4. Inicie o projeto em modo desenvolvimento:
```bash
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta backend com as seguintes variáveis:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=site_builder
JWT_SECRET=seu_secret
```

## Licença

ISC 