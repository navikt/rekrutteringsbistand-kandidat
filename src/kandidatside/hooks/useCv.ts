import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import { CvAction, CvActionType } from '../../cv/reducer/cvReducer';

const useCv = (kandidatnr: string) => {
    const dispatch: Dispatch<CvAction | KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.cv);

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
