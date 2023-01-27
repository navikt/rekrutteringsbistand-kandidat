type Kandidatmatch = {
    // Personalia
    fodselsnummer: string;
    arenaKandidatnr: string;
    foedselsdato: number[];
    fornavn: string;
    etternavn: string;
    epost: string;
    telefon: string;
    gateadresse: string;
    postnummer: string;
    poststed: string;
    kommunenr: string;
    land: string;
    nasjonalitet: string;
    foererkort: FørerkortPrototype;

    // Cv
    arbeidserfaring: Erfaringer;
    utdannelse: Erfaringer;
    sammendrag: ErfaringPrototype;

    fagdokumentasjon: FagdokumentasjonPrototype[];
    godkjenninger: GodkjenningerPrototype[];
    kurs: KursPrototype[];
    sertifikat: SertifikatPrototype[];
    spraakferdigheter: SpråkferdighetPrototype[];

    aktoerId: number;
    oppstartKode: string;
    disponererBil: boolean;
    annenErfaring: AnnenErfaringPrototype[];
    cvId: string;
    synligForArbeidsgiver: boolean;
    synligForVeileder: boolean;

    // Jobbprofil
    stillinger_jobbprofil: Erfaringer;
    kompetanser_jobbprofil: Erfaringer;
    geografi_jobbprofil: StedPrototype[];
    ansettelsesformer_jobbprofil: string[];
    arbeidstider_jobbprofil: string[];
    arbeidsdager_jobbprofil: string[];
    arbeidstidsordninger_jobbprofil: string[];
    omfang_jobbprofil: string[];
    jobbprofilId: string;

    // Oppfølgingsinformasjon
    oppfolgingsinformasjon: Oppfolgingsinformasjon;
    oppfolgingsperiode: OppfolgingsperiodePrototype;

    // Match
    score: number;
    // Match Nynorsk
    nn_score: number;

    // Veileder
    veileder: Veileder | null;
    tilretteleggingsbehov: string | null;
};

type Veileder = {
    aktorId: string;
    veilederId: string;
    tilordnet: string;
};

type Erfaringer = {
    erfaringer: ErfaringPrototype[];
    score: number;
    nn_score: number;
};

export type ErfaringPrototype = {
    score: number;
    nn_score: number;
    ord_score: OrdScore[];
    tekst: string;
};

type SertifikatPrototype = {
    tittel: string;
    sertifikatnavn: string;
    utsteder: string;
    gjennomfoert: number[];
    utloeper: number;
    konseptId: string;
    sertifikatnavnFritekst: string;
};

type FørerkortPrototype = {
    klasse: FoererkortKlassePrototype[];
};

type FoererkortKlassePrototype = {
    klasse: string;
    utloeper: number;
    klasseBeskrivelse: string;
    fraTidspunkt: number;
};

type Oppfolgingsinformasjon = {
    fodselsnummer: string;
    formidlingsgruppe: string;
    iservFraDato: Date;
    fornavn: string;
    etternavn: string;
    oppfolgingsenhet: string;
    kvalifiseringsgruppe: string;
    rettighetsgruppe: string;
    hovedmaal: string;
    sikkerhetstiltakType: string;
    diskresjonskode: string;
    harOppfolgingssak: boolean;
    sperretAnsatt: boolean;
    erDoed: boolean;
    doedFraDato: string;
    sistEndretDato: string;
};

export type KursPrototype = {
    tittel: string;
    utsteder: string;
    tidspunkt: number; // ms epoch?
    varighet: number;
    varighetEnhet: TidsenhetPrototype;
};

export enum TidsenhetPrototype {
    TIME,
    DAG,
    UKE,
    MND,
}

type SpråkferdighetPrototype = {
    spraaknavn: string;
    iso3kode: string;
    muntlig: FerdighetsnivåPrototype;
    skriftlig: FerdighetsnivåPrototype;
};

enum FerdighetsnivåPrototype {
    IKKE_OPPGITT,
    NYBEGYNNER,
    GODT,
    VELDIG_GODT,
    FOERSTESPRAAK,
}

type StedPrototype = {
    sted: string;
    kode: string;
};

type FagdokumentasjonPrototype = {
    type: string;
    tittel: string;
    beskrivelse: string;
};

type GodkjenningerPrototype = {
    tittel: string;
    utsteder: string;
    gjennomfoert: number[];
    utloeper: number;
    konseptId: string;
};

type AnnenErfaringPrototype = {
    beskrivelse: string;
    rolle: string;
    fraTidspunkt: number;
    tilTidspunkt: number;
};

type OppfolgingsperiodePrototype = {
    uuid: string;
    aktorId: string;
    startDato: string;
    sluttDato: string;
};

type OrdScore = [OrdFraStilling, MatchetOrdFraKandidat[]];

type OrdFraStilling = {
    indeks: number[];
    ord: string;
};

type MatchetOrdFraKandidat = {
    indeks: number[];
    ord: string;
    score: number;
    nn_score: number;
};

export default Kandidatmatch;
