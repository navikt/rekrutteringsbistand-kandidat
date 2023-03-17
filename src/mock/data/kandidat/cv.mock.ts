import * as cvData from './cv-data.mock';
import Cv from '../../../cv/reducer/cv-typer';
import { Veileder } from './veileder.mock';
import { mockStrings } from './mock-strings';

export const antall = 20;

const tomListe = [...new Array(antall)];

const baseCv = (veileder: Veileder): Cv => ({
    fornavn: '<fornavn>',
    etternavn: '<etternavn>',
    kandidatnummer: '<kandidatnr>',

    veilederEpost: veileder.epost,
    veilederIdent: veileder.ident,
    veilederNavn: veileder.navn,

    aktorId: '<aktorId>',
    fodselsdato: '2019-01-09',
    statsborgerskap: null,
    samtykkeDato: '2019-01-29',
    samtykkeStatus: 'G',
    disponererBil: false,
    beskrivelse:
        'Som en dyktig urmaker med 12 års erfaring, har jeg opparbeidet meg omfattende kunnskap og ferdigheter innen reparasjon, vedlikehold og produksjon av ur. Jeg har erfaring med å håndtere en rekke forskjellige typer ur, fra mekaniske klokker til moderne smartklokker. I mitt tidligere arbeid som urmaker har jeg opparbeidet meg en god forståelse av kundens behov, og jeg er alltid forberedt på å yte den beste servicen og kvalitetsarbeidet for å sikre kundetilfredshet. Jeg er også vant til å arbeide effektivt og nøyaktig for å møte stramme tidsfrister.',
    epost: 'eksempel@dev.nav.no',
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
    sistEndret: '2019-11-18T12:17:17.005',
    oppstartKode: 'ETTER_AVTALE',
    utdanning: cvData.utdanning,
    fagdokumentasjon: [
        { tittel: 'Fagbrev maritime fag', type: 'Fagbrev/svennebrev', beskrivelse: null },
        { tittel: 'Svennebrev urmaker', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Enda noen greier', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Fagbrev sky', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Fagbrev maritime fag', type: 'Fagbrev/svennebrev', beskrivelse: null },
        { tittel: 'Svennebrev urmaker', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Enda noen greier', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Fagbrev sky', type: 'Fagbrev/svennebrev', beskrivelse: 'ssas' },
        { tittel: 'Autorisasjon test', type: 'Autorisasjon', beskrivelse: 'aut' },
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
    yrkeJobbonsker: [
        { styrkKode: null, styrkBeskrivelse: 'Slakter', primaertJobbonske: true },
        { styrkKode: null, styrkBeskrivelse: 'Lærer', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Lafter', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Frisør', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Utvikler', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Backend-utvikler', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Sanger', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Digital markedsfører', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Slakter', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Lærer', primaertJobbonske: false },
        { styrkKode: null, styrkBeskrivelse: 'Lafter', primaertJobbonske: false },
    ],
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
    annenErfaring: [
        {
            fraDato: '2004-01-02',
            tilDato: null,
            rolle: 'Erfaring som selger',
            beskrivelse: 'Drev med salg fra tid til annen da jeg gikk på ungdomsskolen.',
        },
    ],
    godkjenninger: [
        {
            tittel: 'Førerbevis anleggsmaskinførere: Gravemaskin',
            utsteder: 'testutsteder',
            gjennomfoert: '2010-12-02',
            utloeper: '2118-12-02',
            konseptId: '381828',
        },
        {
            tittel: 'Førerbevis test: test',
            utsteder: 'testutsteder',
            gjennomfoert: '2011-12-02',
            utloeper: '',
            konseptId: '3818',
        },
    ],
    fodselsnummer: '<fødselsnummer>',
    tilretteleggingsbehov: true,
});

const bokstaver = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const kandidatnumre = tomListe.map((_, i) => {
    const toBokstaver = bokstaver[i % bokstaver.length] + bokstaver[(i + 1) % bokstaver.length];
    return toBokstaver + '123456';
});

export const mockCver = (veileder: Veileder) =>
    tomListe.map((_, i) => ({
        ...baseCv(veileder),
        kandidatnummer: kandidatnumre[i],
        fornavn: mockStrings.fornavn[i % mockStrings.fornavn.length],
        etternavn: mockStrings.etternavn[i % mockStrings.etternavn.length],
        fodselsnummer: mockStrings.fødselsnumre[i % mockStrings.fødselsnumre.length],
        aktorId: '00' + mockStrings.fødselsnumre[i % mockStrings.fødselsnumre.length],
    }));
