import fetchMock, { MockResponse, MockResponseFunction } from 'fetch-mock';

import notater from './json/notater.json';
import sokeord from './json/sokeord.json';
import kandidatlisteBasertPaAnnonsenummer from './json/kandidatlisteBasertPaAnnonsenummer.json';
import arenageografikoder from './json/arenageografikoder.json';
import typeaheadgeo from './json/typeaheadgeo.json';
import sms from './json/sms.json';
import ferdigutfyltesok from './json/ferdigutfyltesok.json';
import enhetsregister from './json/enhetsregister.json';
import cver from './data/cv.mock';
import stilling from './data/stilling.mock.json';
import annenStilling from './data/annen-stilling.mock.json';
import kandidatmatch from './data/kandidatmatch.mock.json';

import {
    kandidatliste,
    kandidatlister,
    kandidatlistesammendragLister,
    mockKandidat,
    mockUsynligKandidat,
} from './data/kandidatliste.mock';
import { kandidatlisterForKandidatMock } from './data/kandidatlister-for-kandidat.mock';
import { featureToggles } from './data/feature-toggles.mock';
import søk from './data/søk.mock';
import { meg } from './data/veiledere.mock';
import {
    forespørslerOmDelingAvCv,
    forespørslerOmDelingAvCvForKandidat,
} from './data/forespørslerOmDelingAvCv.mock';
import { FormidlingAvUsynligKandidatOutboundDto } from '../kandidatliste/modaler/legg-til-kandidat-modal/LeggTilKandidatModal';
import { KANDIDATSOK_API, SMS_API, ENHETSREGISTER_API, SYNLIGHET_API } from '../api/api';
import { FORESPORSEL_OM_DELING_AV_CV_API } from '../api/forespørselOmDelingAvCvApi';
import { Kandidatutfall } from '../kandidatliste/domene/Kandidat';
import { KANDIDATMATCH_API_URL, STILLINGSSØK_PROXY } from '../automatisk-matching/kandidatmatchApi';

fetchMock.config.fallbackToNetwork = true;

const api = `express:${KANDIDATSOK_API}`;
const smsApi = `express:${SMS_API}`;
const forespørselOmDelingAvCvApi = `express:${FORESPORSEL_OM_DELING_AV_CV_API}`;
const kandidatmatchApi = `express:${KANDIDATMATCH_API_URL}`;
const synlighetApi = `express:${SYNLIGHET_API}`;
const stillingssøkProxy = `express:${STILLINGSSØK_PROXY}`;

const url = {
    // Kandidatsøket
    kandidatsøk: `${api}/veileder/kandidatsok/sok`,
    kandidatlisteFraStilling: `${api}/veileder/stilling/:stillingsId/kandidatliste`,
    søkeord: `${api}/kandidatsok/stilling/sokeord/:kandidatlisteId`,
    arenageografikoder: `${api}/kodeverk/arenageografikoder/:kode`,
    ferdigutfyltesokurl: `${api}/veileder/ferdigutfyltesok`,
    ferdigutfyltesokurlPost: `${api}/veileder/ferdigutfyltesok/klikk`,
    typeahead: `${api}/veileder/kandidatsok/typeahead`,
    fnrsok: `${api}/veileder/kandidatsok/fnrsok`,
    synlighetsevaluering: `${synlighetApi}/evaluering/:fnr`,

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
    postFormidlingerAvUsynligKandidat: `${api}/veileder/kandidatlister/:kandidatlisteId/formidlingeravusynligkandidat`,
    putFormidlingerAvUsynligKandidat: `${api}/veileder/kandidatlister/:kandidatlisteId/formidlingeravusynligkandidat/:formidlingId/utfall`,
    putKandidatlistestatus: `${api}/veileder/kandidatlister/:kandidatlisteId/status`,
    getKandidatlisteBasertPåAnnonsenummer: `${api}/veileder/stilling/byNr/:annonsenummer/kandidatliste`,
    putSlettCvFraArbeidsgiversKandidatliste: `${api}/veileder/kandidat/arbeidsgiverliste/:kandidatlisteId/:kandidatnummer`,

    forespørselOmDelingAvCv: `${forespørselOmDelingAvCvApi}/foresporsler/:stillingsId`,
    forespørselOmDelingAvCvForKandidat: `${forespørselOmDelingAvCvApi}/foresporsler/kandidat/:aktorId`,
    postForespørselOmDelingAvCv: `${forespørselOmDelingAvCvApi}/foresporsler`,
    postResendForespørselOmDelingAvCv: `${forespørselOmDelingAvCvApi}/foresporsler/kandidat/:aktorId`,

    // Stillingssøk
    stilling: `${stillingssøkProxy}/stilling/_doc/:stillingsId`,

    // Kandidatmatch
    kandidatmatch: `${kandidatmatchApi}/match`,

    // Alternative backends
    sms: `${smsApi}/:kandidatlisteId`,
    smsFnr: `${smsApi}/fnr/:fnr`,
    smsPost: `${smsApi}`,
    enhetsregister: `${ENHETSREGISTER_API}/underenhet/_search`,

    // Misc
    toggles: `${api}/veileder/kandidatsok/toggles`,
};

