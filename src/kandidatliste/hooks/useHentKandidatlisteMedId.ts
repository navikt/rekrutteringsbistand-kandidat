import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';

const useHentKandidatlisteMedId = (stillingsIdFraUrl?: string, kandidatlisteIdFraUrl?: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const hentKandidatlisteMedStilling = (stillingsId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsId,
                stillingsId,
            });
        };

        const hentKandidatlisteUtenStilling = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        if (stillingsIdFraUrl) {
            hentKandidatlisteMedStilling(stillingsIdFraUrl);
        } else if (kandidatlisteIdFraUrl) {
            hentKandidatlisteUtenStilling(kandidatlisteIdFraUrl);
        }
    }, [dispatch, stillingsIdFraUrl, kandidatlisteIdFraUrl]);
};

export default useHentKandidatlisteMedId;
