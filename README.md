# PAM Kandidatsøk

## Hvordan kjøre applikasjonen lokalt

```sh 
npm install
npm start
```

Frontend kjører som default på [localhost:9009](localhost:9009).

For å få inn testdata må prosjektet pam-cv-indexer kjøre på port 8765 med Elastic Search i bakgrunnen.

## Hvordan kjøre opp applikasjonen i Docker

```sh
docker build -t pam-kandidatsok . -f Dockerfile
docker run -p 8080:8080 --name pam-kandidatsok -e "PAM_KANDIDATSOK=http://localhost:8765/rest/kandidatsok/ -t pam-kandidatsok
```

Appliksjonen vil da kjøre på port 8080. For å få data må pam-cv-indexer også  her kjøre på port 8765 med Elastic Search i bakgrunnen.










