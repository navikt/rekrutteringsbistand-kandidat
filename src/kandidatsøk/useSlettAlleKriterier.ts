import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../AppState';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { LUKK_ALLE_SOKEPANEL, SEARCH, SET_STATE } from './reducer/searchReducer';

const useSlettAlleKriterier = (kandidatlisteId?: string) => {
    const dispatch = useDispatch();
    const { harHentetStilling } = useSelector((state: AppState) => state.søk);

    const søk = () => dispatch({ type: SEARCH });
    const lukkAlleSøkepaneler = () => dispatch({ type: LUKK_ALLE_SOKEPANEL });
    const nullstillSøkekriterier = () => {
        const queryUtenKriterier = hentQueryUtenKriterier(harHentetStilling, kandidatlisteId);
        dispatch({ type: SET_STATE, query: queryUtenKriterier });
    };

    useEffect(() => {
        const nullstillKandidaterErLagretIKandidatlisteAlert = () => {
            dispatch({
                type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
            });
        };

        nullstillKandidaterErLagretIKandidatlisteAlert();
    }, [dispatch]);

    return () => {
        lukkAlleSøkepaneler();
        nullstillSøkekriterier();
        søk();
    };
};

export const hentQueryUtenKriterier = (
    harHentetStilling: boolean,
    kandidatlisteId: string | undefined
) => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
    harHentetStilling: harHentetStilling,
    kandidatlisteId: kandidatlisteId,
});

export default useSlettAlleKriterier;
