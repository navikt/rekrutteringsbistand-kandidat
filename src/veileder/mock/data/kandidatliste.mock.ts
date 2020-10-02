import {
    Kandidatstatus,
    Kandidatlistestatus,
    Kandidatliste,
    Kandidat,
    FormidlingAvUsynligKandidat,
} from '../../kandidatliste/kandidatlistetyper';
import { KanSletteEnum } from '../../listeoversikt/Kandidatlisteoversikt';
import { Tilgjengelighet } from '../../sok/Søkeresultat';
import { v5 as uuid } from 'uuid';
import cver from './cv.mock';
import { Utfall } from '../../kandidatliste/kandidatrad/utfall-select/UtfallSelect';
import Cv from '../../kandidatside/cv/reducer/cv-typer';
import { meg, deg, Veileder } from './veiledere.mock';

const antall = 15;
const tomListe = [...new Array(antall)];

const bedrifter = [
    'Accenture',
    'Atea',
    'Bekk',
    'Bouvet',
    'Capgemini',
    'Ciber',
    'Deloitte',
    'Evry',
    'Itera',
    'JProfessionals',
    'Kantega',
    'KPMG',
    'NAV',
    'Sopra',
    'Visma',
];

const verb = ['søker', 'trenger', 'har behov for', 'ønsker å ansette', 'leter etter'];

const yrker = [
    'piloter',
    'leger',
    'brannslukkere',
    'politifolk',
    'modeller',
    'ambulansesjåfører',
    'sykepleiere',
    'ambassadører',
    'professorer',
    'prester',
    'dyrleger',
    'nødhjelpsarbeidere',
    'lærere',
    'influencere',
    'dykkere',
    'forfattere',
    'musikkstjerner',
    'livvakter',
    'skuespillere',
    'fysioterapeuter',
];

const lagTittel = (i: number) =>
    `${bedrifter[i % bedrifter.length]} ${verb[i % verb.length]} ${yrker[i % bedrifter.length]}`;

const lagUuid = (seed: string) => uuid(seed, 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29');

const standard: Kandidatliste = {
    kandidatlisteId: 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29',
    tittel: 'Tulleskolen søker tøysekopper',
    beskrivelse:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    organisasjonReferanse: '976434099',
    organisasjonNavn: 'TULLEKONTORET AS',
    stillingId: 'ce3da214-8771-4115-9362-b83145150551',
    opprettetAv: {
        ident: meg.ident,
        navn: meg.navn,
    },
    opprettetTidspunkt: '2019-11-18T11:40:34.732',
    kanEditere: true,
    kanSlette: KanSletteEnum.KAN_SLETTES,
    status: Kandidatlistestatus.Åpen,
    kandidater: [],
    formidlingerAvUsynligKandidat: [],
    antallStillinger: 0,
};

export const mockKandidat = (cvIndex: number, lagtTilAv?: Veileder): Kandidat => ({
    kandidatId: lagUuid(cver[cvIndex].kandidatnummer),
    kandidatnr: cver[cvIndex].kandidatnummer,
    sisteArbeidserfaring: 'Butikkinnehaver (liten butikk)',
    status: Kandidatstatus.Vurderes,
    lagtTilTidspunkt: new Date().toISOString(),
    lagtTilAv: {
        ident: lagtTilAv?.ident || '<ident>',
        navn: lagtTilAv?.navn || '<veileders-navn>',
    },
    fornavn: cver[cvIndex].fornavn,
    etternavn: cver[cvIndex].etternavn,
    fodselsdato: cver[cvIndex].fodselsdato,
    fodselsnr: cver[cvIndex].fodselsnummer,
    utfall: Utfall.IkkePresentert,
    telefon: '(+47) 123456789',
    epost: 'spammenot@mailinator.com',
    innsatsgruppe: 'Situasjonsbestemt innsats',
    arkivert: false,
    antallNotater: 1,
    arkivertTidspunkt: null,
    arkivertAv: null,
    aktørid: '1234567891023',
    midlertidigUtilgjengeligStatus: mockMidlertidigUtilgjengeligStatus(cvIndex),
    erSynlig: true,
});

const mockMidlertidigUtilgjengeligStatus = (cvIndex: number) => {
    return cvIndex === 3
        ? Tilgjengelighet.TilgjengeligInnen1Uke
        : cvIndex === 4
        ? Tilgjengelighet.MidlertidigUtilgjengelig
        : Tilgjengelighet.Tilgjengelig;
};

export const mockMidlertidigUtilgjengelig = (cvIndex: number) => {
    return {
        midlertidigUtilgjengelig: {
            aktørId: '1234567891023',
            fraDato: '2020-05-04T09:32:10.634147',
            tilDato: '2020-05-26T00:00:00',
            registrertAvIdent: meg.ident,
            registrertAvNavn: meg.navn,
            sistEndretAvIdent: deg.ident,
            sistEndretAvNavn: deg.navn,
        },
    };
};

const fraCvTilUsynligKandidat = (cv: Cv): FormidlingAvUsynligKandidat => ({
    id: '0',
    fornavn: cv.fornavn,
    mellomnavn: null,
    etternavn: cv.etternavn,
    lagtTilAvIdent: cv.veilederIdent || meg.ident,
    lagtTilAvNavn: cv.veilederNavn || meg.navn,
    lagtTilTidspunkt: new Date().toISOString(),
    utfall: Utfall.Presentert,
    arkivert: false,
    arkivertAvIdent: null,
    arkivertAvNavn: null,
    arkivertTidspunkt: null,
});

export const mockUsynligKandidat = (index: number): FormidlingAvUsynligKandidat => ({
    ...fraCvTilUsynligKandidat(cver[index]),
});

export const kandidatlister: Kandidatliste[] = tomListe.map((_, i) => {
    const erEier = i < 10;
    const harStilling = i % 5 < 3;
    const erLukket = i % 5 === 2;
    const harUsynligKandidat = i % 5 === 1;
    const erTomListe = i === 9;

    return {
        ...standard,
        tittel: lagTittel(i),
        kandidatlisteId: lagUuid(lagTittel(i)),
        status: erLukket ? Kandidatlistestatus.Lukket : Kandidatlistestatus.Åpen,
        kanEditere: erEier ? standard.kanEditere : false,
        kanSlette: erEier ? standard.kanSlette : KanSletteEnum.ER_IKKE_DIN,
        organisasjonNavn: harStilling ? standard.organisasjonNavn : null,
        stillingId: harStilling ? standard.organisasjonNavn : null,
        opprettetAv: erEier
            ? standard.opprettetAv
            : {
                  ident: deg.ident,
                  navn: deg.navn,
              },
        kandidater: erTomListe
            ? []
            : [
                  { ...mockKandidat(0, meg), status: Kandidatstatus.Aktuell },
                  mockKandidat(1, meg),
                  mockKandidat(2, meg),
                  mockKandidat(3, meg),
                  mockKandidat(4, meg),
                  mockKandidat(5, meg),
                  mockKandidat(6, meg),
              ],
        formidlingerAvUsynligKandidat:
            harUsynligKandidat && !erTomListe ? [mockUsynligKandidat(7)] : [],
    };
});

export const kandidatliste = kandidatlister[0];
