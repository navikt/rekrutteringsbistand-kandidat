# PAM Kandidatsøk
s
## Hvordan kjøre applikasjonen lokalt i arbeidsgivermodus

```sh 
npm install
npm start
```

## Hvordan kjøre applikasjonen lokalt i veiledermodus

```sh 
npm install
npm run start-veileder
```

Frontend kjører som default på
 
Arbeidsgiver: [localhost:9009/kandidater](localhost:9009/kandidater)

Veileder: [localhost:9010/pam-kandidatsok-veileder/](localhost:9010/pam-kandidatsok-veileder)

For å få inn testdata må prosjektet pam-kandidatsok-api kjøre på port 8766 med Elastic Search i bakgrunnen.


## Hvordan kjøre opp applikasjonen i Docker

```sh
docker build -t pam-kandidatsok . -f Dockerfile
docker run -p 8080:8080 --name pam-kandidatsok -e "PAM_KANDIDATSOK=http://localhost:8766/rest/kandidatsok/ -t pam-kandidatsok
```

Appliksjonen vil da kjøre på port 8080. For å få data må pam-kandidatsok-api også her kjøre på port 8766 med Elastic Search i bakgrunnen.


## Logging

Applikasjonen logger til Kibana ved hjelp av [FO-frontendlogger](https://github.com/navikt/fo-frontendlogger).
For å finne loggene må man søke på `application:fo-frontendlogger AND x_appname:pam-kandidatsok` i Kibana.

De vanligste feilene er også i [denne tabellen][1] i Kibana.

Siden javascripten ligger i én stor fil, så kan man bruke source-map for å finne ut
hvilken linje en feil har oppstått på, ved hjelp av verktøyet [`sourcemap-lookup`](https://www.npmjs.com/package/sourcemap-lookup):

```
npm install -g sourcemap-lookup
sourcemap-lookup dist/js/sok.js:{LINJENUMMER}:{KOLONNENUMMER}
```

## Feature toggles

Applikasjonen bruker feature toggles fra unleash for å skru av og på funksjonalitet.
I `src/felles/konstanter.js` ligger en liste med navnene på feature togglene som appen bruker.
Disse ligger også i `webpack.config.dev.js` for toggles under utvikling lokalt.

For å legge til en feature toggle med navn `'test-toggle'` må man legge den til 3 steder:

- Legg til `'test-toggle'` i `FEATURE_TOGGLES` i `src/felles/konstanter.js`.
- Legg til `'test-toggle': true` i `developmentToggles` `webpack.config.dev.js`.
- Legg til `pam-kandidatsok.test-toggle` i unleash admin i [https://unleash.nais.adeo.no](https://unleash.nais.adeo.no).

Toggle-endepunktet i kandidatsøket sin backend legger på prefixet `pam-kandidatsok` selv,
som gjør at det kun er mulig å bruke feature toggles som starter med dette prefixet.

For utvikling lokalt brukes togglene i `webpack.config.dev.js`.
Man kan teste hvordan applikasjonen fungerer med forskjellige toggles ved å skru av og på
toggles her, ved å sette dem til enten `true` eller `false`.
For å se endringene må man restarte webpack-serveren.

[1]: https://logs.adeo.no/app/kibana#/visualize/edit/5778a2f0-963f-11e8-829c-67cd76ba3446?_g=%28refreshInterval%3A%28display%3AOff%2Cpause%3A!f%2Cvalue%3A0%29%2Ctime%3A%28from%3Anow-24h%2Cmode%3Aquick%2Cto%3Anow%29%29%29

## Komme i gang med Sauce Labs

Sauce Labs brukes til å kjøre Nightwatch/Cucumber-tester.
Logg inn i Sauce Labs her: www.saucelabs.com.
For å kunne kjøre tester fra egen maskin må man installere og kjøre Sauce Connect.
Sauce Connect oppretter en secure tunnel mellom maskinen og Sauce Labs.
Sauce Connect kan finnes her: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy.
Åpne mappen hvor Sauce Connect ligger og kjør med følgende kommando:
#####Windows
```
bin\sc.exe -u username -k ddacfe7c-43e7-4973-1a25-140534f18636 -i tunnel-name
```
#####Linux/Mac
```
bin/sc -u username -k ddacfe7c-43e7-4973-1a25-140534f18636 -i tunnel-name
```
-k er parameter for user key og kan finnes under User Settings etter å ha logget inn i Sauce Labs.
Sauce Connect vil starte en selenium listener på port 4445, som er default.
For å kjøre tester på Sauce Labs må man spesifisere samme port i configen til Nightwatch.
Man må også legge til følgende Environment Variables på maskinen med brukernavn og key:
```
SAUCE_ACCESS_KEY=key
SAUCE_USERNAME=username
```
####Kjøre tester
Først må man installere pakker med ``npm install`` i qa-mappen.
For å kjøre tester må man kjøre script fra qa/package.json.
Ex:
```
npm run sauce-chrome -- --skiptags ignore
```
Kommando for å generere rapport:
```
npm run cucumber-report
```
Rapporten finnes her ``qa/reports/cucumber_report.html``
