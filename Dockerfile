FROM navikt/node-express:12.2.0

WORKDIR /usr/src/app

COPY package.json server.js ./

COPY dist/ ./dist
COPY node_modules/ ./node_modules
COPY views/ ./views

EXPOSE 8080

CMD ["npm", "run", "start-express"]