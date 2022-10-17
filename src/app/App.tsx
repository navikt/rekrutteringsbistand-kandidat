import React, { FunctionComponent, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Normaltekst } from 'nav-frontend-typografi';

import { KandidatsøkAction, KandidatsøkActionType } from '../kandidatsøk/reducer/searchActions';
import { NavKontorAction, NavKontorActionTypes } from '../navKontor/navKontorReducer';
import { setNavKontorIAmplitude } from '../amplitude/amplitude';
import { TilToppenKnapp } from '../common/tilToppenKnapp/TilToppenKnapp';
import AppState from '../AppState';
import CvSide from '../kandidatside/cv/CvSide';
import ErrorSide from '../kandidatsøk/søkefiltre/error/ErrorSide';
import Historikkside from '../kandidatside/historikk/Historikkside';
import Kandidatlisteoversikt from '../listeoversikt/Kandidatlisteoversikt';
import KandidatlistesideMedStilling from '../kandidatliste/KandidatlistesideMedStilling';
import KandidatlisteUtenStilling from '../kandidatliste/KandidatlistesideUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import MatcherForStilling from '../automatisk-matching/AlleMatcher';
import Matchforklaring from '../automatisk-matching/matchforklaring/Matchforklaring';
import NotFound from '../kandidatsøk/søkefiltre/error/NotFound';
import Varsling from '../common/varsling/Varsling';
import './App.less';

type Props = {
    error: {
        status: number;
    };
    fetchFeatureToggles: () => void;
    fjernError: () => void;
    navKontor: string | null;
    velgNavKontor: (navKontor: string | null) => void;
};

const App: FunctionComponent<Props> = (props) => {
    const { error, fetchFeatureToggles, fjernError, navKontor, velgNavKontor } = props;

    useEffect(() => {
        fetchFeatureToggles();
    }, [fetchFeatureToggles]);

    useEffect(() => {
        if (navKontor) {
            velgNavKontor(navKontor);
            setNavKontorIAmplitude(navKontor);
        }
    }, [navKontor, velgNavKontor]);

    if (error) {
        return <ErrorSide error={error} fjernError={fjernError} />;
    }

    return (
        <>
            <Varsling />
            <Normaltekst tag="div" className="App">
                <main className="App__main">
                    <Routes>
                        <Route
                            path="/prototype/stilling/:stillingsId"
                            element={<MatcherForStilling />}
                        />
                        <Route
                            path="/prototype/stilling/:stillingsId/forklaring/:kandidatNr"
                            element={<Matchforklaring />}
                        />
                        <Route path="/kandidater/lister" element={<Kandidatlisteoversikt />} />
                        <Route
                            path="/kandidater/lister/stilling/:id/detaljer"
                            element={<KandidatlistesideMedStilling />}
                        />
                        <Route
                            path="/kandidater/lister/detaljer/:listeid"
                            element={<KandidatlisteUtenStilling />}
                        />
                        <Route path="kandidater/kandidat/:kandidatnr" element={<Kandidatside />}>
                            <Route path="cv" element={<CvSide />} />
                            <Route path="historikk" element={<Historikkside />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Normaltekst>
            <TilToppenKnapp />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    error: state.søk.error,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatsøkAction | NavKontorAction>) => ({
    fetchFeatureToggles: () => dispatch({ type: KandidatsøkActionType.FetchFeatureTogglesBegin }),
    fjernError: () => dispatch({ type: KandidatsøkActionType.FjernError }),
    velgNavKontor: (valgtNavKontor: string) =>
        dispatch({ type: NavKontorActionTypes.VelgNavKontor, valgtNavKontor }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
