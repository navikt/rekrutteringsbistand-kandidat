import fetchMock from 'fetch-mock';

import * as me from './json/me.json';
import * as kandidatliste from './json/kandidatliste.json';
import * as toggles from './json/toggles.json';
import * as sok from './json/sok.json';
import * as notater from './json/notater.json';
import * as sokeord from './json/sokeord.json';
import * as arenageografikoder from './json/arenageografikoder.json';
import * as typeaheadgeo from './json/typeaheadgeo.json';

import * as DC294105 from './json/DC294105.json';
import * as CD430805 from './json/CD430805.json';
import * as sms from './json/sms.json';

import * as ferdigutfyltesok from './json/ferdigutfyltesok.json';

import { SEARCH_API } from '../common/fasitProperties.js';

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
const stillingsKandidatlisteUrl = `${veilederUrl}/stilling/bf6877fa-5c82-4610-8cf7-ff7a0df18e29/kandidatliste`;
const ferdigutfyltesokurl = `${veilederUrl}/ferdigutfyltesok`;

// Kodeverk
const arenageografikoderUrl = `http://localhost:8766/pam-kandidatsok-api/rest/kodeverk/arenageografikoder`;

// Kandidatsøk
const sokeordUrl = `${kandidatsokUrl}/stilling/sokeord`;

// Sms-API
const smsUrl = `/kandidater/api/sms`;

const getCv = (url: string) => {
    const urlObject = new URL(url);
    const kandidatnr = urlObject.searchParams.get('kandidatnr');
    return kandidatnr ? alleCver[kandidatnr] : {};
};

const getKandidatlister = () => {
    const liste = [kandidatliste];

    return {
        antall: liste.length,
        liste,
    };
};

const putKandidatlistestatus = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatnr = url.split('/').reverse()[1];
    const status = JSON.parse(String(options.body)).status;

    return {
        ...kandidatliste,
        kandidater: kandidatliste.kandidater.map(kandidat =>
            kandidat.kandidatnr !== kandidatnr
                ? kandidat
                : {
                      ...kandidat,
                      status,
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
    .put((url: string) => url.startsWith(kandidatlisteKandidaterUrl), putKandidatlistestatus)
    .get((url: string) => url.startsWith(alleKandidatlisterUrl), getKandidatlister)
    .get((url: string) => url.startsWith(hentCvUrl), getCv)
    .get((url: string) => url.startsWith(sokUrl), sok)
    .get((url: string) => url.startsWith(togglesUrl), toggles)
    .get((url: string) => url.startsWith(sokeordUrl), sokeord)
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
    );
