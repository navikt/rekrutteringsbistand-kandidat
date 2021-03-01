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
import { hentQueryUtenKriterier } from './KandidatsøkUtenKontekst';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { harUrlParametere } from './reducer/searchQuery';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import useKandidatliste from './useKandidatliste';

type Props = FellesKandidatsøkProps & {
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            kandidatlisteId: string;
        };
    };
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) => void;
    kandidatlisteIdFraSøk?: string;
    fjernValgtKandidat: () => void;
    nullstillKandidaterErLagretIKandidatlisteAlert: () => void;
};

const KandidatsøkForKandidatliste: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    leggUrlParametereIStateOgSøk,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    kandidatlisteIdFraSøk,
    nullstillKandidaterErLagretIKandidatlisteAlert,
}) => {
    const kandidatlisteId = match.params.kandidatlisteId;
    useNullstillKandidatlisteState();
    useKandidatliste(undefined, kandidatlisteId);

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
        nullstillKandidaterErLagretIKandidatlisteAlert();
    }, [nullstillKandidaterErLagretIKandidatlisteAlert]);

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
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    nullstillKandidaterErLagretIKandidatlisteAlert: () =>
        dispatch({
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkForKandidatliste);