const getCv = (url: string) => {
    const queryParams = url.split('?').pop();
    const kandidatnr = new URLSearchParams(queryParams).get('kandidatnr');

    if (!kandidatnr) {
        return 404;
    } else {
        return cver.find((cv) => cv.kandidatnummer === kandidatnr);
    }
};

const getUsynligKandidat = () => [mockUsynligKandidat(7)];

const getKandidatlister = (url: string) => {
    const queryParams = url.split('?').pop();
    const params = new URLSearchParams(queryParams);
    const stillingsfilter = params.get('type');
    const eierfilter = params.get('kunEgne') && Boolean(params.get('kunEgne'));

    let filtrerteKandidatlister = kandidatlistesammendragLister;
    if (stillingsfilter) {
        filtrerteKandidatlister = kandidatlistesammendragLister.filter((k) =>
            stillingsfilter === 'MED_STILLING' ? !!k.stillingId : !k.stillingId
        );
    }

    filtrerteKandidatlister = filtrerteKandidatlister.filter((k) =>
        eierfilter ? k.opprettetAv.ident === meg.ident : true
    );

    return {
        antall: filtrerteKandidatlister.length,
        liste: filtrerteKandidatlister,
    };
};

const getKandidatliste = (url: string) => {
    const kandidatlisteId = url.split('/').pop();
    return kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);
};

const getStilling = (url: string) => {
    const stillingsId = url.split('/').pop();
    return stillingsId === stilling._source.stilling.uuid ? stilling : annenStilling;
};

const postKandidater = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatlisteId = url.split('/')[url.split('/').length - 2];
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);

    if (!kandidatliste) {
        return {
            status: 404,
        };
    }

    const kandidatnumre = JSON.parse(String(options.body));
    const cvIndekser: number[] = kandidatnumre.map((kandidat: any) =>
        cver.findIndex((cv) => cv.kandidatnummer === kandidat.kandidatnr)
    );

    const nyeKandidater = cvIndekser.map((cvIndeks) => mockKandidat(cvIndeks));

    return {
        ...kandidatliste,
        kandidater: [...kandidatliste.kandidater, ...nyeKandidater],
    };
};

