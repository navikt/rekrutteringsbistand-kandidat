import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dispatch } from 'redux';
import { lenkeTilKandidatside } from '../../app/paths';
import AppState from '../../AppState';
import { KandidatsøkAction, KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import useAktivKandidatsidefane from '../hooks/useAktivKandidatsidefane';
import { StateFraNyttKandidatsøk, Søkekontekst } from '../søkekontekst';

export type Kandidatnavigering = {
    neste?: string;
    forrige?: string;
    index: number;
    antall: number;
    state?: object;
};

const useNavigerbareKandidaterFraSøk = (
    kandidatnr: string,
    kontekst: Søkekontekst
): Kandidatnavigering | null => {
    const dispatch: Dispatch<KandidatsøkAction> = useDispatch();
    const fane = useAktivKandidatsidefane();
    const { state } = useLocation();

    const { kandidater: kandidaterFraState, totaltAntallTreff } = useSelector(
        (state: AppState) => state.søk.searchResultat.resultat
    );

    useEffect(() => {
        if (
            kontekst.kontekst === 'fraKandidatsøk' ||
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling' ||
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
        ) {
            const aktivKandidat = kandidaterFraState.findIndex(
                (kandidat) => kandidat.arenaKandidatnr === kandidatnr
            );

            const aktivKandidatErNestSisteResultat =
                aktivKandidat === kandidaterFraState.length - 2;
            const kanLasteFlereResultater = kandidaterFraState.length < totaltAntallTreff;

            if (aktivKandidatErNestSisteResultat && kanLasteFlereResultater) {
                dispatch({ type: KandidatsøkActionType.LastFlereKandidater });
            }
        }
    }, [dispatch, kandidaterFraState, totaltAntallTreff, kandidatnr, kontekst.kontekst]);

    if (kontekst.kontekst === 'fraAutomatiskMatching') {
        return null;
    }

    let index = 0;
    let forrige: string | undefined = undefined;
    let neste: string | undefined = undefined;

    if (
        kontekst.kontekst === 'fraKandidatsøk' ||
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling' ||
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
    ) {
        const aktivKandidat = kandidaterFraState.findIndex(
            (kandidat) => kandidat.arenaKandidatnr === kandidatnr
        );

        const kandidatlisteId =
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
                ? kontekst.kandidatlisteId
                : undefined;
        const stillingsId =
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling'
                ? kontekst.stillingsId
                : undefined;

        const forrigeKandidat = kandidaterFraState[aktivKandidat - 1]?.arenaKandidatnr;
        if (forrigeKandidat) {
            forrige = lenkeTilKandidatside(forrigeKandidat, fane, kandidatlisteId, stillingsId);
        }

        const nesteKandidat = kandidaterFraState[aktivKandidat + 1]?.arenaKandidatnr;
        if (nesteKandidat) {
            neste = lenkeTilKandidatside(nesteKandidat, fane, kandidatlisteId, stillingsId);
        }
    } else {
        index = kontekst.kandidater.findIndex((kandidat) => kandidat === kandidatnr)!;

        const kandidatlisteId =
            kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk'
                ? kontekst.kandidatlisteId
                : undefined;

        const forrigeKandidatnr = kontekst.kandidater[index - 1];
        const nesteKandidatnr = kontekst.kandidater[index + 1];

        if (forrigeKandidatnr) {
            forrige = lenkeTilKandidatside(
                forrigeKandidatnr,
                fane,
                kandidatlisteId,
                undefined,
                false,
                false,
                true
            );
        }

        if (nesteKandidatnr) {
            neste = lenkeTilKandidatside(
                nesteKandidatnr,
                fane,
                kandidatlisteId,
                undefined,
                false,
                false,
                true
            );
        }
    }

    return {
        index,
        forrige,
        neste,
        antall: totaltAntallTreff,
        state: state as StateFraNyttKandidatsøk,
    };
};

export default useNavigerbareKandidaterFraSøk;
