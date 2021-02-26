import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { ListeoversiktActionType } from '../listeoversikt/reducer/ListeoversiktAction';

const useNullstillKandidatlisteState = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const nullstillSøkekriterierIKandidatlisteoversikt = () => {
            dispatch({ type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
        };

        const nullstillValgtKandidatIKandidatliste = () => {
            dispatch({
                type: KandidatlisteActionType.VELG_KANDIDAT,
            });
        };

        nullstillSøkekriterierIKandidatlisteoversikt();
        nullstillValgtKandidatIKandidatliste();
    });
};

export default useNullstillKandidatlisteState;
