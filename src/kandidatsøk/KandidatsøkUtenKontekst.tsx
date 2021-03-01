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
import { Kandidatsøk } from './Kandidatsøk';
import AppState from '../AppState';
import { harUrlParametere } from './reducer/searchQuery';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';

type Props = FellesKandidatsøkProps & {
    søkestateKommerFraAnnetSøk: boolean;
    nullstillKandidaterErLagretIKandidatlisteAlert: () => void;
};

const KandidatsøkUtenKontekst: FunctionComponent<Props> = ({
    isInitialSearch,
    leggUrlParametereIStateOgSøk,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    søkestateKommerFraAnnetSøk,
    nullstillKandidaterErLagretIKandidatlisteAlert,
}) => {
    useNullstillKandidatlisteState();

    useEffect(() => {
        if (søkestateKommerFraAnnetSøk || harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href);
        } else {
            search();
        }
    }, [leggUrlParametereIStateOgSøk, søkestateKommerFraAnnetSøk, search]);

    useEffect(() => {
        nullstillKandidaterErLagretIKandidatlisteAlert();
    }, [nullstillKandidaterErLagretIKandidatlisteAlert]);

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling, undefined));
        removeKompetanseSuggestions();
        search();
    };

    return (
        <Kandidatsøk visSpinner={isInitialSearch} onRemoveCriteriaClick={onRemoveCriteriaClick} />
    );
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

const mapStateToProps = (state: AppState) => ({
    isInitialSearch: state.søk.isInitialSearch,
    harHentetStilling: state.søk.harHentetStilling,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    søkestateKommerFraAnnetSøk: !!state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggUrlParametereIStateOgSøk: (href: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    nullstillKandidaterErLagretIKandidatlisteAlert: () =>
        dispatch({
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkUtenKontekst);
