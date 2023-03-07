import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../AppState';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';

const useKandidatlisteMedStillingsId = (stillingsId?: string) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.kandidatliste);

    useEffect(() => {
        const hentKandidatliste = (stillingsId: string) => {
            dispatch({
                type: KandidatlisteActionType.NullstillKandidatliste,
            });

            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsId,
                stillingsId,
            });
        };

        if (stillingsId) hentKandidatliste(stillingsId);
    }, [dispatch, stillingsId]);

    return state.kandidatliste;
};

export default useKandidatlisteMedStillingsId;
