import { useCallback, useEffect, useState } from 'react';
import { fetchMineKandidatlister } from '../../../api/api';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import { Kandidatliste } from '../../../kandidatliste/domene/Kandidatliste';

type MinKandidatliste = Omit<Kandidatliste, 'kandidater'> & {
    antallKandidater: number;
};

export type MineKandidatlister = {
    liste: MinKandidatliste[];
    antall: number;
};

const SIDESTØRRELSE = 8;

const useMineKandidatlister = (side: number) => {
    const [mineKandidatlister, setMineKandidatlister] = useState<Nettressurs<MineKandidatlister>>({
        kind: Nettstatus.IkkeLastet,
    });

    const lastInnKandidatlister = useCallback(async () => {
        setMineKandidatlister({
            kind: Nettstatus.LasterInn,
        });

        try {
            const nesteSideMedLister = await fetchMineKandidatlister(side, SIDESTØRRELSE);

            setMineKandidatlister({
                kind: Nettstatus.Suksess,
                data: nesteSideMedLister,
            });
        } catch (e) {
            setMineKandidatlister({
                kind: Nettstatus.Feil,
                error: e,
            });
        }

        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [side]);

    useEffect(() => {
        lastInnKandidatlister();
    }, [lastInnKandidatlister]);

    return mineKandidatlister;
};

export default useMineKandidatlister;
