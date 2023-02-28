import moment from 'moment';
import { v5 as uuid } from 'uuid';

import type Cv from '../../kandidatside/cv/reducer/cv-typer';
import { KanSletteEnum } from '../../listeoversikt/Kandidatlisteoversikt';
import {
    Kandidatliste,
    KandidatlisteSammendrag,
    Kandidatlistestatus,
    Stillingskategori,
} from '../../kandidatliste/domene/Kandidatliste';
import {
    AktørId,
    FormidlingAvUsynligKandidat,
    Kandidat,
    Kandidatstatus,
    Kandidatutfall,
} from '../../kandidatliste/domene/Kandidat';
import {
    ForespørselDeltStatus,
    ForespørselOmDelingAvCv,
    IdentType,
    TilstandPåForespørsel,
} from '../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import type { KandidatlisteForKandidat } from '../../kandidatside/historikk/historikkReducer';
import { Veileder } from './veileder';

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

const standardKandidatliste = (eier: Veileder): Kandidatliste => ({
    kandidatlisteId: 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29',
    tittel: 'Tulleskolen søker tøysekopper',
    beskrivelse:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    organisasjonReferanse: '976434099',
    organisasjonNavn: 'TULLEKONTORET AS',
    stillingId: 'ce3da214-8771-4115-9362-b83145150551',
    opprettetAv: {
        ident: eier.ident,
        navn: eier.navn,
    },
    opprettetTidspunkt: '2019-11-18T11:40:34.732',
    kanEditere: true,
    kanSlette: KanSletteEnum.KAN_SLETTES,
    status: Kandidatlistestatus.Åpen,
    stillingskategori: Stillingskategori.Stilling,
    kandidater: [],
    formidlingerAvUsynligKandidat: [],
    antallStillinger: 7,
});

const iDag = new Date();
const forrigeUke = new Date(Number(new Date()) - 1000 * 60 * 60 * 24 * 7);

export const mockKandidat = (cv: Cv, lagtTilAv: Veileder, lagtTilTidspunkt = iDag): Kandidat => ({
    kandidatnr: cv.kandidatnummer,
    status: Kandidatstatus.Vurderes,
    lagtTilTidspunkt: lagtTilTidspunkt.toISOString(),
    lagtTilAv: {
        ident: lagtTilAv?.ident || '<ident>',
        navn: lagtTilAv?.navn || '<veileders-navn>',
    },
    fornavn: cv.fornavn,
    etternavn: cv.etternavn,
    fodselsdato: cv.fodselsdato,
    fodselsnr: cv.fodselsnummer,
    utfall: Kandidatutfall.IkkePresentert,
    utfallsendringer: [],
    telefon: '(+47) 123456789',
    epost: 'spammenot@mailinator.com',
    innsatsgruppe: 'Situasjonsbestemt innsats',
    arkivert: false,
    antallNotater: 1,
    arkivertTidspunkt: null,
    arkivertAv: null,
    aktørid: cv.aktorId,
    erSynlig: true,
});

const inaktivKandidat = {
    telefon: null,
    aktørid: null,
    epost: null,
    innsatsgruppe: null,
    fodselsnr: null,
};

