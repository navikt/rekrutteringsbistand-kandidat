export enum KandidatlisteSorteringsfelt {
    OpprettetDato = 'opprettetDato',
    Tittel = 'tittel',
}

export enum KandidatlisteSorteringsretning {
    Stigende = 'asc',
    Synkende = 'desc',
}

export type Kandidatlistesortering = {
    sortField: KandidatlisteSorteringsfelt;
    sortDirection: KandidatlisteSorteringsretning;
};
