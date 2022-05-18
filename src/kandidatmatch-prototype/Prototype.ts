type Prototype = {
    // Personalia
    fodselsnummer: string;
    arenaKandidatnr: string;
    foedselsdato: number[];
    fornavn: string;
    etternavn: string;
    epost: string;
    telefon: number;
    gateadresse: string;
    postnummer: string;
    poststed: string;
    kommunenr: string;
    land: string;
    nasjonalitet: string;
    foererkort: FørerkortPrototype;

    // Cv
    arbeidserfaring: ErfaringerPrototype;
    utdannelse: ErfaringerPrototype;
    sammendrag: ErfaringPrototype;

    fagdokumentasjon: FagdokumentasjonPrototype[];
    godkjenninger: GodkjenningerPrototype[];
    kurs: KursPrototype[];
    sertifikat: SertifikatPrototype[];
    spraakferdigheter: SpråkferdighetPrototype[];

    aktoerId: string;
    oppstartKode: string;
    disponererBil: boolean;
    annenErfaring: AnnenErfaringPrototype[];
    cvId: string;
    synligForArbeidsgiver: boolean;
    synligForVeileder: boolean;

    // Jobbprofil
    stillinger_jobbprofil: ErfaringerPrototype;
    kompetanser_jobbprofil: ErfaringerPrototype;
    geografi_jobbprofil: GeografiJobbprofilPrototype;
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

    // Veileder
    veileder: VeilederPrototype;
    tilretteleggingsbehov: string | null;
};

type VeilederPrototype = {
    aktorId: string;
    veilederId: string;
    tilordnet: string;
};

type ErfaringerPrototype = {
    erfaringer: ErfaringPrototype[];
    score: number;
};

type ErfaringPrototype = {
    score: number;
    ordScore: OrdScore[];
    tekst: string;
};

type SertifikatPrototype = {
    tittel: string;
    sertifikatnavn: string;
    sertifikatnavn_fritekst: string;
    konsept_id: string;
    utsteder: string;
    gjennomfoert: Date;
    utloeper: number;
};

type FørerkortPrototype = {
    klasse: FoererkortKlassePrototype[];
};

type FoererkortKlassePrototype = {
    klasse: string;
    klasse_beskrivelse: string;
    fra_tidspunkt: number;
    utloeper: number;
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
    doedFraDato: Date;
    sistEndretDato: Date;
};

export type KursPrototype = {
    tittel: string;
    utsteder: string;
    tidspunkt: number; // ms epoch?
    varighet: number;
    varighet_enhet: TidsenhetPrototype;
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

type GeografiJobbprofilPrototype = {
    //score: number;
    steder: StedPrototype[];
};

type StedPrototype = {
    sted: string;
    kode: string;
    score: number;
};

type FagdokumentasjonPrototype = {
    type: string;
    tittel: string;
    beskrivelse: string;
};

type GodkjenningerPrototype = {
    tittel: string;
    konsept_id: string;
    utsteder: string;
    gjennomfoert: Date;
    utloeper: number;
};

type AnnenErfaringPrototype = {
    beskrivelse: string;
    rolle: string;
    fra_tidspunkt: number;
    til_tidspunkt: number;
};

type OppfolgingsperiodePrototype = {
    uuid: string;
    aktorId: string;
    startDato: Date;
    sluttDato: Date;
};

type Index = number;
type Score = number;

type OrdScore = OrdrelasjonMellomKandidatOgStilling[];

type OrdrelasjonMellomKandidatOgStilling = [OrdFraKandidat, MatchetOrdFraStilling[]];

type OrdFraKandidat = [Index, string];

type MatchetOrdFraStilling = [Index, string, Score];

export default Prototype;
