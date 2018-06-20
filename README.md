# PAM Kandidatsøk

## Hvordan kjøre applikasjonen lokalt

```sh 
npm install
npm start
```

Frontend kjører som default på [localhost:9009](localhost:9009).

For å få inn testdata må prosjektet pam-kandidatsok-api kjøre på port 8765 med Elastic Search i bakgrunnen.


## Hvordan kjøre opp applikasjonen i Docker

```sh
docker build -t pam-kandidatsok . -f Dockerfile
docker run -p 8080:8080 --name pam-kandidatsok -e "PAM_KANDIDATSOK=http://localhost:8765/rest/kandidatsok/ -t pam-kandidatsok
```

Appliksjonen vil da kjøre på port 8080. For å få data må pam-kandidatsok-api også her kjøre på port 8765 med Elastic Search i bakgrunnen.


## Feature toggles

Applikasjonen bruker feature toggles fra unleash for å skru av og på funksjonalitet.
I `src/konstanter.js` ligger en liste med navnene på feature togglene som appen bruker.
Disse ligger også i `webpack.config.dev.js` for toggles under utvikling lokalt.

For å legge til en feature toggle med navn `'test-toggle'` må man legge den til 3 steder:

- Legg til `'test-toggle'` i `FEATURE_TOGGLES` i `src/konstanter.js`.
- Legg til `'test-toggle': true` i `developmentToggles` `webpack.config.dev.js`.
- Legg til `pam-kandidatsok.test-toggle` i unleash admin i [https://unleash.nais.adeo.no](https://unleash.nais.adeo.no).

Toggle-endepunktet i kandidatsøket sin backend legger på prefixet `pam-kandidatsok` selv,
som gjør at det kun er mulig å bruke feature toggles som starter med dette prefixet.

For utvikling lokalt brukes togglene i `webpack.config.dev.js`.
Man kan teste hvordan applikasjonen fungerer med forskjellige toggles ved å skru av og på
toggles her, ved å sette dem til enten `true` eller `false`.
For å se endringene må man restarte webpack-serveren.
