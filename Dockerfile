FROM node:16

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./dist .

COPY .env .

COPY prisma ./prisma

CMD [ "npm", "run", "start:prod" ]
