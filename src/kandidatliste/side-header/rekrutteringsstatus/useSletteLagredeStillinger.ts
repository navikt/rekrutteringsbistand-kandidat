import { useEffect } from 'react';
import { KandidatlisteIder } from './useLagreKandidatlisteIder';

const useSletteKandidatlisteIderFraLukkedata = (
    kandidatlisteId: string,
    besatteStillinger: number,
    antallStillinger: number | null,
    lukkedata: KandidatlisteIder,
    setLukkedata: (KandidatlisteIder) => void
) => {
    useEffect(() => {
        if (
            lukkedata &&
            lukkedata.has(kandidatlisteId) &&
            antallStillinger &&
            besatteStillinger < antallStillinger
        ) {
            const newSet = new Set(lukkedata);
            newSet.delete(kandidatlisteId);
            setLukkedata(newSet);
        }
    });
};

export default useSletteKandidatlisteIderFraLukkedata;
