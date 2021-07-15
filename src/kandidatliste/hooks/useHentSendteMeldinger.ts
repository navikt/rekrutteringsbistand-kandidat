import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';

const useHentSendteMeldinger = (kandidatlisteId: string) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: KandidatlisteActionType.HentSendteMeldinger,
            kandidatlisteId: kandidatlisteId,
        });
    }, [dispatch, kandidatlisteId]);
};

export default useHentSendteMeldinger;
