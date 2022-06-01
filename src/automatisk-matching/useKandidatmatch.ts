import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lasterInn, Nettressurs, Nettstatus, suksess } from '../api/Nettressurs';
import AppState from '../AppState';
import Kandidatmatch from './Kandidatmatch';
import { hentKandidater, hentStilling } from './kandidatmatchApi';
import { MatchAction, Stilling } from './kandidatmatchReducer';

const useKandidatmatch = (stillingsId?: string, kandidatNr?: string) => {
    const dispatch = useDispatch();
    const { stilling, kandidater } = useSelector((state: AppState) => state.kandidatmatch);

    let valgtKandidat: Kandidatmatch | undefined;
    if (kandidater.kind === Nettstatus.Suksess && kandidatNr) {
        valgtKandidat = kandidater.data.find((kandidat) => kandidat.arenaKandidatnr === kandidatNr);
    }

    useEffect(() => {
        const setStilling = (stilling: any) => {
            dispatch<MatchAction>({
                type: 'SET_STILLING_FOR_MATCHING',
                stilling,
            });
        };

        const hent = async (stillingsId: string) => {
            setStilling(lasterInn());

            const stilling = await hentStilling(stillingsId);
            setStilling(suksess(stilling));
        };

        if (stillingsId && stilling.kind === Nettstatus.IkkeLastet) hent(stillingsId);
    }, [stillingsId, stilling.kind, dispatch]);

    useEffect(() => {
        const setKandidater = (kandidater: Nettressurs<Kandidatmatch[]>) => {
            dispatch<MatchAction>({
                type: 'SET_KANDIDATMATCH',
                kandidater,
            });
        };

        const hent = async (stilling: Stilling) => {
            setKandidater(lasterInn());

            const kandidater = await hentKandidater(stilling);
            const behandledeKandidater = behandleKandidater(kandidater);

            setKandidater(suksess(behandledeKandidater));
        };

        if (stilling.kind === Nettstatus.Suksess && kandidater.kind === Nettstatus.IkkeLastet)
            hent(stilling.data);
    }, [stilling, kandidater.kind, dispatch]);

    return {
        stilling,
        kandidater,
        valgtKandidat,
    };
};

const behandleKandidater = (kandidater: Kandidatmatch[]): Kandidatmatch[] => {
    const sortertEtterTotalscore = kandidater.sort((a, b) => b.score - a.score);

    return sortertEtterTotalscore;
};

export default useKandidatmatch;
