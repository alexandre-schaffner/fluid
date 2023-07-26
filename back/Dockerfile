FROM node:latest

WORKDIR /app

COPY ./ ./

RUN yarn

RUN yarn build

RUN yarn prisma generate

EXPOSE 8000

CMD [ "yarn", "start:prod" ]
