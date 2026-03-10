# Desafio Backend - Jitterbit (Order API)

## 📌 Sobre o Projeto

Esta é uma API RESTful desenvolvida para o desafio técnico da Jitterbit. O objetivo principal da aplicação é receber um payload JSON contendo dados de um pedido (com nomenclaturas específicas em português), realizar o mapeamento (parse) desses dados para um padrão interno (inglês/snake_case) e persisti-los em um banco de dados relacional de forma transacional.

Além do fluxo de criação, a API conta com um CRUD completo para gerenciamento dos pedidos.

## 🚀 Tecnologias Utilizadas

- **Node.js** com **Express** (Framework web)
- **PostgreSQL** (Banco de dados relacional)
- **node-postgres (pg)** (Driver de comunicação com o banco)
- **dotenv** (Gerenciamento de variáveis de ambiente)

## ⚙️ Pré-requisitos

Para rodar este projeto localmente, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/)
- [Postman](https://www.postman.com/)

## 🛠️ Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/iagokoch/API-Jitterbit.git
cd Desafio
```
