FROM navikt/node-express:14-alpine

WORKDIR /var

COPY build/ build/
COPY server/build server/
COPY server/node_modules  server/node_modules

WORKDIR /var/server

EXPOSE 8080

CMD ["node", "server.js"]