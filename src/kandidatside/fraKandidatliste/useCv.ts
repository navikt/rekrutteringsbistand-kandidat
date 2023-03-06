import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { CvAction, CvActionType } from '../../cv/reducer/cvReducer';

const useCv = (kandidatnr: string, kandidatlisteId: string) => {
    const dispatch: Dispatch<CvAction | KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.cv);

    useEffect(() => {
        const settValgtKandidat = (kandidatlisteId: string, kandidatnr: string) => {
            dispatch({
                type: KandidatlisteActionType.VelgKandidat,
                kandidatlisteId,
                kandidatnr,
            });
        };

        settValgtKandidat(kandidatlisteId, kandidatnr);
    }, [dispatch, kandidatnr, kandidatlisteId]);

    useEffect(() => {
        const hentCvForKandidat = (arenaKandidatnr: string) => {
            dispatch({ type: CvActionType.NullstillCv });
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr });
        };

        hentCvForKandidat(kandidatnr);
    }, [dispatch, kandidatnr]);

    return state.cv;
};

export default useCv;
