import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
    SØK_MED_INFO_FRA_STILLING,
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
    maksAntallTreff: number;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            stillingsId: string;
        };
    };
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) => void;
    hentKandidatlisteMedStillingsId: (stillingsId: string) => void;
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) => void;
    kandidatlisteIdFraSøk: string;
    nullstillKandidaterErLagretIKandidatlisteAlert: () => void;
};

const KandidatsøkForStilling: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    leggInfoFraStillingIStateOgSøk,
    leggUrlParametereIStateOgSøk,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    maksAntallTreff,
    nullstillKandidaterErLagretIKandidatlisteAlert,
}) => {
    const stillingsIdFraUrl = match.params.stillingsId;
    useNullstillKandidatlisteState();
    useKandidatliste(stillingsIdFraUrl);

    useEffect(() => {
        if (harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href, kandidatliste?.kandidatlisteId);
        } else {
            leggInfoFraStillingIStateOgSøk(stillingsIdFraUrl, kandidatliste?.kandidatlisteId);
        }
    }, [
        kandidatliste,
        stillingsIdFraUrl,
        leggInfoFraStillingIStateOgSøk,
        leggUrlParametereIStateOgSøk,
    ]);

    useEffect(() => {
        nullstillKandidaterErLagretIKandidatlisteAlert();
    }, [nullstillKandidaterErLagretIKandidatlisteAlert]);

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling, kandidatliste?.kandidatlisteId));
        removeKompetanseSuggestions();
        search();
    };

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                visFantFåKandidater={maksAntallTreff < 5}
                stillingsId={stillingsIdFraUrl}
                visSpinner={isInitialSearch}
                header={
                    <KandidatlisteHeader
                        kandidatliste={kandidatliste}
                        stillingsId={stillingsIdFraUrl}
                    />
                }
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
    maksAntallTreff: state.søk.maksAntallTreff,
    kandidatlisteIdFraSøk: state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_INFO_FRA_STILLING, stillingsId, kandidatlisteId }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    nullstillKandidaterErLagretIKandidatlisteAlert: () =>
        dispatch({
            type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkForStilling);
