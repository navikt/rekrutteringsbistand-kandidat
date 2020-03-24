export interface Bransje {
    navn: string;
    yrker: Yrker[];
}

export interface Sok {
    tittel: string;
    jobbonsker: string[];
    yrkeserfaring: string[];
    kompetanser: string[];
    forerkort: string[];
    antallTreff: number;
}

export interface Yrker {
    tittel: string;
    sok: Sok[];
}

export interface Bransjeresponse {
    bransjer: Bransje[];
}
