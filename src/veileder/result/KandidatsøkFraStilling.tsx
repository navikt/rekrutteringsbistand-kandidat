import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
    SØK_MED_INFO_FRA_STILLING,
    SØK_MED_URL_PARAMETERE,
} from '../sok/searchReducer';
import './Resultat.less';
import { Nettstatus } from '../../felles/common/remoteData';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { Kandidatliste } from '../kandidatlister/kandidatlistetyper';
import { Kandidatsøk } from './Kandidatsøk';
import { VeilederHeaderInfo } from './VeilederHeaderInfo';
import { Container } from 'nav-frontend-grid';
import AppState from '../AppState';
import { DefaultKandidatsøkProps, hentQueryUtenKriterier } from './DefaultKandidatsøk';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { harUrlParametere } from '../sok/searchQuery';

type Props = DefaultKandidatsøkProps & {
    maksAntallTreff: number;
    leggTilKandidatStatus: string;
    antallLagredeKandidater: number;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            stillingsId: string;
        };
    };
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    leggInfoFraStillingIStateOgSøk: (stillingsId: string) => void;
    leggUrlParametereIStateOgSøk: () => void;
    søkestateKommerFraAnnetSøk: boolean;
};

const KandidatsøkFraStilling: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    antallLagredeKandidater,
    lagretKandidatliste,
    leggTilKandidatStatus,
    leggInfoFraStillingIStateOgSøk,
    leggUrlParametereIStateOgSøk,
    resetKandidatlisterSokekriterier,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    maksAntallTreff,
    søkestateKommerFraAnnetSøk,
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        resetKandidatlisterSokekriterier();
    }, [resetKandidatlisterSokekriterier]);

    const stillingsId = match.params.stillingsId;

    useEffect(() => {
        if (harUrlParametere(window.location.href) || søkestateKommerFraAnnetSøk) {
            leggUrlParametereIStateOgSøk();
        } else {
            if (!harHentetStilling) {
                leggInfoFraStillingIStateOgSøk(stillingsId);
            }
        }
    }, [
        stillingsId,
        harHentetStilling,
        søkestateKommerFraAnnetSøk,
        leggInfoFraStillingIStateOgSøk,
        leggUrlParametereIStateOgSøk,
    ]);

    const header = (
        <Container className="container--header">
            <VeilederHeaderInfo kandidatliste={kandidatliste} stillingsId={stillingsId} />
            <div className="container--header__lenker">
                <a className="SeStilling" href={`/stilling/${stillingsId}`}>
                    <i className="SeStilling__icon" />
                    <span className="link">Se stilling</span>
                </a>
            </div>
        </Container>
    );

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling));
        removeKompetanseSuggestions();
        search();
    };

    const visFantFåKandidater = !!(stillingsId && maksAntallTreff < 5);

    return (
        <>
            <KandidaterErLagretSuksessmelding
                antallLagredeKandidater={antallLagredeKandidater}
                lagretKandidatliste={lagretKandidatliste}
                leggTilKandidatStatus={leggTilKandidatStatus}
            />
            <Kandidatsøk
                visFantFåKandidater={visFantFåKandidater}
                stillingsId={stillingsId}
                visSpinner={isInitialSearch}
                header={header}
                onRemoveCriteriaClick={onRemoveCriteriaClick}
            />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
    harHentetStilling: state.search.harHentetStilling,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    maksAntallTreff: state.search.maksAntallTreff,
    søkestateKommerFraAnnetSøk: !!state.search.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggInfoFraStillingIStateOgSøk: (stillingsId: string) =>
        dispatch({ type: SØK_MED_INFO_FRA_STILLING, stillingsId }),
    leggUrlParametereIStateOgSøk: () => dispatch({ type: SØK_MED_URL_PARAMETERE }),
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraStilling);
