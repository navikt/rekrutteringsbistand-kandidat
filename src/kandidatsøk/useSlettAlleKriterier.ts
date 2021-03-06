import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { KandidatsøkActionType } from './reducer/searchActions';

const useSlettAlleKriterier = (kandidatlisteId?: string) => {
    const dispatch = useDispatch();

    const søk = () => dispatch({ type: KandidatsøkActionType.Search });
    const lukkAlleSøkepaneler = () => dispatch({ type: KandidatsøkActionType.LukkAlleSokepanel });
    const nullstillSøkekriterier = () => {
        dispatch({
            type: KandidatsøkActionType.SetState,
            query: hentQueryUtenKriterier(kandidatlisteId),
        });
    };

    useEffect(() => {
        const nullstillKandidaterErLagretIKandidatlisteAlert = () => {
            dispatch({
                type: KandidatlisteActionType.LeggTilKandidaterReset,
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

export const hentQueryUtenKriterier = (kandidatlisteId?: string) => ({
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
    kandidatlisteId: kandidatlisteId,
});

export default useSlettAlleKriterier;
