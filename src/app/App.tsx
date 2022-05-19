import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { KandidatsøkAction, KandidatsøkActionType } from '../kandidatsøk/reducer/searchActions';
import { setNavKontorIAmplitude } from '../amplitude/amplitude';
import ErrorSide from '../kandidatsøk/søkefiltre/error/ErrorSide';
import AppState from '../AppState';
import { NavKontorAction, NavKontorActionTypes } from '../navKontor/navKontorReducer';
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
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Varsling from '../common/varsling/Varsling';
import './App.less';
import KandidatmatchPrototype from '../kandidatmatch-prototype/KandidatmatchPrototype';
import KandidatmatchStillingPrototype from '../kandidatmatch-prototype/KandidatmatchStillingPrototype';

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
                    {getMiljø() === Miljø.LabsGcp && <AdvarselOmMocketApp />}
                    <Switch>
                        <Route
                            exact
                            path="/prototype/:stillingId"
                            component={KandidatmatchPrototype}
                        />
                        <Route
                            exact
                            path="/prototype/stilling/:stillingId"
                            component={KandidatmatchStillingPrototype}
                        />

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

const mapDispatchToProps = (dispatch: Dispatch<KandidatsøkAction | NavKontorAction>) => ({
    fetchFeatureToggles: () => dispatch({ type: KandidatsøkActionType.FetchFeatureTogglesBegin }),
    fjernError: () => dispatch({ type: KandidatsøkActionType.FjernError }),
    lukkAlleSokepanel: () => dispatch({ type: KandidatsøkActionType.LukkAlleSokepanel }),
    velgNavKontor: (valgtNavKontor: string) =>
        dispatch({ type: NavKontorActionTypes.VelgNavKontor, valgtNavKontor }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
