type Prototype = {
    // Personalia
    fodselsnummer: string;
    arenaKandidatnr: string;
    foedselsdato: number[];
    fornavn: string;
    etternavn: string;
    gateadresse: string;
    postnummer: string;
    poststed: string;
    kommunenr: string;
    land: string;
    nasjonalitet: string;
    sammendrag: string;

    // Cv
    arbeidserfaring: ArbeidserfaringPrototype[];
    utdannelse: UtdannelsePrototype[];
    fagdokumentasjon: string[];
    godkjenninger: any;
    kurs: KursPrototype[];
    sertifikat: SertifikatPrototype[];
    spraakferdigheter: SpråkferdighetPrototype[];

    aktoerId: string;
    oppstartKode: string;
    disponererBil: boolean;
    annenErfaring: [];

    // Jobbprofil
    stillinger_jobbprofil: string[];
    kompetanser_jobbprofil: string[];
    stillingkladder_jobbprofil: string[];
    geografi_jobbprofil: Array<{
        sted: string;
        kode: string;
    }>;
    ansettelsesformer_jobbprofil: string[];
    arbeidstider_jobbprofil: string[];
    arbeidsdager_jobbprofil: string[];
    arbeidstidsordninger_jobbprofil: string[];
    omfang_jobbprofil: string[];

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
};

type ArbeidserfaringPrototype = {
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
