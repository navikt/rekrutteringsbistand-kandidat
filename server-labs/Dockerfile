FROM navikt/node-express:14-alpine

WORKDIR /usr/src/app

COPY server-labs/ server/
COPY build/ build/

WORKDIR /usr/src/app/server

EXPOSE 8080

CMD ["node", "server.js"]