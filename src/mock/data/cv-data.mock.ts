import {
    Sertifikat,
    Kurs,
    Språkferdighet,
    Språkferdighetsnivå,
    Yrkeserfaring,
    Kompetanse,
    Utdanning,
} from '../../kandidatside/cv/reducer/cv-typer';

export const utdanning: Utdanning[] = [
    {
        utdannelsessted: 'Universitetet i Oslo',
        alternativtUtdanningsnavn: 'Universitet',
        nusKode: '2',
        nusKodeUtdanningsnavn: null,
        fraDato: '2013-08-02',
        tilDato: null,
        beskrivelse: 'Generisk utdanning fra Blindern',
    },
    {
        utdannelsessted: 'Åsane vgs',
        alternativtUtdanningsnavn: 'Mekaniske fag, grunnkurs',
        nusKode: '6',
        nusKodeUtdanningsnavn: null,
        fraDato: '1993-08-02',
        tilDato: '1994-06-02',
        beskrivelse: 'En beskrivelse av Åsage vgs.',
    },
    {
        utdannelsessted: 'Blokkhauen ungdomskole, Bergen',
        alternativtUtdanningsnavn: 'Ungdomskole',
        nusKode: '2',
        nusKodeUtdanningsnavn: null,
        fraDato: '1989-08-02',
        tilDato: '1992-06-02',
        beskrivelse: '',
    },
    {
        utdannelsessted: '',
        alternativtUtdanningsnavn: 'Barne og ungdomsskolen i Berlevåg',
        nusKode: '2',
        nusKodeUtdanningsnavn: null,
        fraDato: '1970-08-02',
        tilDato: '1979-06-02',
        beskrivelse: '',
    },
];

export const yrkeserfaring: Yrkeserfaring[] = [
    {
        arbeidsgiver: 'Vestfold Anlegg',
        alternativStillingstittel: 'Anleggsmaskinfører/Grunnarbeider lærling',
        styrkKode: '8342.01',
        styrkKodeStillingstittel: 'Anleggsmaskinfører',
        utelukketForFremtiden: false,
        fraDato: '2012-08-02',
        tilDato: '2013-11-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Meny Larvik sentrum',
        alternativStillingstittel: 'Butikkmedarbeider',
        styrkKode: '5223.02',
        styrkKodeStillingstittel: 'Butikkmedarbeider',
        utelukketForFremtiden: false,
        fraDato: '2011-08-02',
        tilDato: '2012-06-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Lars Grimstad, Møbelringen, Larvik',
        alternativStillingstittel: 'lagermedarbeider/sjåfør',
        styrkKode: '4321.01',
        styrkKodeStillingstittel: 'Lagerarbeider',
        utelukketForFremtiden: false,
        fraDato: '2009-04-02',
        tilDato: '2010-07-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'ISAK Norge AS',
        alternativStillingstittel: 'Lager ansvarlig/sjåfør',
        styrkKode: '4322.01',
        styrkKodeStillingstittel: 'Logistiker',
        utelukketForFremtiden: false,
        fraDato: '2008-08-02',
        tilDato: '2009-03-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Proffice/Ringnes Bryggerier',
        alternativStillingstittel: 'salgsfremmer',
        styrkKode: '5223.02',
        styrkKodeStillingstittel: 'Butikkmedarbeider',
        utelukketForFremtiden: false,
        fraDato: '2001-09-02',
        tilDato: '2002-02-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Selektiv, Porsgrunn',
        alternativStillingstittel: 'Telefonselger',
        styrkKode: '5223.04',
        styrkKodeStillingstittel: 'Selger detalj non-food',
        utelukketForFremtiden: false,
        fraDato: '2001-12-02',
        tilDato: '2001-12-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Beha Fabrikker, Porsgrunn',
        alternativStillingstittel: 'Produksjonsmedarbeider',
        styrkKode: '8121.03',
        styrkKodeStillingstittel: 'Operatør metallvareproduksjon',
        utelukketForFremtiden: false,
        fraDato: '2001-11-02',
        tilDato: '2001-11-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Expert, Porsgrunn',
        alternativStillingstittel: 'lager/truck',
        styrkKode: '4321.01',
        styrkKodeStillingstittel: 'Lagerarbeider',
        utelukketForFremtiden: false,
        fraDato: '2001-07-02',
        tilDato: '2001-09-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'ATG Bergen',
        alternativStillingstittel: 'snekkerarbeid',
        styrkKode: '9313.01',
        styrkKodeStillingstittel: 'Hjelpearbeider bygg',
        utelukketForFremtiden: false,
        fraDato: '1997-04-02',
        tilDato: '1997-08-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'ATG Bergen',
        alternativStillingstittel: 'snekkerarbeid',
        styrkKode: '9313.01',
        styrkKodeStillingstittel: 'Hjelpearbeider bygg',
        utelukketForFremtiden: false,
        fraDato: '1996-12-02',
        tilDato: '1997-03-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'ATG Bergen',
        alternativStillingstittel: 'snekkerarbeid',
        styrkKode: '9313.01',
        styrkKodeStillingstittel: 'Hjelpearbeider bygg',
        utelukketForFremtiden: false,
        fraDato: '1996-05-02',
        tilDato: '1996-09-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'ATG Åsane bydel',
        alternativStillingstittel: 'hjelpearbeider',
        styrkKode: '9313.01',
        styrkKodeStillingstittel: 'Hjelpearbeider bygg',
        utelukketForFremtiden: false,
        fraDato: '1995-08-02',
        tilDato: '1995-10-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Åsane Hagesenter',
        alternativStillingstittel: 'gartneriassistent',
        styrkKode: '9211.01',
        styrkKodeStillingstittel: 'Innhøstingsarbeider',
        utelukketForFremtiden: false,
        fraDato: '1993-04-02',
        tilDato: '1993-07-02',
        beskrivelse: '',
    },
    {
        arbeidsgiver: 'Flaktveit skole',
        alternativStillingstittel: 'vaktmesterassistent',
        styrkKode: '5153.03',
        styrkKodeStillingstittel: 'Vaktmester',
        utelukketForFremtiden: false,
        fraDato: '1992-10-02',
        tilDato: '1993-01-02',
        beskrivelse: '',
    },
];

