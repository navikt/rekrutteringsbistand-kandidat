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
    sammendrag: SammendragPrototype;
    foererkort: FørerkortPrototype;

    // Cv
    arbeidserfaring: ArbeidserfaringPrototype;
    utdannelse: UtdannelsePrototype;
    fagdokumentasjon: FagdokumentasjonPrototype[];
    godkjenninger: any;
    kurs: KursPrototype[];
    sertifikat: SertifikatPrototype[];
    spraakferdigheter: SpråkferdighetPrototype[];

    aktoerId: string;
    oppstartKode: string;
    disponererBil: boolean;
    annenErfaring: [];

    // Jobbprofil
    stillinger_jobbprofil: StillingerJobbprofilPrototype;
    kompetanser_jobbprofil: KompetanserJobbprofilPrototype[];
    stillingkladder_jobbprofil: string[];
    geografi_jobbprofil: GeografiJobbprofilPrototype;
    ansettelsesformer_jobbprofil: string[];
    arbeidstider_jobbprofil: string[];
    arbeidsdager_jobbprofil: string[];
    arbeidstidsordninger_jobbprofil: string[];
    omfang_jobbprofil: string[];

    // Oppfølgingsinformasjon
    oppfolgingsinformasjon: Oppfolgingsinformasjon;
    // Match
    score_total: number;
    score_utdannelse: number;
    score_jobbprofil: number;
    score_arbeidserfaring: number;
    score_sammendrag: number;
    score_geografi: number;
    score_styrkkode: number;
    match_forklaring: {
        arbeidserfaring_forklaring: number[];
        utdannelse_forklaring: number[];
        jobbprofil_forklaring: number[];
        geografi_forklaring: number[];
        styrkkode_forklaring: number[];
    };

    // Veileder
    veileder: VeilederPrototype;
    tilretteleggingsbehov: string[];
};

type VeilederPrototype = {
    aktorId: string;
    veilederId: string;
    tilordnet: string;
};

type ArbeidserfaringPrototype = {
    score: number;
    arbeidserfaringer: ArbeidserfaringerPrototype[];
};

type ArbeidserfaringerPrototype = {
    score: number;
    stillingstittel: string;
    styrkkode: string;
    arbeidsgiver: string;
    sted: string;
    beskrivelse: string;
    stillingstittelFritekst: string;
    janzzKonseptid: string;
    tilTidspunkt: number;
    ikkeAktueltForFremtiden: boolean;
    fraTidspunkt: number[];
};

type UtdannelsePrototype = {
    score: number;
    utdannelser: UtdannelserPrototype[];
};

type UtdannelserPrototype = {
    score: number;
    laerested: string;
    beskrivelse: string;
    utdanningsretning: string;
    autorisasjon: false;
    tilTidspunkt: number;
    nuskodeGrad: string;
    utdannelseYrkestatus: string;
    fraTidspunkt: number[];
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
    kvalifiseringsgruppe: string;
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

type StillingerJobbprofilPrototype = {
    score: number;
    stillinger: StillingPrototype[];
};

type StillingPrototype = {
    stilling: string;
    score: number;
};

type GeografiJobbprofilPrototype = {
    score: number;
    steder: StedPrototype[];
};

type StedPrototype = {
    sted: string;
    kode: string;
    score: number;
};

type KompetanserJobbprofilPrototype = {
    score: number;
    kompetanser: Kompetanse[];
};

type Kompetanse = {
    score: number;
    kompetanse: string;
};

type SammendragPrototype = {
    score: number;
    sammendrag_tekst: string;
};

type FagdokumentasjonPrototype = {
    type: string;
    tittel: string;
    beskrivelse: string;
};

export default Prototype;

/*
private String spraaknavn;
    private String iso3kode;
    private Ferdighetsnivaa muntlig;
    private Ferdighetsnivaa skriftlig;
 */

/*
public enum Ferdighetsnivaa implements GenericEnumSymbol<Ferdighetsnivaa> {
    IKKE_OPPGITT,
    NYBEGYNNER,
    GODT,
    VELDIG_GODT,
    FOERSTESPRAAK;
 */
