import React, { FunctionComponent, useState, useEffect } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import { TilToppenKnapp } from '../common/tilToppenKnapp/TilToppenKnapp';
import DefaultKandidatsøk from '../result/DefaultKandidatsøk';
import Dekoratør from '../dekoratør/Dekoratør';
import Footer from '../footer/Footer';
import KandidatlisteMedStilling from '../kandidatlister/KandidatlisteMedStilling';
import Kandidatlister from '../kandidatlister/Kandidatlister';
import KandidatlisteUtenStilling from '../kandidatlister/KandidatlisteUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import KandidatsøkFraKandidatliste from '../result/KandidatsøkFraKandidatliste';
import KandidatsøkFraStilling from '../result/KandidatsøkFraStilling';
import Navigeringsmeny from '../navigeringsmeny/Navigeringsmeny';
import NotFound from '../sok/error/NotFound';
import './Application.less';
import CvSide from '../kandidatside/cv/CvSide';
import Historikkside from '../kandidatside/historikk/Historikkside';
import { useSelector } from 'react-redux';
import AppState from '../AppState';

const skjermerMedGråBakgrunn = [
    '/kandidater/lister/stilling/',
    '/kandidater/lister/detaljer/',
    '/kandidater/cv',
    '/kandidater/kandidat/',
];

const skalBrukeGråBakgrunn = (url: string) =>
    skjermerMedGråBakgrunn.some((urlMedGråBakgrunn) => url.includes(urlMedGråBakgrunn));

const Application: FunctionComponent<RouteComponentProps> = ({ location }) => {
    const visHistorikk = useSelector(
        (state: AppState) => state.search.featureToggles['vis-historikk']
    );

    const [brukGråBakgrunn, setBrukGråBakgrunn] = useState<boolean>(
        skalBrukeGråBakgrunn(location.pathname)
    );

    useEffect(() => {
        setBrukGråBakgrunn(skalBrukeGråBakgrunn(location.pathname));
    }, [location.pathname]);

    return (
        <>
            <Normaltekst
                tag="div"
                className={`Application${brukGråBakgrunn ? ' Application--grå' : ''}`}
            >
                <main className="Application__main">
                    <Dekoratør />
                    <Navigeringsmeny />
                    <Switch>
                        <Route exact path="/kandidater" component={DefaultKandidatsøk} />
                        <Route
                            exact
                            path="/kandidater/kandidatliste/:kandidatlisteId"
                            component={KandidatsøkFraKandidatliste}
                        />
                        <Route
                            exact
                            path="/kandidater/stilling/:stillingsId"
                            component={KandidatsøkFraStilling}
                        />
                        <Route exact path="/kandidater/lister" component={Kandidatlister} />
                        <Route
                            exact
                            path="/kandidater/lister/stilling/:id/detaljer"
                            component={KandidatlisteMedStilling}
                        />
                        <Route
                            exact
                            path="/kandidater/lister/detaljer/:listeid"
                            component={KandidatlisteUtenStilling}
                        />
                        <Route path="/kandidater/kandidat/:kandidatNr">
                            <Kandidatside>
                                <Switch>
                                    <Route path="/kandidater/kandidat/:kandidatNr/cv">
                                        <CvSide />
                                    </Route>
                                    {visHistorikk && (
                                        <Route path="/kandidater/kandidat/:kandidatNr/historikk">
                                            <Historikkside />
                                        </Route>
                                    )}
                                    <Redirect to="/kandidater/kandidat/:kandidatNr/cv" />
                                </Switch>
                            </Kandidatside>
                        </Route>
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </Normaltekst>
            <TilToppenKnapp />
            <Footer grå={brukGråBakgrunn} />
        </>
    );
};

export default withRouter(Application);
