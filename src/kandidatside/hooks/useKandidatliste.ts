import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../state/AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';

const useKandidatliste = (kandidatlisteId: string) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.kandidatliste);

    useEffect(() => {
        const hentKandidatliste = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.NullstillKandidatliste,
            });

            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        hentKandidatliste(kandidatlisteId);
    }, [dispatch, kandidatlisteId]);

    return state.kandidatliste;
};

export default useKandidatliste;
