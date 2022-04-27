type Adresse = {
    landkode: string;
    postnr: string;
    poststednavn: string;
    kommunenr: number;
    adrlinje1: string;
    adrlinje2: string;
    adrlinje3: string;
};

export enum Omfangenhet {
    Time = 'TIME',
    Dag = 'DAG',
    Uke = 'UKE',
    Måned = 'MND',
}

export type Omfang = {
    verdi: number;
    enhet: Omfangenhet | '';
};

export type Kurs = {
    arrangor: string;
    tittel: string;
    omfang: Omfang;
    fraDato: string | null;
    tilDato: string | null;
};

export enum Språkferdighetsnivå {
    IkkeOppgitt = 'IKKEOPPGITT',
    Nybegynner = 'NYBEGYNNER',
    Godt = 'GODT',
    VeldigGodt = 'VELDIG_GODT',
    Førstespråk = 'FOERSTESPRAAK',
}

export type Språkferdighet = {
    sprak: string;
    ferdighetSkriftlig: Språkferdighetsnivå;
    ferdighetMuntlig: Språkferdighetsnivå;
};

export type Sertifikat = {
    utsteder: string | null;
    sertifikatKode: string | null;
    sertifikatKodeNavn: string | null;
    alternativtNavn: string | null;
    fraDato: string | null;
    tilDato: string | null;
};

export type Yrkeserfaring = {
    arbeidsgiver: string | null;
    alternativStillingstittel: string | null;
    styrkKode: string | null;
    styrkKodeStillingstittel: string | null;
    utelukketForFremtiden: boolean;
    fraDato: string | null;
    tilDato: string | null;
    beskrivelse: string | null;
    sted?: string | null;
};

export type Kompetanse = {
    kompetanseKode: string | null;
    kompetanseKodeTekst: string | null;
    alternativTekst: string | null;
    beskrivelse: string | null;
    fraDato: string | null;
};

export type Utdanning = {
    utdannelsessted: string | null;
    alternativtUtdanningsnavn: string | null;
    nusKode: string;
    nusKodeUtdanningsnavn: string | null;
    nusKodeGrad?: string | null;
    fraDato: string | null;
    tilDato: string | null;
    beskrivelse: string | null;
};

export type Fagdokumentasjon = {
    tittel: string | null;
    type: string | null;
    beskrivelse: string | null;
};

export type AnnenErfaring = {
    fraDato: string | null;
    tilDato: string | null;
    rolle: string | null;
    beskrivelse: string | null;
};

export type Godkjenning = {
    tittel: string | null;
    utsteder: string | null;
    gjennomfoert: string | null;
    utloeper: string | null;
    konseptId: string | null;
};

export type Jobbønske = {
    styrkKode: string | null;
    styrkBeskrivelse: string | null;
    primaertJobbonske: boolean;
};

export enum Innsatsgruppe {
    Standard = 'Standard',
    SpesieltTilpasset = 'Spesielt tilpasset innsats',
    Situasjonsbestemt = 'Situasjonsbestemt innsats',
}

type Cv = {
    adresse: Adresse;
    aktorId: string;
    annenErfaring: AnnenErfaring[];
    godkjenninger: Godkjenning[];
    ansettelsesformJobbprofil: any[];
    arbeidsdagerJobbprofil: any[];
    arbeidstidJobbprofil: any[];
    arbeidstidsordningJobbprofil: any[];
    beskrivelse: string;
    disponererBil: boolean;
    epost: string;
    etternavn: string;
    fagdokumentasjon: Fagdokumentasjon[];
    fodselsdato: string;
    fodselsnummer: string;
    forerkort: Sertifikat[];
    fornavn: string;
    geografiJobbonsker: any[];
    kandidatnummer: string;
    kompetanse: Kompetanse[];
    kurs: Kurs[];
    mobiltelefon: string | null;
    omfangJobbprofil: any[];
    oppstartKode: string;
    samtykkeDato: string;
    samtykkeStatus: string;
    sertifikater: Sertifikat[];
    sistEndret: string;
    sprak: Kompetanse[];
    sprakferdigheter: Språkferdighet[];
    statsborgerskap: string | null;
    telefon: string;
    tilretteleggingsbehov: boolean;
    utdanning: Utdanning[];
    veilederEpost: string | null;
    veilederIdent: string | null;
    veilederNavn: string | null;
    verv: any[];
    yrkeJobbonsker: Jobbønske[];
    yrkeserfaring: Yrkeserfaring[];
};

export type CvSøkeresultat = {
    aktorId: string;
    arenaKandidatnr: string;
    erFodselsdatoDnr: boolean;
    erLagtTilKandidatliste: boolean;
    etternavn: string;
    fodselsdato: string;
    fodselsnummer: string;
    fornavn: string;
    hoyesteUtdanning: {
        nusKode: string;
        nusKodeGrad?: string | null;
    };
    innsatsgruppe: Innsatsgruppe;
    poststed: string;
    score: any;
    servicebehov: string;
    totalLengdeYrkeserfaring: number;
};

export type Fødselsnummersøk = {
    aktørId: string;
    arenaKandidatnr: string;
    fornavn: string;
    etternavn: string;
};

export default Cv;
