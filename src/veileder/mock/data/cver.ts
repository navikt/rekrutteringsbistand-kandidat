import * as cvData from './cvData';
import Cv from '../../kandidatside/cv/reducer/cv-typer';

export const antall = 20;

const tomListe = [...new Array(antall)];

const fornavn = [
    'André',
    'Are',
    'Bendik',
    'Eivind',
    'Gro',
    'Håvard',
    'Henrietta',
    'Hilde',
    'Joar',
    'Kjetil',
    'Lars Andreas',
    'Malaz',
    'Malin',
    'Martin',
    'Mats',
    'Preben',
    'Sindre',
    'Thomas',
    'Torstein',
    'Vinh',
];

const etternavn = [
    'Andersen',
    'Berg',
    'Dahl',
    'Eriksen',
    'Hagen',
    'Halvorsen',
    'Hansen',
    'Haugen',
    'Jensen',
    'Johansen',
    'Johnsen',
    'Karlsen',
    'Kristiansen',
    'Larsen',
    'Moen',
    'Nilsen',
    'Olsen',
    'Pedersen',
    'Pettersen',
    'Solberg',
];

const fødselsnumre = [
    '25068036448',
    '31057943257',
    '13018231837',
    '29117333955',
    '10059343721',
    '21049538526',
    '26018828331',
    '21067630103',
    '17026726816',
    '22080097003',
    '26088024140',
    '12077918556',
    '22119749836',
    '01038215430',
    '26066914886',
    '13106340786',
    '02085427108',
    '16039539091',
    '16047926231',
    '18105726895',
];

const baseCv: Cv = {
    aktorId: '1000055261743',
    fodselsdato: '2019-01-09',
    fornavn: 'aasmund',
    etternavn: 'nordstoga',
    statsborgerskap: null,
    samtykkeDato: '2019-01-29',
    samtykkeStatus: 'G',
    disponererBil: false,
    beskrivelse: '',
    epost: 'anostoga@gmail.com',
    mobiltelefon: null,
    telefon: '91333532',
    adresse: {
        landkode: 'Norge',
        postnr: '0662',
        poststednavn: 'OSLO',
        kommunenr: 301,
        adrlinje1: 'Arbeids- og velferdsdirektoratet, Sannergata 2',
        adrlinje2: '',
        adrlinje3: '',
    },
    kandidatnummer: 'CD430805',
    sistEndret: '2019-11-18T12:17:17.005',
    oppstartKode: 'ETTER_AVTALE',
    utdanning: cvData.utdanning,
    fagdokumentasjon: [
        { tittel: 'Fagbrev maritime fag', type: 'Fagbrev/svennebrev', beskrivelse: null },
        { tittel: 'Svennebrev urmaker', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
    ],
    yrkeserfaring: cvData.yrkeserfaring,
    sertifikater: cvData.sertifikater,
    forerkort: cvData.forerkort,
    kompetanse: cvData.kompetanse,
    sprak: cvData.sprak,
    sprakferdigheter: cvData.sprakferdigheter,
    kurs: cvData.kurs,
    verv: [],
    geografiJobbonsker: [{ geografiKode: 'NO07.0712', geografiKodeTekst: 'Larvik' }],
    yrkeJobbonsker: [{ styrkKode: null, styrkBeskrivelse: 'Slakter', primaertJobbonske: false }],
    omfangJobbprofil: [
        { heltidDeltidKode: 'HELTID', heltidDeltidKodeTekst: 'Heltid' },
        { heltidDeltidKode: 'DELTID', heltidDeltidKodeTekst: 'Deltid' },
    ],
    ansettelsesformJobbprofil: [
        { ansettelsesformKode: 'FAST', ansettelsesformKodeTekst: 'Fast' },
        { ansettelsesformKode: 'VIKARIAT', ansettelsesformKodeTekst: 'Vikariat' },
    ],
    arbeidsdagerJobbprofil: [],
    arbeidstidsordningJobbprofil: [],
    arbeidstidJobbprofil: [
        { arbeidstidKode: 'DAGTID', arbeidstidKodeTekst: 'Dagtid' },
        { arbeidstidKode: 'KVELD', arbeidstidKodeTekst: 'Kveld' },
    ],
    annenErfaring: [{ fraDato: '2004-01-02', tilDato: null, rolle: 'ss', beskrivelse: 'sas' }],
    fodselsnummer: '21067630103',
    tilretteleggingsbehov: true,
    veilederEpost: 'james.bond@nav.no',
    veilederIdent: 'X123456',
    veilederNavn: 'James Bond',
};

const bokstaver = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const kandidatnumre = tomListe.map((_, i) => {
    const toBokstaver = bokstaver[i % bokstaver.length] + bokstaver[(i + 1) % bokstaver.length];
    return toBokstaver + '123456';
});

const cver = tomListe.map((_, i) => ({
    ...baseCv,
    kandidatnummer: kandidatnumre[i],
    fornavn: fornavn[i % fornavn.length],
    etternavn: etternavn[i % etternavn.length],
    fodselsnummer: fødselsnumre[i % fødselsnumre.length],
}));

export default cver;