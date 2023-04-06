FROM node:alpine

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

COPY package.json yarn.lock ./

RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY . .

CMD ["yarn", "dev"]