export const sertifikater: Sertifikat[] = [
    {
        utsteder: 'testutsteder',
        sertifikatKode: '382068',
        sertifikatKodeNavn: 'Truckførerbevis T4',
        alternativtNavn: null,
        fraDato: '2018-02-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '404866',
        sertifikatKodeNavn: 'Bevis for yrkessjåførkompetanse (YSK)',
        alternativtNavn: null,
        fraDato: '2013-08-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '381872',
        sertifikatKodeNavn: 'Førerbevis anleggsmaskinførere: Anleggsdumper',
        alternativtNavn: null,
        fraDato: '2013-05-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '381891',
        sertifikatKodeNavn: 'Førerbevis anleggsmaskinførere: Hjullaster',
        alternativtNavn: null,
        fraDato: '2013-05-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '381828',
        sertifikatKodeNavn: 'Førerbevis anleggsmaskinførere: Gravemaskin',
        alternativtNavn: null,
        fraDato: '2013-05-02',
        tilDato: null,
    },
    {
        utsteder: 'asss',
        sertifikatKode: '382060',
        sertifikatKodeNavn: 'Truckførerbevis',
        alternativtNavn: null,
        fraDato: '2005-02-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '416798',
        sertifikatKodeNavn: 'Truckførerbevis: Klasse 10 (tilleggsutstyr)',
        alternativtNavn: null,
        fraDato: '1998-09-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: null,
        sertifikatKodeNavn: null,
        alternativtNavn:
            'Truckførerbevis T3 Svinggaffel og høytløftende plukktruck, sidestablende og førerløftende truck',
        fraDato: '1998-09-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: null,
        sertifikatKodeNavn: null,
        alternativtNavn: 'Truckførerbevis T2 Skyvemasttruck, støttebenstruck',
        fraDato: '1998-09-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: null,
        sertifikatKodeNavn: null,
        alternativtNavn:
            'Truckførerbevis T1 Lavtløftende plukktruck, palletruck m/perm. førerplass',
        fraDato: '1998-09-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: null,
        sertifikatKodeNavn: null,
        alternativtNavn: 'Truckførerbevis T4 Motvektstruck',
        fraDato: '1998-09-02',
        tilDato: null,
    },
    {
        utsteder: '',
        sertifikatKode: '382283',
        sertifikatKodeNavn: 'Truckførerbevis T3',
        alternativtNavn: null,
        fraDato: '2017-06-02',
        tilDato: '2017-06-02',
    },
];

