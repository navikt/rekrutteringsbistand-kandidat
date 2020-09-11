import React, { FunctionComponent, useState, useEffect } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import { TilToppenKnapp } from '../common/tilToppenKnapp/TilToppenKnapp';
import CvSide from '../kandidatside/cv/CvSide';
import DefaultKandidatsøk from '../result/DefaultKandidatsøk';
import Dekoratør from '../dekoratør/Dekoratør';
import Historikkside from '../kandidatside/historikk/Historikkside';
import KandidatlistesideMedStilling from '../kandidatliste/KandidatlistesideMedStilling';
import Kandidatlisteoversikt from '../listeoversikt/Kandidatlisteoversikt';
import KandidatlisteUtenStilling from '../kandidatliste/KandidatlistesideUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import KandidatsøkFraKandidatliste from '../result/KandidatsøkFraKandidatliste';
import KandidatsøkFraStilling from '../result/KandidatsøkFraStilling';
import Navigeringsmeny from '../navigeringsmeny/Navigeringsmeny';
import NotFound from '../sok/error/NotFound';
import './Application.less';

const skjermerMedGråBakgrunn = [
    '/kandidater/lister/stilling/',
    '/kandidater/lister/detaljer/',
    '/kandidater/cv',
    '/kandidater/kandidat/',
    '/kandidater/lister',
];

const skalBrukeGråBakgrunn = (url: string) =>
    skjermerMedGråBakgrunn.some((urlMedGråBakgrunn) => url.includes(urlMedGråBakgrunn));

const Application: FunctionComponent<RouteComponentProps> = ({ location }) => {
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

export default withRouter(Application);
