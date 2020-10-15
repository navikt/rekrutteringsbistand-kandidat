import { useEffect } from 'react';

type KandidatlisteIder = Set<string>;

const useSletteKandidatlisteIderFraLukkedata = (
    kandidatlisteId: string,
    besatteStillinger: number,
    antallStillinger: number | null,
    lukkedata: KandidatlisteIder,
    setLukkedata: (lagretAntallStillinger: KandidatlisteIder) => void
) => {
    useEffect(() => {
        if (
            lukkedata &&
            Array.from(lukkedata).includes(kandidatlisteId) &&
            antallStillinger &&
            besatteStillinger < antallStillinger
        ) {
            const newSet = new Set(lukkedata);
            newSet.delete(kandidatlisteId);
            setLukkedata(newSet);
        }
    }, [besatteStillinger, antallStillinger]);
};

export default useSletteKandidatlisteIderFraLukkedata;