export const forerkort: Sertifikat[] = [
    {
        utsteder: null,
        sertifikatKode: null,
        sertifikatKodeNavn: 'B - Personbil',
        alternativtNavn: null,
        fraDato: null,
        tilDato: null,
    },
    {
        utsteder: null,
        sertifikatKode: null,
        sertifikatKodeNavn: 'B - Personbil',
        alternativtNavn: null,
        fraDato: '2006-02-01',
        tilDato: null,
    },
    {
        utsteder: null,
        sertifikatKode: null,
        sertifikatKodeNavn: 'BE - Personbil med tilhenger',
        alternativtNavn: null,
        fraDato: '2012-09-01',
        tilDato: '2112-09-01',
    },
    {
        utsteder: null,
        sertifikatKode: null,
        sertifikatKodeNavn: 'C - Lastebil',
        alternativtNavn: null,
        fraDato: '2013-05-01',
        tilDato: '2013-09-01',
    },
];

export const kompetanse: Kompetanse[] = [
    {
        kompetanseKode: null,
        kompetanseKodeTekst: 'Altmuligarbeid langs slakteprosedyren',
        alternativTekst: 'Altmuligarbeid langs slakteprosedyren',
        beskrivelse: '',
        fraDato: null,
    },
];

export const sprak: Kompetanse[] = [
    {
        kompetanseKode: null,
        kompetanseKodeTekst: 'Engelsk',
        alternativTekst: 'Engelsk',
        beskrivelse: 'Muntlig: FOERSTESPRAAK Skriftlig: FOERSTESPRAAK',
        fraDato: null,
    },
    {
        kompetanseKode: null,
        kompetanseKodeTekst: 'Norsk',
        alternativTekst: 'Norsk',
        beskrivelse: 'Muntlig: FOERSTESPRAAK Skriftlig: FOERSTESPRAAK',
        fraDato: null,
    },
];

export const sprakferdigheter: Språkferdighet[] = [
    {
        sprak: 'Engelsk',
        ferdighetSkriftlig: Språkferdighetsnivå.Førstespråk,
        ferdighetMuntlig: Språkferdighetsnivå.Førstespråk,
    },
    {
        sprak: 'Norsk',
        ferdighetSkriftlig: Språkferdighetsnivå.VeldigGodt,
        ferdighetMuntlig: Språkferdighetsnivå.VeldigGodt,
    },
];

export const kurs: Kurs[] = [
    {
        arrangor: 'Skagerak ',
        tittel: 'Innføringskurs i sikkerhetsrutiner høy og lavspent',
        omfang: { verdi: 5, enhet: '' },
        fraDato: '2014-02-02',
        tilDato: null,
    },
    {
        arrangor: 'M.E.F',
        tittel: 'Arbeidsvarsling langs vei',
        omfang: { verdi: 24, enhet: '' },
        fraDato: '2013-04-02',
        tilDato: null,
    },
    {
        arrangor: 'M.E.F',
        tittel: 'Sikkerhetskurs for Maskinfører',
        omfang: { verdi: 1, enhet: '' },
        fraDato: '2012-09-02',
        tilDato: null,
    },
    {
        arrangor: 'Ifokus',
        tittel: 'Avklaringskurs ',
        omfang: { verdi: 8, enhet: '' },
        fraDato: '2011-08-02',
        tilDato: null,
    },
    {
        arrangor: 'ifokus',
        tittel: 'avklaringskurs',
        omfang: { verdi: 12, enhet: '' },
        fraDato: '2008-06-02',
        tilDato: null,
    },
    {
        arrangor: 'ssaass',
        tittel: 'ss',
        omfang: { verdi: 5, enhet: '' },
        fraDato: '2004-01-02',
        tilDato: null,
    },
    {
        arrangor: 'Horten vgs',
        tittel: 'Datakortet',
        omfang: { verdi: 0, enhet: '' },
        fraDato: '2002-08-02',
        tilDato: null,
    },
    {
        arrangor: 'aetat',
        tittel: 'Jobbsøkerkurs',
        omfang: { verdi: 0, enhet: '' },
        fraDato: '1999-10-02',
        tilDato: null,
    },
    {
        arrangor: 'aetat ',
        tittel: 'Lagerkurs',
        omfang: { verdi: 0, enhet: '' },
        fraDato: '1998-08-02',
        tilDato: null,
    },
    {
        arrangor: 'Bmv laksevåg',
        tittel: 'Sveis',
        omfang: { verdi: 3, enhet: '' },
        fraDato: '1997-08-02',
        tilDato: null,
    },
];