const fraCvTilUsynligKandidat = (cv: Cv, meg: Veileder): FormidlingAvUsynligKandidat => ({
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

export const mockUsynligKandidat = (cv: Cv, meg: Veileder): FormidlingAvUsynligKandidat => ({
    ...fraCvTilUsynligKandidat(cv, meg),
});

export const mockKandidatlister = (
    eier: Veileder,
    enAnnenVeileder: Veileder,
    cver: Cv[]
): Kandidatliste[] =>
    tomListe.map((_, index) => mockKandidatliste(eier, enAnnenVeileder, cver, index));

const mockKandidatliste = (
    eier: Veileder,
    enAnnenVeileder: Veileder,
    cver: Cv[],
    i: number
): Kandidatliste => {
    const erEier = i < 10;
    const harStilling = i % 5 < 3;
    const erLukket = i % 5 === 2;
    const harUsynligKandidat = i % 5 === 1;
    const erTomListe = i === 9;
    const harAlleSomFåttJobb = i === 1;
    const enAnnenVeilederHarOgsåLagtTilKandidater = i === 0;

    let kandidatliste = standardKandidatliste(eier);
    let kandidater: Kandidat[] = [];

    let standardKandidater: Kandidat[] = [
        {
            ...mockKandidat(cver[0], eier),
            status: Kandidatstatus.TilIntervju,
            utfall: Kandidatutfall.IkkePresentert,
            utfallsendringer: [
                {
                    registrertAvIdent: eier.ident,
                    sendtTilArbeidsgiversKandidatliste: false,
                    tidspunkt: new Date().toISOString(),
                    utfall: Kandidatutfall.IkkePresentert,
                },
                {
                    registrertAvIdent: eier.ident,
                    sendtTilArbeidsgiversKandidatliste: true,
                    tidspunkt: moment().subtract(1, 'day').toISOString(),
                    utfall: Kandidatutfall.Presentert,
                },
            ],
        },
        {
            ...mockKandidat(cver[1], eier),
            status: Kandidatstatus.Kontaktet,
            utfall: Kandidatutfall.Presentert,
            ...inaktivKandidat,
        },
        {
            ...mockKandidat(
                cver[2],
                enAnnenVeilederHarOgsåLagtTilKandidater ? enAnnenVeileder : eier
            ),
            status: Kandidatstatus.Kontaktet,
            utfall: Kandidatutfall.Presentert,
            utfallsendringer: [
                {
                    registrertAvIdent: eier.ident,
                    sendtTilArbeidsgiversKandidatliste: false,
                    tidspunkt: new Date().toISOString(),
                    utfall: Kandidatutfall.Presentert,
                },
                {
                    registrertAvIdent: eier.ident,
                    sendtTilArbeidsgiversKandidatliste: false,
                    tidspunkt: moment().subtract(1, 'day').toISOString(),
                    utfall: Kandidatutfall.FåttJobben,
                },
                {
                    registrertAvIdent: eier.ident,
                    sendtTilArbeidsgiversKandidatliste: true,
                    tidspunkt: moment().subtract(2, 'day').toISOString(),
                    utfall: Kandidatutfall.Presentert,
                },
            ],
        },
        {
            ...mockKandidat(cver[3], eier, forrigeUke),
            status: Kandidatstatus.Aktuell,
            utfall: Kandidatutfall.IkkePresentert,
        },
        {
            ...mockKandidat(cver[4], eier),
            status: Kandidatstatus.Uaktuell,
            utfall: Kandidatutfall.IkkePresentert,
            ...inaktivKandidat,
        },
        {
            ...mockKandidat(
                cver[5],
                enAnnenVeilederHarOgsåLagtTilKandidater ? enAnnenVeileder : eier
            ),
            status: Kandidatstatus.Uinteressert,
            utfall: Kandidatutfall.IkkePresentert,
        },
        {
            ...mockKandidat(cver[6], eier, forrigeUke),
            status: Kandidatstatus.Vurderes,
            utfall: Kandidatutfall.IkkePresentert,
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
        ...kandidatliste,
        opprettetTidspunkt: new Date().toISOString(),

        stillingskategori: Stillingskategori.Stilling,
        tittel: harStilling ? lagTittel(i) : lagTittelForListeUtenStilling(i),
        kandidatlisteId: lagUuid(lagTittel(i)),
        status: erLukket ? Kandidatlistestatus.Lukket : Kandidatlistestatus.Åpen,
        kanEditere: erEier ? kandidatliste.kanEditere : false,
        kanSlette: erEier ? kandidatliste.kanSlette : KanSletteEnum.ER_IKKE_DIN,
        stillingId: harStilling ? kandidatliste.stillingId : null,
        opprettetAv: erEier
            ? kandidatliste.opprettetAv
            : {
                  ident: enAnnenVeileder.ident,
                  navn: enAnnenVeileder.navn,
              },
        kandidater,
        formidlingerAvUsynligKandidat:
            harUsynligKandidat && !erTomListe ? [mockUsynligKandidat(cver[7], eier)] : [],
    };
};

export const kandidatlistesammendragLister = (
    kandidatlister: Kandidatliste[]
): KandidatlisteSammendrag[] =>
    kandidatlister.map((liste) => {
        return {
            ...(liste as unknown as KandidatlisteSammendrag),
            antallKandidater: liste.kandidater.length,
            antallUsynligeKandidater: liste.formidlingerAvUsynligKandidat.length,
        };
    });

export const mocketForespørslerOmDelingAvCv = (
    eier: Veileder,
    kandidatliste: Kandidatliste
): Record<AktørId, ForespørselOmDelingAvCv[]> => ({
    [kandidatliste.kandidater[5].aktørid!!]: [
        {
            aktørId: kandidatliste.kandidater[5].aktørid!!,
            stillingsId: kandidatliste.stillingId!,
            deltAv: eier.ident,
            navKontor: eier.navKontor,
            deltTidspunkt: moment().subtract(10, 'day').toISOString(),
            deltStatus: ForespørselDeltStatus.Sendt,
            svarfrist: moment().add(5, 'day').startOf('day').subtract(2, 'hours').toISOString(),
            tilstand: TilstandPåForespørsel.HarSvart,
            svar: {
                harSvartJa: true,
                svarTidspunkt: moment().subtract(1, 'day').startOf('day').toISOString(),
                svartAv: {
                    ident: eier.ident,
                    identType: IdentType.NavIdent,
                },
            },
        },
    ],
});

export const mocketForespørslerOmDelingAvCvForKandidat = (
    eier: Veileder,
    aktørId: string,
    kandidatlisteForKandidat: KandidatlisteForKandidat
): ForespørselOmDelingAvCv[] => [
    {
        aktørId,
        stillingsId: kandidatlisteForKandidat.stillingId!,
        deltAv: eier.ident,
        navKontor: eier.navKontor,
        deltTidspunkt: new Date().toISOString(),
        deltStatus: ForespørselDeltStatus.Sendt,
        svarfrist: moment().add(2, 'day').startOf('day').toISOString(),
        tilstand: TilstandPåForespørsel.HarSvart,
        svar: {
            harSvartJa: true,
            svarTidspunkt: moment().add(1, 'day').startOf('day').toISOString(),
            svartAv: {
                ident: aktørId,
                identType: IdentType.AktørId,
            },
        },
    },
];
