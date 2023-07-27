FROM node:latest

WORKDIR /app

COPY ./ ./

RUN yarn

RUN yarn build

RUN yarn prisma generate

EXPOSE ${PORT}

CMD [ "yarn", "start:prod" ]
