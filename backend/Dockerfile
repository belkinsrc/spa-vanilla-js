FROM node:alpine AS base

WORKDIR /app

EXPOSE 5000

COPY package*.json .

RUN rm -rf node_modules package-lock.json

# prod stage

FROM base as prod

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]

# dev stage

FROM base as dev

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]