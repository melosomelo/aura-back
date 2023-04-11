# Aura-back

## Todo list

- [ ] Configurar ambiente
  - [x] Express
  - [x] Typescript
  - [x] PostgreSQL + Knex
  - [x] Redis
  - [x] Socket.IO
  - [x] Docker
- [ ] Código
  - [ ] Adicionar interface para a camada de dados
  - [ ] Melhorar a tipagem do Request quando estiver autenticado
  - [ ] Refatorar serviços e controladores para possibilitar mocking
  - [ ] Escrever testes unitários

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
  - Execute `docker compose up`
- **Sem docker**.
  - Instale o PostgreSQL e o Redis na sua máquina.
  - Execute `yarn dev`

Seja qual for o caminho que você escolha, você precisa configurar o arquivo `.env`! Dê uma olhada
no arquivo `.env.example` para ver quais variáveis você precisará setar. Também lembra de rodar
as _migrations_ com `knex migrate:latest`.
