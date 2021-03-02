import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';

const useKandidatliste = (stillingsId?: string, kandidatlisteId?: string) => {
    const dispatch = useDispatch();

    const hentKandidatliste = useCallback(
        (stillingsId?: string, kandidatlisteId?: string) => {
            if (stillingsId) {
                dispatch({
                    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
                    stillingsId,
                });
            } else if (kandidatlisteId) {
                dispatch({
                    type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
                    kandidatlisteId,
                });
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (stillingsId) {
            hentKandidatliste(stillingsId);
        } else if (kandidatlisteId) {
            hentKandidatliste(undefined, kandidatlisteId);
        }
    }, [hentKandidatliste, stillingsId, kandidatlisteId]);
};

export default useKandidatliste;
