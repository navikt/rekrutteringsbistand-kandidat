export enum Innsatsgruppe {
    Standard = 'Standard',
    SpesieltTilpasset = 'Spesielt tilpasset innsats',
    Situasjonsbestemt = 'Situasjonsbestemt innsats',
}

export enum Tilgjengelighet {
    Tilgjengelig = 'tilgjengelig',
    TilgjengeligInnen1Uke = 'tilgjengeliginnen1uke',
    MidlertidigUtilgjengelig = 'midlertidigutilgjengelig',
}

type Søkeresultat = {
    arenaKandidatnr: string;
    erFodselsdatoDnr: boolean;
    etternavn: string;
    fodselsdato: string;
    fodselsnummer: string;
    fornavn: string;
    hoyesteUtdanning: {
        nusKode: string;
        nusKodeGrad: any;
    };
    innsatsgruppe: Innsatsgruppe;
    mestRelevanteYrkeserfaring: {
        styrkKodeStillingstittel: string;
        yrkeserfaringManeder: number;
    };
    midlertidigUtilgjengeligStatus: Tilgjengelighet;
    poststed: string;
    score: any;
    servicebehov: string;
    totalLengdeYrkeserfaring: number;
};

export default Søkeresultat;
