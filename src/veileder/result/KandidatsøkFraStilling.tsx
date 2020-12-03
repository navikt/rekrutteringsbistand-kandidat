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
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';
import { Kandidatsøk } from './Kandidatsøk';
import { VeilederHeaderInfo } from './VeilederHeaderInfo';
import { Container } from 'nav-frontend-grid';
import AppState from '../AppState';
import { DefaultKandidatsøkProps, hentQueryUtenKriterier } from './DefaultKandidatsøk';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { harUrlParametere } from '../sok/searchQuery';
import { Link } from 'react-router-dom';
import { ListeoversiktActionType } from '../listeoversikt/reducer/ListeoversiktAction';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../application/paths';

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
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) => void;
    hentKandidatlisteMedStillingsId: (stillingsId: string) => void;
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) => void;
    kandidatlisteIdFraSøk: string;
    fjernValgtKandidat: () => void;
    stillingsId: string;
};

const KandidatsøkFraStilling: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    antallLagredeKandidater,
    lagretKandidatliste,
    leggTilKandidatStatus,
    leggInfoFraStillingIStateOgSøk,
    hentKandidatlisteMedStillingsId,
    leggUrlParametereIStateOgSøk,
    resetKandidatlisterSokekriterier,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    maksAntallTreff,
    fjernValgtKandidat,
    stillingsId,
}) => {
    const stillingsIdFraUrl = match.params.stillingsId;

    useEffect(() => {
        window.scrollTo(0, 0);
        resetKandidatlisterSokekriterier();
    }, [resetKandidatlisterSokekriterier]);

    useEffect(() => {
        fjernValgtKandidat();
    }, [fjernValgtKandidat]);

    useEffect(() => {
        if (harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href, kandidatliste?.kandidatlisteId);
        } else {
            hentKandidatlisteMedStillingsId(stillingsIdFraUrl);
            leggInfoFraStillingIStateOgSøk(stillingsIdFraUrl, kandidatliste?.kandidatlisteId);
        }
    }, [
        kandidatliste,
        stillingsIdFraUrl,
        leggInfoFraStillingIStateOgSøk,
        leggUrlParametereIStateOgSøk,
        hentKandidatlisteMedStillingsId,
    ]);

    const header = (
        <Container className="container--header">
            <VeilederHeaderInfo kandidatliste={kandidatliste} stillingsId={stillingsId} />
            <div className="container--header__lenker">
                <Link className="SeStilling lenke" to={lenkeTilStilling(stillingsId)}>
                    <i className="SeStilling__icon" />
                    Se stilling
                </Link>
                {kandidatliste && (
                    <Link
                        className="TilKandidater lenke"
                        to={lenkeTilKandidatliste(kandidatliste.kandidatlisteId)}
                    >
                        <i className="TilKandidater__icon" />
                        Se kandidatliste
                    </Link>
                )}
            </div>
        </Container>
    );

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling, kandidatliste?.kandidatlisteId));
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
    isInitialSearch: state.søk.isInitialSearch,
    leggTilKandidatStatus: state.kandidatliste.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatliste.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatliste.leggTilKandidater.lagretListe,
    harHentetStilling: state.søk.harHentetStilling,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    maksAntallTreff: state.søk.maksAntallTreff,
    kandidatlisteIdFraSøk: state.søk.kandidatlisteId,
    stillingsId: state.søk.stillingsId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_INFO_FRA_STILLING, stillingsId, kandidatlisteId }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    fjernValgtKandidat: () =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
        }),
    hentKandidatlisteMedStillingsId: (stillingsId) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraStilling);
