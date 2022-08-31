import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../AppState';
import { KandidatsøkAction, KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import { Søkekontekst } from '../søkekontekst';

const useLastInnFlereKandidater = (kontekst: Søkekontekst, kandidatnr: string) => {
    const dispatch: Dispatch<KandidatsøkAction> = useDispatch();
    const { kandidater: kandidaterFraState, totaltAntallTreff } = useSelector(
        (state: AppState) => state.søk.searchResultat.resultat
    );

    useEffect(() => {
        const lastInnFlereKandidaterForNavigering = () => {
            const aktivKandidat = kandidaterFraState.findIndex(
                (kandidat) => kandidat.arenaKandidatnr === kandidatnr
            );

            const aktivKandidatErNestSisteResultat =
                aktivKandidat === kandidaterFraState.length - 2;
            const kanLasteFlereResultater = kandidaterFraState.length < totaltAntallTreff;

            if (aktivKandidatErNestSisteResultat && kanLasteFlereResultater) {
                dispatch({ type: KandidatsøkActionType.LastFlereKandidater });
            }
        };

        if (
            kontekst.kontekst === 'fraKandidatsøk' ||
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling' ||
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
        ) {
            lastInnFlereKandidaterForNavigering();
        }
    }, [dispatch, kandidaterFraState, totaltAntallTreff, kandidatnr, kontekst.kontekst]);
};

export default useLastInnFlereKandidater;
