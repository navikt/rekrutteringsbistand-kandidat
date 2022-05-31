import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lasterInn, Nettressurs, Nettstatus, suksess } from '../api/Nettressurs';
import AppState from '../AppState';
import Kandidatmatch from './Kandidatmatch';
import { hentKandidater, hentStilling } from './kandidatmatchApi';
import { MatchAction } from './kandidatmatchReducer';

const useKandidatmatch = (stillingsId?: string, kandidatNr?: string) => {
    const dispatch = useDispatch();
    const { stilling, kandidater } = useSelector((state: AppState) => state.kandidatmatch);

    useEffect(() => {
        const setStilling = (stilling: any) => {
            dispatch<MatchAction>({
                type: 'SetStillingForMatching',
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
                type: 'SetKandidatmatch',
                kandidater,
            });
        };

        const hent = async (stilling: any) => {
            setKandidater(lasterInn());

            const kandidater = await hentKandidater(stilling);
            setKandidater(suksess(kandidater));
        };

        if (stilling.kind === Nettstatus.Suksess && kandidater.kind === Nettstatus.IkkeLastet)
            hent(stilling);
    }, [stilling, kandidater.kind, dispatch]);

    return {
        stilling,
        kandidater,
    };
};

export default useKandidatmatch;
