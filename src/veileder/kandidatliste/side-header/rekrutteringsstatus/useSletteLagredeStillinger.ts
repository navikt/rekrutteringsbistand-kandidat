import { useEffect } from 'react';

type LagretAntallStillinger = Record<string, number | undefined>;

const useSletteLagredeStillinger = (
    kandidatlisteId: string,
    besatteStillinger: number,
    antallStillinger: number | null,
    lukkedata: LagretAntallStillinger,
    setLukkedata: (lagretAntallStillinger: LagretAntallStillinger) => void
) => {
    useEffect(() => {
        if (
            lukkedata &&
            lukkedata[kandidatlisteId] &&
            antallStillinger &&
            besatteStillinger < antallStillinger
        ) {
            setLukkedata({
                ...lukkedata,
                [kandidatlisteId]: undefined,
            });
        }
    }, [besatteStillinger, antallStillinger]);
};

export default useSletteLagredeStillinger;
