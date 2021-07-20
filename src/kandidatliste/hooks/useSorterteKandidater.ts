import { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../AppState';
import { Kandidat } from '../domene/Kandidat';
import { sorteringsalgoritmer } from '../kandidatsortering';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import { Kandidatsortering } from '../reducer/kandidatlisteReducer';

const useSorterteKandidater = (
    kandidater: Kandidat[]
): {
    sorterteKandidater: Kandidat[];
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
} => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const { sortering } = useSelector((state: AppState) => state.kandidatliste);

    const setSortering = (sortering: Kandidatsortering) => {
        dispatch({
            type: KandidatlisteActionType.EndreSortering,
            sortering,
        });
    };

    const sorterteKandidater =
        sortering === null || sortering.retning === null
            ? kandidater
            : kandidater.sort(sorteringsalgoritmer[sortering.felt][sortering.retning]);

    return {
        sorterteKandidater,
        sortering,
        setSortering,
    };
};

export default useSorterteKandidater;
