
# Wiki API

A Wiki API robusta para gerenciar seções, artigos, comentários, notificações, uploads de arquivos (via Cloudinary), configurações de usuários, estatísticas e muito mais. Essa API foi construída utilizando Node.js, Express e MongoDB (com Mongoose) e conta com documentação interativa via Swagger.

----------

## Índice

-   [Características](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#caracter%C3%ADsticas)
-   [Tecnologias Utilizadas](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#tecnologias-utilizadas)
-   [Recursos e Endpoints](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#recursos-e-endpoints)
-   [Instalação](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#instala%C3%A7%C3%A3o)
-   [Configuração](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#configura%C3%A7%C3%A3o)
-   [Como Executar](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#como-executar)
-   [Documentação da API](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#documenta%C3%A7%C3%A3o-da-api)
-   [Testes](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#testes)
-   [Melhorias Futuras](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#melhorias-futuras)
-   [Contribuição](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#contribui%C3%A7%C3%A3o)
-   [Licença](https://chatgpt.com/c/67ad059c-51c0-8005-af22-20648a9cbd3c#licen%C3%A7a)

----------

## Características

-   **Gerenciamento de Seções e Artigos:** Criação, leitura, atualização e remoção de seções e artigos.
-   **Histórico de Alterações:** Armazena versões anteriores dos artigos para restauração e auditoria.
-   **Comentários e Respostas:** Permite que usuários adicionem comentários e respostas, além de votos (upvote/downvote).
-   **Notificações:** Sistema para notificar os usuários sobre eventos relevantes (ex.: novos comentários).
-   **Upload de Arquivos:** Integração com o Cloudinary para upload e armazenamento de arquivos e imagens.
-   **Favoritos e Configurações do Usuário:** Cada usuário pode gerenciar seus artigos favoritos e suas preferências.
-   **Busca Avançada:** Permite a pesquisa de artigos por título, tags e datas.
-   **Estatísticas e Relatórios:** Endpoints para obter dados de uso, atividade de usuários e exportação de dados.
-   **Autenticação com JWT:** Endpoints protegidos por autenticação utilizando tokens JWT.

----------

## Tecnologias Utilizadas

-   **Node.js & Express:** Ambiente de execução e framework para criação da API.
-   **MongoDB & Mongoose:** Banco de dados NoSQL e ODM para modelagem dos dados.
-   **Swagger (swagger-jsdoc e swagger-ui-express):** Documentação interativa da API.
-   **Multer & multer-storage-cloudinary:** Upload de arquivos com armazenamento no Cloudinary.
-   **JWT & bcrypt:** Autenticação segura e criptografia de senhas.

----------

## Recursos e Endpoints

A API está organizada em vários módulos, cada um responsável por um conjunto de funcionalidades. Abaixo, um resumo dos principais recursos:

### Autenticação (Auth)

-   **POST /api/auth/register:** Registra um novo usuário.
-   **POST /api/auth/login:** Autentica um usuário e gera um token JWT.
-   **GET /api/auth/me:** Retorna os dados do usuário logado.
-   **PUT /api/auth/update-password:** Atualiza a senha do usuário.

### Seções

-   **GET /api/sections:** Lista todas as seções.
-   **POST /api/sections:** Cria uma nova seção.
-   **GET /api/sections/{id}:** Obtém detalhes de uma seção.
-   **PUT /api/sections/{id}:** Atualiza uma seção.
-   **DELETE /api/sections/{id}:** Remove uma seção.

### Artigos

-   **GET /api/articles:** Lista todos os artigos.
-   **POST /api/articles:** Cria um novo artigo.
-   **GET /api/articles/{id}:** Obtém os detalhes de um artigo.
-   **PUT /api/articles/{id}:** Atualiza um artigo (incluindo o armazenamento do histórico).
-   **DELETE /api/articles/{id}:** Remove um artigo.
-   **POST /api/articles/{id}/restore/{historyId}:** Restaura uma versão anterior de um artigo.
-   **POST /api/articles/{id}/draft:** Salva um artigo como rascunho.
-   **PUT /api/articles/{id}/publish:** Publica um artigo (muda o status para published).
-   **GET /api/articles/{id}/revisions:** Lista as revisões (histórico) de um artigo.

### Comentários e Respostas

-   **GET /api/articles/{articleId}/comments:** Lista os comentários principais de um artigo.
-   **POST /api/articles/{articleId}/comments:** Adiciona um comentário a um artigo.
-   **GET /api/articles/{articleId}/comments/{commentId}/replies:** Lista as respostas de um comentário.
-   **POST /api/articles/{articleId}/comments/{commentId}/replies:** Adiciona uma resposta a um comentário.
-   **DELETE /api/comments/{id}:** Remove um comentário.
-   **POST /api/comments/{id}/upvote:** Realiza upvote em um comentário.
-   **POST /api/comments/{id}/downvote:** Realiza downvote em um comentário.

### Notificações

-   **GET /api/notifications:** Lista as notificações do usuário logado.
-   **PUT /api/notifications/{id}/read:** Marca uma notificação como lida.

### Uploads

-   **POST /api/upload:** Faz o upload de um arquivo para o Cloudinary.
-   **GET /api/uploads/{fileId}:** Recupera um arquivo enviado (localmente, caso haja fallback).

### Busca

-   **GET /api/search/advanced:** Realiza busca avançada de artigos por título, tag e datas.

### Estatísticas

-   **GET /api/stats/usage:** Retorna estatísticas gerais de uso (total de artigos e usuários).
-   **GET /api/stats/user-activity:** Retorna a atividade dos usuários (número de artigos criados/atualizados).
-   **GET /api/stats/export:** Exporta dados da Wiki (lista de artigos com detalhes).

### Configurações e Favoritos do Usuário

-   **GET /api/users/me/favorites:** Lista os artigos favoritos do usuário.
-   **POST /api/articles/{id}/favorite:** Adiciona ou remove um artigo dos favoritos do usuário.
-   **GET /api/users/me/settings:** Retorna as configurações do usuário logado.
-   **PUT /api/users/me/settings:** Atualiza as configurações do usuário logado.

----------

## Instalação

1.  **Clone o repositório:**
    
    ```bash
    git clone <URL_DO_REPOSITÓRIO>
    cd wiki-api
    
    ```
    
2.  **Instale as dependências:**
    
    ```bash
    npm install
    
    ```
    

----------

## Configuração

1.  **Crie um arquivo `.env` na raiz do projeto** e defina as variáveis de ambiente necessárias:
    
    ```env
    MONGODB_URI=mongodb://localhost:27017/wiki-api
    JWT_SECRET=seuSegredoSuperSecreto
    PORT=3000
    CLOUDINARY_CLOUD_NAME=seu_cloud_name
    CLOUDINARY_API_KEY=seu_api_key
    CLOUDINARY_API_SECRET=seu_api_secret
    
    ```
    
2.  **Configure seu banco de dados MongoDB** (o projeto utiliza o Mongoose).
    

----------

## Como Executar

Para iniciar o servidor em modo de desenvolvimento, execute:

```bash
npm run dev

```

Para iniciar em modo de produção:

```bash
npm start

```

O servidor será iniciado na porta definida na variável `PORT` (padrão: 3000).

----------

## Documentação da API

A documentação interativa da API foi gerada utilizando Swagger. Após iniciar o servidor, acesse:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

No Swagger UI, você poderá ver todos os endpoints, testar as requisições e inserir o token JWT para os endpoints protegidos (utilize o botão "Authorize" no canto superior direito).

----------

## Testes

Crie testes unitários e de integração para garantir que a API esteja funcionando conforme esperado. Você pode utilizar frameworks como Jest, Mocha ou Chai. (Exemplo de testes não incluído.)

----------

## Melhorias Futuras

-   Implementar validação de dados com Joi ou express-validator.
-   Adicionar paginação, ordenação e filtros para endpoints que retornam listas.
-   Implementar controle de versões e fluxo de aprovação para revisões de artigos.
-   Melhorar o sistema de notificações com processamento assíncrono.
-   Integrar cache com Redis para otimizar consultas.
-   Adicionar logging avançado e monitoramento (ex.: usando Winston e Sentry).

----------

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests. Siga as diretrizes do projeto e mantenha a consistência com a arquitetura atual.

----------

## Licença

Este projeto está licenciado sob a [MIT License].

----------

## Contato

Em caso de dúvidas ou sugestões, entre em contato através do [bfrpaulondev@gmail.com](mailto:bfrpaulondev@gmail.com).

----------
