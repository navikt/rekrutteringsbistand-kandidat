import fetchMock, { MockResponse, MockResponseFunction } from 'fetch-mock';

import notater from './json/notater.json';
import sokeord from './json/sokeord.json';
import arenageografikoder from './json/arenageografikoder.json';
import typeaheadgeo from './json/typeaheadgeo.json';
import midlertidigUtilgjengelig from './json/midlertidigUtilgjengelig.json';
import fnrsok from './json/fnrsok.json';

import sms from './json/sms.json';

import ferdigutfyltesok from './json/ferdigutfyltesok.json';

import aktivEnhet from './json/dekoratør/aktivenhet.json';
import aktivBruker from './json/dekoratør/aktivbruker.json';
import decorator from './json/dekoratør/decorator.json';

import cver from './data/cver';
import {
    kandidatliste,
    kandidatlister,
    hentMocketKandidat,
    hentMocketUsynligKandidat,
} from './data/kandidatlister';
import { kandidatlisterForKandidatMock } from './data/kandidatlister-for-kandidat-mock';
import { featureToggles } from './data/featureToggles';
import søk from './data/søk';

const api = 'express:/pam-kandidatsok-api/rest';

const url = {
    // Kandidatsøket
    kandidatsøk: `${api}/veileder/kandidatsok/sok`,
    kandidatlisteFraStilling: `${api}/veileder/stilling/:stillingsId/kandidatliste`,
    søkeord: `${api}/kandidatsok/stilling/sokeord/:kandidatlisteId`,
    arenageografikoder: `${api}/kodeverk/arenageografikoder/:kode`,
    ferdigutfyltesokurl: `${api}/veileder/ferdigutfyltesok`,
    ferdigutfyltesokurlPost: `${api}/veileder/ferdigutfyltesok/klikk`,
    typeahead: `${api}/veileder/kandidatsok/typeahead`,
    fnrsok: `${api}/veileder/kandidatsok/fnrsok/:fnr`,

    // Cv
    cv: `${api}/veileder/kandidatsok/hentcv`,
    listeoversikt: `${api}/veileder/kandidater/:kandidatnr/listeoversikt`,

    // Kandidatliste
    kandidatlister: `${api}/veileder/kandidatlister`,
    kandidatliste: `${api}/veileder/kandidatlister/:kandidatlisteId`,
    kandidatlistePost: `${api}/veileder/me/kandidatlister`,
    notater: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/notater`,
    notaterMedId: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/notater/:notatId`,
    statusPut: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/status`,
    utfallPut: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/utfall`,
    arkivertPut: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater/:kandidatnr/arkivert`,
    delKandidater: `${api}/veileder/kandidatlister/:kandidatlisteId/deltekandidater`,
    postKandidater: `${api}/veileder/kandidatlister/:kandidatlisteId/kandidater`,
    søkUsynligKandidat: `${api}/veileder/kandidater/navn`,
    postFormidlingerAvUsynligKandidat: `${api}/veileder/kandidatlister/:kandidatlisteId/formidlingerAvUsynligKandidat`,

    // Alternative backends
    sms: `express:/kandidater/api/sms/:kandidatlisteId`,
    smsPost: `/kandidater/api/sms`,
    midlertidigUtilgjengelig: `express:/kandidater/midlertidig-utilgjengelig/:fnr`,

    // Misc
    toggles: `${api}/veileder/kandidatsok/toggles`,
    modiaContext: `/modiacontextholder/api/context`,
    modiaAktivEnhet: `/modiacontextholder/api/context/aktivenhet`,
    modiaAktivBruker: `/modiacontextholder/api/context/aktivbruker`,
    modiaDecorator: `/modiacontextholder/api/decorator`,
};

const getCv = (url: string) => {
    const urlObject = new URL(url);
    const kandidatnr = urlObject.searchParams.get('kandidatnr');

    if (kandidatnr) {
        return cver.find((cv) => cv.kandidatnummer === kandidatnr);
    } else {
        return null;
    }
};

const getUsynligKandidat = () => [hentMocketUsynligKandidat(7)];

const getKandidatlister = () => ({
    antall: kandidatlister.length,
    liste: kandidatlister,
});

const getKandidatliste = (url: string) => {
    const kandidatlisteId = url.split('/').pop();
    return kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);
};

const postKandidater = (url: string) => {
    const kandidatlisteId = url.split('/')[url.split('/').length - 2];
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);

    if (!kandidatliste) {
        return null;
    }

    return {
        ...kandidatliste,
        kandidater: [...kandidatliste.kandidater, hentMocketKandidat(4)],
    };
};

const postFormidlingerAvUsynligKandidat = (url: string) => {
    const kandidatlisteId = url.split('/')[url.split('/').length - 2];
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);

    if (!kandidatliste) {
        return null;
    }

    return {
        ...kandidatliste,
        usynligeKandidater: [
            ...kandidatliste.formidlingerAvUsynligKandidat,
            hentMocketUsynligKandidat(7),
        ],
    };
};

const putStatus = (url: string, options: fetchMock.MockOptionsMethodPut) => {
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

const putArkivert = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatnr = url.split('/').reverse()[1];
    const arkivert = JSON.parse(String(options.body));
    const kandidat = kandidatliste.kandidater.find(
        (kandidat) => kandidat.kandidatnr === kandidatnr
    );

    return {
        ...kandidat,
        arkivert,
    };
};

const log = (response: MockResponse | MockResponseFunction) => {
    return (url: string, options) => {
        console.log(
            '%cMOCK %s %s',
            'color: lightgray;',
            options.method || 'GET',
            url.includes('pam-kandidatsok-api') ? url.substring(46) : url,
            typeof response === 'function' ? response(url, options) : response
        );
        return response;
    };
};

fetchMock
    // Kandidatsøk
    .get(url.kandidatsøk, log(søk))
    .get(url.kandidatlisteFraStilling, log(kandidatliste))
    .get(url.ferdigutfyltesokurl, log(ferdigutfyltesok))
    .post(url.ferdigutfyltesokurlPost, log(ferdigutfyltesok))
    .get(url.typeahead, log(typeaheadgeo))

    // CV
    .get(url.cv, log(getCv))
    .get(url.listeoversikt, log(kandidatlisterForKandidatMock))
    .mock(url.midlertidigUtilgjengelig, log(midlertidigUtilgjengelig))

    // Kandidatliste
    .get(url.kandidatlister, log(getKandidatlister))
    .get(url.kandidatliste, log(getKandidatliste))
    .post(url.kandidatlistePost, log(201))
    .get(url.notater, log(notater))
    .post(url.notater, log(notater))
    .mock(url.notaterMedId, log(notater))
    .get(url.sms, log(sms))
    .post(url.smsPost, log(201))
    .put(url.utfallPut, log(putUtfall))
    .put(url.statusPut, log(putStatus))
    .put(url.arkivertPut, log(putArkivert))
    .get(url.fnrsok, log(fnrsok))
    .post(url.postKandidater, log(postKandidater))
    .post(url.delKandidater, log(kandidatliste))
    .get(url.søkeord, log(sokeord))
    .get(url.arenageografikoder, log(arenageografikoder))
    .post(url.søkUsynligKandidat, log(getUsynligKandidat))
    .post(url.postFormidlingerAvUsynligKandidat, log(postFormidlingerAvUsynligKandidat))

    // Misc
    .get(url.toggles, log(featureToggles))
    .get(url.modiaAktivEnhet, log(aktivEnhet))
    .get(url.modiaAktivBruker, log(aktivBruker))
    .get(url.modiaDecorator, log(decorator))
    .post(url.modiaContext, log(201));
