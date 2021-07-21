import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { lenkeTilKandidatside } from '../../app/paths';
import AppState from '../../AppState';
import { KandidatsøkAction, KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string
) => {
    const dispatch: Dispatch<KandidatsøkAction> = useDispatch();

    const fane = useAktivKandidatsidefane();
    const { kandidater, totaltAntallTreff } = useSelector(
        (state: AppState) => state.søk.searchResultat.resultat
    );

    const aktivKandidat = kandidater.findIndex(
        (kandidat) => kandidat.arenaKandidatnr === kandidatnr
    );

    useEffect(() => {
        const aktivKandidatErSisteResultat = aktivKandidat === kandidater.length;
        const kanLasteFlereResultater = kandidater.length < totaltAntallTreff;

        if (aktivKandidatErSisteResultat && kanLasteFlereResultater) {
            dispatch({ type: KandidatsøkActionType.LastFlereKandidater });
        }
    }, [dispatch, aktivKandidat, kandidater, totaltAntallTreff]);

    const forrigeKandidat = kandidater[aktivKandidat - 1]?.arenaKandidatnr;
    const lenkeTilForrige = forrigeKandidat
        ? lenkeTilKandidatside(forrigeKandidat, fane, kandidatlisteId, stillingsId)
        : undefined;

    const nesteKandidat = kandidater[aktivKandidat + 1]?.arenaKandidatnr;
    const lenkeTilNeste = nesteKandidat
        ? lenkeTilKandidatside(nesteKandidat, fane, kandidatlisteId, stillingsId)
        : undefined;

    return {
        aktivKandidat,
        lenkeTilForrige,
        lenkeTilNeste,
        antallKandidater: totaltAntallTreff,
    };
};

export default useNavigerbareKandidaterFraSøk;
