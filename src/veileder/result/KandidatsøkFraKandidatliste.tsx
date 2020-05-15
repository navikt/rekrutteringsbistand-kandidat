import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
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
            kandidatlisteId: string;
        };
    };
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) => void;
    kandidatlisteIdFraSøk?: string;
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
}) => {
    const kandidatlisteId = match.params.kandidatlisteId;

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

    const header = (
        <Container className="container--header">
            <VeilederHeaderInfo kandidatliste={kandidatliste} />
            <div className="container--header__lenker">
                <a
                    className="TilKandidater"
                    href={`/kandidater/lister/detaljer/${kandidatlisteId}`}
                >
                    <i className="TilKandidater__icon" />
                    <span className="link">Se kandidatliste</span>
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

    return (
        <>
            <KandidaterErLagretSuksessmelding
                antallLagredeKandidater={antallLagredeKandidater}
                lagretKandidatliste={lagretKandidatliste}
                leggTilKandidatStatus={leggTilKandidatStatus}
            />
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
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
    harHentetStilling: state.search.harHentetStilling,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    kandidatlisteIdFraSøk: state.search.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraKandidatliste);
