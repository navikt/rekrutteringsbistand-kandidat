import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';

const useHentSendteMeldinger = (kandidatlisteId: string) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: KandidatlisteActionType.HENT_SENDTE_MELDINGER,
            kandidatlisteId: kandidatlisteId,
        });
    }, [dispatch, kandidatlisteId]);
};

export default useHentSendteMeldinger;
