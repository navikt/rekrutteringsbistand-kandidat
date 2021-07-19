import {
    Kandidatliste,
    KandidatlisteSammendrag,
    Kandidatlistestatus,
} from '../../kandidatliste/domene/Kandidatliste';
import {
    FormidlingAvUsynligKandidat,
    Kandidat,
    Kandidatstatus,
    Kandidatutfall,
} from '../../kandidatliste/domene/Kandidat';
import { KanSletteEnum } from '../../listeoversikt/Kandidatlisteoversikt';
import { v5 as uuid } from 'uuid';
import cver from './cv.mock';
import Cv, { Tilgjengelighet } from '../../kandidatside/cv/reducer/cv-typer';
import { enAnnenVeileder, enVeileder, meg, Veileder } from './veiledere.mock';

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
    'rørleggere',
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
    `${bedrifter[i % bedrifter.length]} ${verb[i % verb.length]} ${yrker[i % yrker.length]}`;

const lagTittelForListeUtenStilling = (i: number) => `Liste over ${yrker[i % yrker.length]}`;

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
    antallStillinger: 7,
};

const iDag = new Date();
const forrigeUke = new Date(Number(new Date()) - 1000 * 60 * 60 * 24 * 7);

export const mockKandidat = (
    cvIndex: number,
    lagtTilAv: Veileder = meg,
    lagtTilTidspunkt = iDag
): Kandidat => ({
    kandidatnr: cver[cvIndex].kandidatnummer,
    status: Kandidatstatus.Vurderes,
    lagtTilTidspunkt: lagtTilTidspunkt.toISOString(),
    lagtTilAv: {
        ident: lagtTilAv?.ident || '<ident>',
        navn: lagtTilAv?.navn || '<veileders-navn>',
    },
    fornavn: cver[cvIndex].fornavn,
    etternavn: cver[cvIndex].etternavn,
    fodselsdato: cver[cvIndex].fodselsdato,
    fodselsnr: cver[cvIndex].fodselsnummer,
    utfall: Kandidatutfall.IkkePresentert,
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

const inaktivKandidat = {
    telefon: null,
    aktørid: null,
    epost: null,
    innsatsgruppe: null,
    fodselsnr: null,
};

const mockMidlertidigUtilgjengeligStatus = (cvIndex: number) => {
    return cvIndex === 3
        ? Tilgjengelighet.TilgjengeligInnen1Uke
        : cvIndex === 4
        ? Tilgjengelighet.MidlertidigUtilgjengelig
        : Tilgjengelighet.Tilgjengelig;
};

const fraCvTilUsynligKandidat = (cv: Cv): FormidlingAvUsynligKandidat => ({
    id: '0',
    fornavn: cv.fornavn,
    mellomnavn: null,
    etternavn: cv.etternavn,
    lagtTilAvIdent: cv.veilederIdent || meg.ident,
    lagtTilAvNavn: cv.veilederNavn || meg.navn,
    lagtTilTidspunkt: new Date().toISOString(),
    utfall: Kandidatutfall.Presentert,
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
    const harAlleSomFåttJobb = i === 1;
    const enAnnenVeilederHarOgsåLagtTilKandidater = i === 0;

    let kandidater: Kandidat[] = [];
    let standardKandidater: Kandidat[] = [
        {
            ...mockKandidat(0, meg),
            status: Kandidatstatus.TilIntervju,
            utfall: Kandidatutfall.FåttJobben,
        },
        {
            ...mockKandidat(1, meg),
            status: Kandidatstatus.Kontaktet,
            utfall: Kandidatutfall.Presentert,
            ...inaktivKandidat,
        },
        {
            ...mockKandidat(2, enAnnenVeilederHarOgsåLagtTilKandidater ? enAnnenVeileder : meg),
            status: Kandidatstatus.Kontaktet,
            utfall: Kandidatutfall.IkkePresentert,
        },
        {
            ...mockKandidat(3, meg, forrigeUke),
            status: Kandidatstatus.Aktuell,
            utfall: Kandidatutfall.IkkePresentert,
        },
        {
            ...mockKandidat(4, meg),
            status: Kandidatstatus.Uaktuell,
            utfall: Kandidatutfall.FåttJobben,
            ...inaktivKandidat,
        },
        {
            ...mockKandidat(5, enAnnenVeilederHarOgsåLagtTilKandidater ? enAnnenVeileder : meg),
            status: Kandidatstatus.Uinteressert,
            utfall: Kandidatutfall.IkkePresentert,
        },
        {
            ...mockKandidat(6, meg, forrigeUke),
            status: Kandidatstatus.Vurderes,
            utfall: Kandidatutfall.FåttJobben,
        },
    ];
    if (!erTomListe) {
        kandidater = standardKandidater;
    }

    if (harAlleSomFåttJobb) {
        kandidater = kandidater.map((kandidat) => ({
            ...kandidat,
            utfall: Kandidatutfall.FåttJobben,
        }));
    }

    return {
        ...standard,
        tittel: harStilling ? lagTittel(i) : lagTittelForListeUtenStilling(i),
        kandidatlisteId: lagUuid(lagTittel(i)),
        status: erLukket ? Kandidatlistestatus.Lukket : Kandidatlistestatus.Åpen,
        kanEditere: erEier ? standard.kanEditere : false,
        kanSlette: erEier ? standard.kanSlette : KanSletteEnum.ER_IKKE_DIN,
        organisasjonNavn: harStilling ? standard.organisasjonNavn : null,
        stillingId: harStilling ? standard.stillingId : null,
        opprettetAv: erEier
            ? standard.opprettetAv
            : {
                  ident: enVeileder.ident,
                  navn: enVeileder.navn,
              },
        kandidater,
        formidlingerAvUsynligKandidat:
            harUsynligKandidat && !erTomListe ? [mockUsynligKandidat(7)] : [],
    };
});

export const kandidatlistesammendragLister: KandidatlisteSammendrag[] = kandidatlister.map((l) => {
    return {
        ...((l as unknown) as KandidatlisteSammendrag),
        antallKandidater: l.kandidater.length,
        antallUsynligeKandidater: l.formidlingerAvUsynligKandidat.length,
    };
});

export const kandidatliste = kandidatlister[0];
