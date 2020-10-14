FROM navikt/node-express:14-alpine

WORKDIR /usr/src/app

COPY labs/views/ ./
COPY dist/ ./

EXPOSE 8080

CMD ["npx", "serve --listen 8080"]