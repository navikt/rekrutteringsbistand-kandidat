type Adresse = {
    landkode: string;
    postnr: string;
    poststednavn: string;
    kommunenr: number;
    adrlinje1: string;
    adrlinje2: string;
    adrlinje3: string;
};

type Cv = {
    adresse: Adresse;
    aktorId: string;
    annenErfaring: any[];
    godkjenninger: any[];
    ansettelsesformJobbprofil: any[];
    arbeidsdagerJobbprofil: any[];
    arbeidstidJobbprofil: any[];
    arbeidstidsordningJobbprofil: any[];
    beskrivelse: string;
    disponererBil: boolean;
    epost: string;
    etternavn: string;
    fagdokumentasjon: any[];
    fodselsdato: string;
    fodselsnummer: string;
    forerkort: any[];
    fornavn: string;
    geografiJobbonsker: any[];
    kandidatnummer: string;
    kompetanse: any[];
    kurs: any[];
    mobiltelefon: string | null;
    omfangJobbprofil: any[];
    oppstartKode: string;
    samtykkeDato: string;
    samtykkeStatus: string;
    sertifikater: any[];
    sistEndret: string;
    sprak: any[];
    sprakferdigheter: any[];
    statsborgerskap: string | null;
    telefon: string;
    tilretteleggingsbehov: boolean;
    utdanning: any[];
    veilederEpost: string | null;
    veilederIdent: string | null;
    veilederNavn: string | null;
    verv: any[];
    yrkeJobbonsker: any[];
    yrkeserfaring: any[];
};

export type Kandidatresultat = {
    aktørId: string;
    arenaKandidatnr: string;
    fornavn: string;
    etternavn: string;
    mestRelevanteYrkeserfaring: {
        styrkKodeStillingstittel?: string;
        yrkeserfaringManeder?: string;
    };
};

export default Cv;
