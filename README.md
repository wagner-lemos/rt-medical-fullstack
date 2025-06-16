### RT Meical - Teste Fullstack Developer
Desafio
O desafio é criar um sistema completo que permite o envio de imagens DICOM através de um CRUD (Create, Read, Update, Delete) no backend utilizando Laravel, e exibir essas imagens no frontend usando React e a biblioteca Cornerstone.js.

```
• O sistema apresenta uma area de login autenticado;
• O backend em Laravel e o front em ReactJS;
• O banco de dados deverá ser relacional - MySQL;
• o banco de dados deverá ser criado utilizando Migrations;
• Lógica de validação para garantir que apenas arquivos DICOM (.dcm) sejam aceitos;
```
#### Requisitos
```
• Versao do PHP: 8.2
• Versao do Laravel: 11.9
```
#### Clone o projeto
```
• Configure o .env
```
#### Instale as dependências
```
• backend: composer install
• frontend: npm install
```
#### Execute a migrate no backend
```
• php artisan key:generate
• php artisan migrate
• php artisan storage:link
```
#### Rode o serve no backend
```
• php artisan serve
O backend estará disponível em http://localhost:8000
```
#### Rode o serve NPM no frontend
```
• npm run dev
O frontend estará disponível em http://localhost:3000
```