const postFormidlingerAvUsynligKandidat = (
    url: string,
    options: fetchMock.MockOptionsMethodPost
) => {
    const kandidatlisteId = url.split('/')[url.split('/').length - 2];
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);
    const body: FormidlingAvUsynligKandidatOutboundDto = JSON.parse(String(options.body));

    if (!kandidatliste) {
        return null;
    }

    return {
        ...kandidatliste,
        formidlingerAvUsynligKandidat: [
            ...kandidatliste.formidlingerAvUsynligKandidat,
            {
                ...mockUsynligKandidat(7),
                utfall: body.fåttJobb ? Kandidatutfall.FåttJobben : Kandidatutfall.Presentert,
            },
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

const putUtfallForFormidlingAvUsynligKandidat = (
    url: string,
    options: fetchMock.MockOptionsMethodPut
) => {
    const formidlingId = url.split('/').reverse()[1];
    const utfall = JSON.parse(String(options.body)).utfall;

    return {
        ...kandidatliste,
        formidlingerAvUsynligKandidat: kandidatliste.formidlingerAvUsynligKandidat.map(
            (formidling) =>
                formidling.id !== formidlingId
                    ? formidling
                    : {
                          ...formidling,
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

const putKandidatlistestatus = (url: string, options: fetchMock.MockOptionsMethodPut) => {
    const kandidatlisteId = url.split('/').reverse()[1];
    const status = JSON.parse(String(options.body)).status;
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);

    return {
        body: {
            ...kandidatliste,
            status,
        },
        status: 200,
    };
};

const postDelKandidater = (url: string, options: fetchMock.MockOptionsMethodPost) => {
    const kandidatlisteId = url.split('/').reverse()[1];
    const kandidatliste = kandidatlister.find((liste) => liste.kandidatlisteId === kandidatlisteId);
    const delteKandidater = JSON.parse(String(options.body)).kandidater;

    return {
        body: {
            ...kandidatliste,
            kandidater: kandidatliste?.kandidater.map((kandidat) => {
                return delteKandidater.includes(kandidat.kandidatnr)
                    ? {
                          ...kandidat,
                          utfall: Kandidatutfall.Presentert,
                      }
                    : kandidat;
            }),
        },
        status: 201,
    };
};

const postFnrsok = (url: string, options: fetchMock.MockOptionsMethodPost): MockResponse => {
    const fnr = JSON.parse(String(options.body)).fnr;
    const cv = cver.find((k) => k.fodselsnummer === fnr);

    if (cv) {
        return {
            arenaKandidatnr: cv.kandidatnummer,
            fornavn: cv.fornavn,
            etternavn: cv.etternavn,
        };
    } else {
        return {
            status: 404,
        };
    }
};

const getSynlighetsevaluering = (): MockResponse => {
    return {
        status: 200,
        body: {
            harAktivCv: false,
            harJobbprofil: true,
            harSettHjemmel: true,
            maaIkkeBehandleTidligereCv: true,
            erIkkeFritattKandidatsøk: true,
            erUnderOppfoelging: true,
            harRiktigFormidlingsgruppe: true,
            erIkkeSperretAnsatt: true,
            erIkkeDoed: true,
            erFerdigBeregnet: true,
        },
    };
};

const postEnhetsregister = () => {
    return enhetsregister;
};

const putSlettCvFraArbeidsgiversKandidatliste = (
    url: string,
    options: fetchMock.MockOptionsMethodPost
): MockResponse => {
    const splittetUrl = url.split('/');

    const kandidatnummer = splittetUrl.pop();
    const kandidatlisteId = splittetUrl.pop();

    const kandidatliste = kandidatlister.find(
        (liste) => liste.kandidatlisteId === kandidatlisteId
    )!!;

    return {
        ...kandidatliste,
        kandidater: kandidatliste.kandidater.map((kandidat) =>
            kandidat.kandidatnr !== kandidatnummer
                ? kandidat
                : {
                      ...kandidat,
                      utfall: Kandidatutfall.IkkePresentert,
                      utfallsendringer: [
                          ...kandidat.utfallsendringer,
                          {
                              utfall: Kandidatutfall.IkkePresentert,
                              tidspunkt: new Date().toISOString(),
                              registrertAvIdent: meg.ident,
                              sendtTilArbeidsgiversKandidatliste: false,
                          },
                      ],
                  }
        ),
    };
};

const log = (response: MockResponse | MockResponseFunction) => {
    return (url: string, options) => {
        console.log(
            '%cMOCK %s %s',
            'color: lightgray;',
            options.method || 'GET',
            url.includes('rekrutteringsbistand-kandidat-api') ? url.substring(46) : url,
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
    .get(url.cv, log(getCv), {
        delay: 200,
    })
    .get(url.listeoversikt, log(kandidatlisterForKandidatMock))

    // Kandidatliste
    .get(url.kandidatlister, log(getKandidatlister))
    .get(url.kandidatliste, log(getKandidatliste))
    .post(url.kandidatlistePost, log(201))
    .get(url.notater, log(notater))
    .post(url.notater, log(notater))
    .mock(url.notaterMedId, log(notater))
    .get(url.sms, log(sms))
    .get(url.smsFnr, log(sms))
    .post(url.smsPost, log(201))
    .put(url.utfallPut, log(putUtfall))
    .put(url.statusPut, log(putStatus))
    .put(url.arkivertPut, log(putArkivert))
    .post(url.fnrsok, log(postFnrsok))
    .get(url.synlighetsevaluering, log(getSynlighetsevaluering))
    .post(url.postKandidater, log(postKandidater))
    .post(url.delKandidater, log(postDelKandidater))
    .get(url.søkeord, log(sokeord))
    .get(url.arenageografikoder, log(arenageografikoder))
    .post(url.søkUsynligKandidat, log(getUsynligKandidat))
    .post(url.postFormidlingerAvUsynligKandidat, log(postFormidlingerAvUsynligKandidat))
    .put(url.putFormidlingerAvUsynligKandidat, log(putUtfallForFormidlingAvUsynligKandidat))
    .put(url.putKandidatlistestatus, log(putKandidatlistestatus))
    .get(url.forespørselOmDelingAvCv, log(forespørslerOmDelingAvCv))
    .get(url.forespørselOmDelingAvCvForKandidat, log(forespørslerOmDelingAvCvForKandidat))
    .post(url.postForespørselOmDelingAvCv, log({ body: forespørslerOmDelingAvCv, status: 201 }))
    .post(
        url.postResendForespørselOmDelingAvCv,
        log({ body: forespørslerOmDelingAvCv, status: 201 })
    )
    .get(url.getKandidatlisteBasertPåAnnonsenummer, log(kandidatlisteBasertPaAnnonsenummer))
    .put(url.putSlettCvFraArbeidsgiversKandidatliste, log(putSlettCvFraArbeidsgiversKandidatliste))

    // Stillingssøk
    .get(url.stilling, log(getStilling))

    // Kandidatmatch
    .post(url.kandidatmatch, log(kandidatmatch))

    // Misc
    .get(url.toggles, log(featureToggles))
    .post(url.enhetsregister, log(postEnhetsregister));
