import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../reducer/KandidatlisteAction';

const useHentForespørslerOmDelingAvCv = (stillingsId: string | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (stillingsId) {
            dispatch<KandidatlisteAction>({
                type: KandidatlisteActionType.HentForespørslerOmDelingAvCv,
                stillingsId,
            });
        }
    }, [dispatch, stillingsId]);
};

export default useHentForespørslerOmDelingAvCv;
