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
        if (lukkedata && lukkedata[kandidatlisteId] && antallStillinger && besatteStillinger < antallStillinger) {
            
            const m = {
                ...lukkedata,
                [kandidatlisteId]: undefined,
            }
            console.log('sssss', lukkedata, besatteStillinger, antallStillinger, m )
            setLukkedata(m);
        }
    }, [besatteStillinger, antallStillinger]);
};

export default useSletteLagredeStillinger;
