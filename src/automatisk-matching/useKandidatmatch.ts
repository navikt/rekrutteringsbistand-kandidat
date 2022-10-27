import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { feil, lasterInn, Nettressurs, Nettstatus, suksess } from '../api/Nettressurs';
import AppState from '../AppState';
import Kandidatmatch from './Kandidatmatch';
import { hentKandidater, hentStilling } from './kandidatmatchApi';
import { MatchAction, Stilling } from './kandidatmatchReducer';

const useKandidatmatch = (stillingsId?: string, aktørIder?: string[], kandidatNr?: string) => {
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

        const setKandidater = (kandidater: Nettressurs<Kandidatmatch[]>) => {
            dispatch<MatchAction>({
                type: 'SET_KANDIDATMATCH',
                kandidater,
            });
        };

        const hentStillingTilMatching = async (
            stillingsId: string
        ): Promise<Stilling | undefined> => {
            setStilling(lasterInn());

            try {
                const stilling = await hentStilling(stillingsId);
                setStilling(suksess(stilling));

                return stilling;
            } catch (e) {
                setStilling(feil(e));
            }
        };

        const hentKandidaterTilMatching = async (stilling: Stilling, aktørIder?: string[]) => {
            setKandidater(lasterInn());

            try {
                const kandidater = await hentKandidater(stilling, aktørIder);
                const behandledeKandidater = behandleKandidater(kandidater);
                setKandidater(suksess(behandledeKandidater));
            } catch (error) {
                setKandidater(feil(error));
            }
        };

        const brukAutomatiskMatching = async (stillingsId: string) => {
            const stilling = await hentStillingTilMatching(stillingsId);

            if (stilling) {
                hentKandidaterTilMatching(stilling, aktørIder);
            }
        };

        const stillingErIkkeLastet = stilling.kind === Nettstatus.IkkeLastet;
        const enAnnenStillingErLastet =
            stilling.kind === Nettstatus.Suksess && stilling.data.stilling.uuid !== stillingsId;

        if (stillingsId && (stillingErIkkeLastet || enAnnenStillingErLastet)) {
            brukAutomatiskMatching(stillingsId);
        }
    }, [stillingsId, stilling, aktørIder, dispatch]);

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
