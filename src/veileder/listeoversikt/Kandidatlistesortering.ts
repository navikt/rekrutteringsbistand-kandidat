export enum KandidatlisteSorteringsfelt {
    OpprettetTidspunkt = 'opprettetTidspunkt',
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
