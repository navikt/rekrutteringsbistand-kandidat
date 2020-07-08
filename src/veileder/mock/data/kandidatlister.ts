import { Status } from './../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { KandidatlisteResponse } from './../../kandidatlister/kandidatlistetyper';
import { KanSletteEnum } from '../../kandidatlister/Kandidatlister';
import { Tilgjengelighet } from '../../sok/Søkeresultat';
import { v5 as uuid } from 'uuid';
import cver from './cver';
import { Utfall } from '../../kandidatlister/kandidatliste/kandidatrad/utfall-select/UtfallSelect';

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

const baseKandidatliste: Omit<KandidatlisteResponse, 'kandidater'> = {
    kandidatlisteId: 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29',
    tittel: 'Tulleskolen søker tøysekopper',
    beskrivelse:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    organisasjonReferanse: '976434099',
    organisasjonNavn: 'TULLEKONTORET AS',
    stillingId: 'ce3da214-8771-4115-9362-b83145150551',
    opprettetAv: {
        ident: 'Z992777',
        navn: 'F_Z992776 E_Z992776',
    },
    opprettetTidspunkt: '2019-11-18T11:40:34.732',
    kanEditere: true,
    kanSlette: KanSletteEnum.KAN_SLETTES,
};

const enCv = cver[0];

export const kandidatlister: KandidatlisteResponse[] = tomListe.map((_, i) => ({
    ...baseKandidatliste,
    tittel: lagTittel(i),
    kandidatlisteId: lagUuid(lagTittel(i)),
    kandidater: [
        {
            kandidatId: lagUuid(enCv.kandidatnummer),
            kandidatnr: enCv.kandidatnummer,
            sisteArbeidserfaring: 'Butikkinnehaver (liten butikk)',
            status: Status.Vurderes,
            lagtTilTidspunkt: new Date().toISOString(),
            lagtTilAv: {
                ident: 'Z990315',
                navn: 'F_Z990315 E_Z990315',
            },
            fornavn: enCv.fornavn,
            etternavn: enCv.etternavn,
            fodselsdato: enCv.fodselsdato,
            fodselsnr: enCv.fodselsnummer,
            utfall: Utfall.IkkePresentert,
            telefon: '(+47) 123456789',
            eepost: 'spammenot@mailinator.com',
            innsatsgruppe: 'Situasjonsbestemt innsats',
            arkivert: false,
            antallNotater: 1,
            arkivertTidspunkt: null,
            arkivertAv: null,
            aktørId: '12345678910',
            midlertidigUtilgjengeligStatus: Tilgjengelighet.TilgjengeligInnen1Uke,
            erSynlig: true,
        },
    ],
}));

export const kandidatliste = kandidatlister[0];
