import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
    SØK_MED_URL_PARAMETERE,
} from './reducer/searchReducer';
import './Resultat.less';
import { Nettstatus } from '../api/remoteData';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import AppState from '../AppState';
import { hentQueryUtenKriterier } from './DefaultKandidatsøk';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { harUrlParametere } from './reducer/searchQuery';
import { ListeoversiktActionType } from '../listeoversikt/reducer/ListeoversiktAction';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';

type Props = FellesKandidatsøkProps & {
    leggTilKandidatStatus: string;
    antallLagredeKandidater: number;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            kandidatlisteId: string;
        };
    };
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) => void;
    kandidatlisteIdFraSøk?: string;
    fjernValgtKandidat: () => void;
    leggTilKandidaterReset: () => void;
};

const KandidatsøkFraKandidatliste: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    antallLagredeKandidater,
    lagretKandidatliste,
    leggTilKandidatStatus,
    leggUrlParametereIStateOgSøk,
    resetKandidatlisterSokekriterier,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    kandidatlisteIdFraSøk,
    fjernValgtKandidat,
    leggTilKandidaterReset,
}) => {
    const kandidatlisteId = match.params.kandidatlisteId;

    useEffect(() => {
        fjernValgtKandidat();
    }, [fjernValgtKandidat]);

    useEffect(() => {
        window.scrollTo(0, 0);
        resetKandidatlisterSokekriterier();
    }, [resetKandidatlisterSokekriterier]);

    useEffect(() => {
        const søkestateKommerFraDenneKandidatlisten =
            !!kandidatlisteIdFraSøk && kandidatlisteIdFraSøk === kandidatlisteId;

        const skalSøkeMedEksisterendeSøkestate =
            !harUrlParametere(window.location.href) && søkestateKommerFraDenneKandidatlisten;

        if (skalSøkeMedEksisterendeSøkestate) {
            search();
        } else {
            leggUrlParametereIStateOgSøk(window.location.href, kandidatlisteId);
        }
    }, [kandidatlisteId, kandidatlisteIdFraSøk, leggUrlParametereIStateOgSøk, search]);

    useEffect(() => {
        leggTilKandidaterReset();
    }, [leggTilKandidaterReset]);

    const header = <KandidatlisteHeader kandidatliste={kandidatliste} />;

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling, kandidatlisteId));
        removeKompetanseSuggestions();
        search();
    };

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                kandidatlisteId={kandidatlisteId}
                visSpinner={isInitialSearch}
                header={header}
                onRemoveCriteriaClick={onRemoveCriteriaClick}
            />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    isInitialSearch: state.søk.isInitialSearch,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatliste.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatliste.leggTilKandidater.lagretListe,
    harHentetStilling: state.søk.harHentetStilling,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    kandidatlisteIdFraSøk: state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    fjernValgtKandidat: () =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
        }),
    leggTilKandidaterReset: () =>
        dispatch({
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraKandidatliste);
