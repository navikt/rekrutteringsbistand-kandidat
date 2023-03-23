# rekrutteringsbistand-kandidat

Kandidatsøk og kandidatlister for veiledere. Denne kodebasen delte tidligere repository med kandidatsøk for arbeidsgivere
i [pam-kandidatsok](https://github.com/navikt/pam-kandidatsok/). Koden inneholder derfor noen arkitekturavgjørelser fra
den tidligere, felles kodebasen.

## Kjør lokalt uten backend (mock)

```sh
npm install 
npm run start:mock
```

## Kjør applikasjonen lokalt med backend

```sh
npm install
npm start
```

For å få inn testdata må prosjektet rekrutteringsbistand-kandidat-api kjøre på port 8766 med Elastic Search i bakgrunnen.

## Hvordan kjøre opp applikasjonen i Docker

```sh
docker build -t rekrutteringsbistand-kandidat . -f Dockerfile
docker run -p 8080:8080 --name rekrutteringsbistand-kandidat -e "PAM_KANDIDATSOK=http://localhost:8766/rest/kandidatsok/ -t rekrutteringsbistand-kandidat
```

Appliksjonen vil da kjøre på port 8080. For å få data må rekrutteringsbistand-kandidat-api også her kjøre på port 8766
med Elastic Search i bakgrunnen.

## Feature toggles

Applikasjonen bruker feature toggles fra Unleash for å skru av og på funksjonalitet. I `src/felles/konstanter.js` ligger
en liste med navnene på feature togglene som appen bruker. Disse ligger også i `webpack.config.dev.js` for toggles under
utvikling lokalt.

For å legge til en feature-toggle med navn `'test-toggle'` må man legge den til 3 steder:

- Legg til `'test-toggle'` i `FEATURE_TOGGLES` i `src/felles/konstanter.js`.
- Legg til `'test-toggle': true` i `developmentToggles` `webpack.config.dev.js`.
- Legg til `pam-kandidatsøk.test-toggle` i unleash admin i [https://unleash.nais.io](https://unleash.nais.io).

Toggle-endepunktet i kandidatsøket sin backend legger på prefixet `rekrutteringsbistand-kandidat` selv, som gjør at det
kun er mulig å bruke feature toggles som starter med dette prefixet.

For utvikling lokalt brukes togglene i `webpack.config.dev.js`. Man kan teste hvordan applikasjonen fungerer med
forskjellige toggles ved å skru av og på toggles her, ved å sette dem til enten `true` eller `false`. For å se
endringene må man restarte webpack-serveren.

[1]: https://logs.adeo.no/app/kibana#/visualize/edit/5778a2f0-963f-11e8-829c-67cd76ba3446?_g=%28refreshInterval%3A%28display%3AOff%2Cpause%3A!f%2Cvalue%3A0%29%2Ctime%3A%28from%3Anow-24h%2Cmode%3Aquick%2Cto%3Anow%29%29%29

# Henvendelser

## For Nav-ansatte

* Dette Git-repositoriet eies
  av [Team Toi i Produktområde arbeidsgiver](https://teamkatalog.nav.no/team/76f378c5-eb35-42db-9f4d-0e8197be0131)
  .
* Slack-kanaler:
    * [#arbeidsgiver-toi-dev](https://nav-it.slack.com/archives/C02HTU8DBSR)
    * [#arbeidsgiver-utvikling](https://nav-it.slack.com/archives/CD4MES6BB)

## For folk utenfor Nav

* Opprett gjerne en issue i Github for alle typer spørsmål
* IT-utviklerne i Github-teamet https://github.com/orgs/navikt/teams/toi
* IT-avdelingen
  i [Arbeids- og velferdsdirektoratet](https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Relatert+informasjon/arbeids-og-velferdsdirektoratet-kontorinformasjon)
