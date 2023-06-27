FROM gcr.io/distroless/nodejs18-debian11

WORKDIR /var

COPY dist/ dist/
COPY server/build server/
COPY server/node_modules  server/node_modules

WORKDIR /var/server

EXPOSE 8080

CMD ["server.js"]
