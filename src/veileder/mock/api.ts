import fetchMock from 'fetch-mock';

import me from './json/me.json';
import { kandidatliste, kandidatlister } from './kandidatlister';
import sok from './json/sok.json';
import notater from './json/notater.json';
import sokeord from './json/sokeord.json';
import arenageografikoder from './json/arenageografikoder.json';
import typeaheadgeo from './json/typeaheadgeo.json';
import midlertidigUtilgjengelig from './json/midlertidigUtilgjengelig.json';

import DC294105 from './json/DC294105.json';
import CD430805 from './json/CD430805.json';
import sms from './json/sms.json';

import ferdigutfyltesok from './json/ferdigutfyltesok.json';

import aktivEnhet from './json/dekoratør/aktivenhet.json';
import aktivBruker from './json/dekoratør/aktivbruker.json';
import decorator from './json/dekoratør/decorator.json';

import { SEARCH_API } from '../common/fasitProperties.js';
import { kandidatlisterForKandidatMock } from './kandidatlister-for-kandidat-mock';
import { featureToggles } from './featureToggles';

const veilederUrl = SEARCH_API.split('/kandidatsok')[0];
const kandidatsokUrl = SEARCH_API.split('/veileder')[0] + '/kandidatsok';

const alleCver = {
    DC294105,
    CD430805,
};

// Veileder
const meUrl = `${veilederUrl}/me`;
const kandidatlisteUrl = `${veilederUrl}/kandidatlister/bf6877fa-5c82-4610-8cf7-ff7a0df18e29`;
const kandidatlisteKandidaterUrl = `${kandidatlisteUrl}/kandidater`;
const hentCvUrl = `${veilederUrl}/kandidatsok/hentcv`;
const typeaheadGeoUrl = `${veilederUrl}/kandidatsok/typeahead?geo=`;
const alleKandidatlisterUrl = `${veilederUrl}/kandidatlister`;
const sokUrl = `${veilederUrl}/kandidatsok/sok`;
const togglesUrl = `${veilederUrl}/kandidatsok/toggles`;
const stillingsKandidatlisteUrl = `${veilederUrl}/stilling/ce3da214-8771-4115-9362-b83145150551/kandidatliste`;
const ferdigutfyltesokurl = `${veilederUrl}/ferdigutfyltesok`;
const kandidatlisterForKandidatUrl = `${veilederUrl}/kandidater/CD430805/listeoversikt`;

// Kodeverk
const arenageografikoderUrl = `http://localhost:8766/pam-kandidatsok-api/rest/kodeverk/arenageografikoder`;

// Kandidatsøk
const sokeordUrl = `${kandidatsokUrl}/stilling/sokeord`;

// Modia context holder
const modiacontextholderApiUrl = '/modiacontextholder/api';
const modiacontextholderAktivEnhetUrl = `${modiacontextholderApiUrl}/context/aktivenhet`;
const modiacontextholderAktivBrukerUrl = `${modiacontextholderApiUrl}/context/aktivbruker`;
const modiacontextholderContextUrl = `${modiacontextholderApiUrl}/context`;
const modiacontextholderDecoratorUrl = `${modiacontextholderApiUrl}/decorator`;

const midlertidigUtilgjengeligApiUrl = '/kandidater/midlertidig-utilgjengelig';
const smsUrl = `/kandidater/api/sms`;
const utfallUrl = `express:/pam-kandidatsok-api/rest/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/utfall`;

const getCv = (url: string) => {
    const urlObject = new URL(url);
    const kandidatnr = urlObject.searchParams.get('kandidatnr');
    return kandidatnr ? alleCver[kandidatnr] : {};
};

const getKandidatlister = () => ({
    antall: kandidatlister.length,
    liste: kandidatlister,
});

const putKandidatlistestatus = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatnr = url.split('/').reverse()[1];
    const status = JSON.parse(String(options.body)).status;

    return {
        ...kandidatliste,
        kandidater: kandidatliste.kandidater.map((kandidat) =>
            kandidat.kandidatnr !== kandidatnr
                ? kandidat
                : {
                      ...kandidat,
                      status,
                  }
        ),
    };
};

const putUtfall = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatnr = url.split('/').reverse()[1];
    const utfall = JSON.parse(String(options.body)).utfall;
    return {
        ...kandidatliste,
        kandidater: kandidatliste.kandidater.map((kandidat) =>
            kandidat.kandidatnr !== kandidatnr
                ? kandidat
                : {
                      ...kandidat,
                      utfall,
                  }
        ),
    };
};

fetchMock
    .get(meUrl, me)
    .get(kandidatlisteUrl, kandidatliste)
    .get(stillingsKandidatlisteUrl, kandidatliste)
    .get((url: string) => url.startsWith(ferdigutfyltesokurl), ferdigutfyltesok)
    .get((url: string) => url.startsWith(typeaheadGeoUrl), typeaheadgeo)
    .mock((url: string) => url.startsWith(kandidatlisteUrl) && url.includes('notater'), notater)
    .put(kandidatlisteKandidaterUrl, putKandidatlistestatus)
    .get((url: string) => url.startsWith(alleKandidatlisterUrl), getKandidatlister)
    .get((url: string) => url.startsWith(hentCvUrl), getCv)
    .get((url: string) => url.startsWith(sokUrl), sok)
    .get((url: string) => url.startsWith(togglesUrl), featureToggles)
    .get((url: string) => url.startsWith(sokeordUrl), sokeord)
    .get(
        (url: string) => url.startsWith(kandidatlisterForKandidatUrl),
        kandidatlisterForKandidatMock
    )
    .get((url: string) => url.startsWith(arenageografikoderUrl), arenageografikoder)
    .post(
        (url: string) => url.startsWith(kandidatlisteUrl) && url.includes('deltekandidater'),
        kandidatliste
    )
    .get((url: string) => url.startsWith(smsUrl), sms)
    .post(
        (url: string) => url.startsWith(smsUrl),
        new Response('SMS er lagret', {
            status: 201,
        })
    )
    .get((url: string) => url.startsWith(arenageografikoderUrl), arenageografikoder)
    .get(modiacontextholderAktivEnhetUrl, aktivEnhet)
    .get(modiacontextholderAktivBrukerUrl, aktivBruker)
    .delete(modiacontextholderAktivBrukerUrl, aktivBruker)
    .get(modiacontextholderDecoratorUrl, decorator)
    .mock((url) => url.startsWith(midlertidigUtilgjengeligApiUrl), midlertidigUtilgjengelig)
    .delete((url) => url.startsWith(midlertidigUtilgjengeligApiUrl), 200)
    .post(modiacontextholderContextUrl, 200)
    .put(utfallUrl, putUtfall);
