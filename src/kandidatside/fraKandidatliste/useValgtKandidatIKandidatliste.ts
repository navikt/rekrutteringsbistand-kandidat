import { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { CvAction } from '../../cv/reducer/cvReducer';

const useValgtKandidatIKandidatliste = (kandidatnr: string, kandidatlisteId: string) => {
    const dispatch: Dispatch<CvAction | KandidatlisteAction> = useDispatch();

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
};

export default useValgtKandidatIKandidatliste;
