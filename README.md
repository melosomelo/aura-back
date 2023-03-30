# Aura-back

## Todo list

- [ ] Configurar ambiente
  - [x] Express
  - [x] Typescript
  - [x] PostgreSQL + Knex
  - [ ] Redis
  - [ ] Socket.IO
  - [x] Docker

## Links importantes

- **Modelagem E/R**:
  https://drive.google.com/file/d/1ylPxL3gxNNzFpHevU-sAf1p8KhiZMjOv/view

## Stack escolhida

|      Responsabilidade       |                               Tecnologia                                |                                          Obs                                           |
| :-------------------------: | :---------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
| Construção do servidor HTTP |                   [ExpressJS](https://expressjs.com/)                   |                      Servidor minimalista, não impõe arquitetura.                      |
|       Banco de dados        | [PostgreSQL](https://www.postgresql.org/) + [Knex](https://knexjs.org/) | Knex é um _query builder_. Ele auxilia na construção de queries sem impor arquitetura. |
|  Comunicação em tempo real  |                     [Socket.IO](https://socket.io/)                     |                                           -                                            |
|    Sessão dos jogadores     |                       [Redis](https://redis.io/)                        |                                           -                                            |

## Como rodar o projeto

- **Com docker**.
  - Execute `docker build -f Dockerfile.dev -t aura-back .`
  - Execute `docker compose up`
- **Sem docker**.
  - Instale o PostgreSQL na sua máquina e rode `yarn dev`.
