import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    INITIAL_SEARCH_BEGIN,
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
} from '../sok/searchReducer';
import './Resultat.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { Nettstatus } from '../../felles/common/remoteData';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { Kandidatliste } from '../kandidatlister/kandidatlistetyper';
import { Kandidatsøk } from './Kandidatsøk';
import { VeilederHeaderInfo } from './VeilederHeaderInfo';
import Sidetittel from '../../felles/common/Sidetittel';
import { Container } from 'nav-frontend-grid';
import { hentQueryUtenKriterier } from './ResultatVisning';
import AppState from '../AppState';

interface Props {
    resetQuery: (query: any) => void;
    initialSearch: (stillingsId: string | undefined, kandidatlisteId: string | undefined) => void;
    search: () => void;
    removeKompetanseSuggestions: () => void;
    isInitialSearch: boolean;
    leggTilKandidatStatus: string;
    antallLagredeKandidater: number;
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    harHentetStilling: boolean;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            stillingsId?: string;
        };
    };
    resetKandidatlisterSokekriterier: () => void;
    lukkAlleSokepanel: () => void;
    maksAntallTreff: number;
}

const KandidatsøkFraStilling: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    isInitialSearch,
    antallLagredeKandidater,
    lagretKandidatliste,
    leggTilKandidatStatus,
    initialSearch,
    resetKandidatlisterSokekriterier,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    maksAntallTreff,
}) => {
    const [suksessmeldingLagreKandidatVises, setSuksessmeldingLagreKandidatVises] = useState<
        boolean
    >(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        resetKandidatlisterSokekriterier();
    }, [resetKandidatlisterSokekriterier]);

    useEffect(() => {
        if (leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            setSuksessmeldingLagreKandidatVises(true);

            const timer = setTimeout(() => {
                setSuksessmeldingLagreKandidatVises(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [leggTilKandidatStatus]);

    const stillingsId = match.params.stillingsId;

    useEffect(() => {
        initialSearch(stillingsId, undefined);
    }, [stillingsId, initialSearch]);

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
        <Kandidatsøk
            visFantFåKandidater={visFantFåKandidater}
            antallLagredeKandidater={antallLagredeKandidater}
            lagretKandidatliste={lagretKandidatliste}
            stillingsId={stillingsId}
            visSpinner={isInitialSearch}
            suksessmeldingLagreKandidatVises={suksessmeldingLagreKandidatVises}
            header={header}
            onRemoveCriteriaClick={onRemoveCriteriaClick}
        />
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
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: (stillingsId, kandidatlisteId) => {
        dispatch({ type: INITIAL_SEARCH_BEGIN, stillingsId, kandidatlisteId });
    },
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraStilling);
