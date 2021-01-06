export enum Retning {
    Stigende = 'asc',
    Synkende = 'desc',
}

export const nesteSorteringsretning = (nåværendeRetning: Retning | null): null | Retning => {
    const retninger = [null, Retning.Stigende, Retning.Synkende];
    const aktivIndex = retninger.indexOf(nåværendeRetning);
    return aktivIndex === retninger.length - 1 ? retninger[0] : retninger[aktivIndex + 1];
};
