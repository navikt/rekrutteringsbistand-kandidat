FROM navikt/node-express:12.2.0-alpine

WORKDIR /usr/src/app

COPY server/ server/
COPY build/ build/

WORKDIR /usr/src/app/server
RUN npm ci

EXPOSE 8080

CMD ["node", "server.js"]