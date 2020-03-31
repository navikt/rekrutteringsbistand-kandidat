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

export interface FerdigutfylteStillinger {
    bransjer: Bransje[];
}

export interface FerdigutfylteStillingerKlikk {
    bransje: string;
    linktekst: string;
}
