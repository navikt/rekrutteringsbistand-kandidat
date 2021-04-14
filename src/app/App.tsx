import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';

import {
    FETCH_FEATURE_TOGGLES_BEGIN,
    FJERN_ERROR,
    LUKK_ALLE_SOKEPANEL,
} from '../kandidatsøk/reducer/searchReducer';
import { sendEvent } from '../amplitude/amplitude';
import ErrorSide from '../kandidatsøk/søkefiltre/error/ErrorSide';
import AppState from '../AppState';
import { NavKontorActionTypes } from '../navKontor/navKontorReducer';
import { Normaltekst } from 'nav-frontend-typografi';
import { getMiljø, Miljø } from '../utils/miljøUtils';
import { Redirect, Route, Switch } from 'react-router-dom';
import KandidatsøkUtenKontekst from '../kandidatsøk/KandidatsøkUtenKontekst';
import KandidatsøkIKontekstAvKandidatliste from '../kandidatsøk/KandidatsøkIKontekstAvKandidatliste';
import KandidatsøkIKontekstAvStilling from '../kandidatsøk/KandidatsøkIKontekstAvStilling';
import Kandidatlisteoversikt from '../listeoversikt/Kandidatlisteoversikt';
import KandidatlistesideMedStilling from '../kandidatliste/KandidatlistesideMedStilling';
import KandidatlisteUtenStilling from '../kandidatliste/KandidatlistesideUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import CvSide from '../kandidatside/cv/CvSide';
import Historikkside from '../kandidatside/historikk/Historikkside';
import NotFound from '../kandidatsøk/søkefiltre/error/NotFound';
import { TilToppenKnapp } from '../common/tilToppenKnapp/TilToppenKnapp';
import useLoggNavigering from './useLoggNavigering';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
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
    useLoggNavigering();

    useEffect(() => {
        fetchFeatureToggles();
        sendEvent('app', 'åpne', {
            skjermbredde: window.screen.width,
        });
    }, [fetchFeatureToggles]);

    useEffect(() => {
        if (navKontor) {
            velgNavKontor(navKontor);
        }
    }, [navKontor, velgNavKontor]);

    if (error) {
        return <ErrorSide error={error} fjernError={fjernError} />;
    }

    return (
        <>
            <Normaltekst tag="div" className="App">
                <button
                    onClick={() => {
                        throw new Error('Trigget feil!');
                    }}
                >
                    Trykk meg!
                </button>
                <main className="App__main">
                    {getMiljø() === Miljø.LabsGcp && <AdvarselOmMocketApp />}
                    <Switch>
                        <Route exact path="/kandidater" component={KandidatsøkUtenKontekst} />
                        <Route
                            exact
                            path="/kandidater/kandidatliste/:kandidatlisteId"
                            component={KandidatsøkIKontekstAvKandidatliste}
                        />
                        <Route
                            exact
                            path="/kandidater/stilling/:stillingsId"
                            component={KandidatsøkIKontekstAvStilling}
                        />
                        <Route exact path="/kandidater/lister" component={Kandidatlisteoversikt} />
                        <Route
                            exact
                            path="/kandidater/lister/stilling/:id/detaljer"
                            component={KandidatlistesideMedStilling}
                        />
                        <Route
                            exact
                            path="/kandidater/lister/detaljer/:listeid"
                            component={KandidatlisteUtenStilling}
                        />
                        <Route path="/kandidater/kandidat/:kandidatnr">
                            <Kandidatside>
                                <Switch>
                                    <Route path="/kandidater/kandidat/:kandidatnr/cv">
                                        <CvSide />
                                    </Route>
                                    <Route path="/kandidater/kandidat/:kandidatnr/historikk">
                                        <Historikkside />
                                    </Route>
                                    <Redirect to="/kandidater/kandidat/:kandidatnr/cv" />
                                </Switch>
                            </Kandidatside>
                        </Route>
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </Normaltekst>
            <TilToppenKnapp />
        </>
    );
};

const AdvarselOmMocketApp = () => (
    <AlertStripeAdvarsel>
        <b>Dette er en testversjon av Rekrutteringsbistand. </b>
        Den er ikke knyttet til noen database, så handlinger har ingen konsekvenser utenom enkle,
        grafiske tilbakemeldinger.
    </AlertStripeAdvarsel>
);

const mapStateToProps = (state: AppState) => ({
    error: state.søk.error,
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    velgNavKontor: (valgtNavKontor: string) =>
        dispatch({ type: NavKontorActionTypes.VelgNavKontor, valgtNavKontor }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
