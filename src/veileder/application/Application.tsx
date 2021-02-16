import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import { appPrefiks } from './paths';
import { getMiljø, Miljø } from '../../felles/common/miljøUtils';
import { TilToppenKnapp } from '../common/tilToppenKnapp/TilToppenKnapp';
import CvSide from '../kandidatside/cv/CvSide';
import DefaultKandidatsøk from '../result/DefaultKandidatsøk';
import Historikkside from '../kandidatside/historikk/Historikkside';
import Kandidatlisteoversikt from '../listeoversikt/Kandidatlisteoversikt';
import KandidatlistesideMedStilling from '../kandidatliste/KandidatlistesideMedStilling';
import KandidatlisteUtenStilling from '../kandidatliste/KandidatlistesideUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import KandidatsøkFraKandidatliste from '../result/KandidatsøkFraKandidatliste';
import KandidatsøkFraStilling from '../result/KandidatsøkFraStilling';
import NotFound from '../sok/error/NotFound';
import useLoggNavigering from './useLoggNavigering';
import './Application.less';

const Application: FunctionComponent<RouteComponentProps> = ({ location }) => {
    useLoggNavigering();

    return (
        <>
            <Normaltekst tag="div" className="Application">
                <main className="Application__main">
                    <button
                        onClick={() => {
                            throw new Error('Rett i fella!');
                        }}
                    >
                        Trykk meg
                    </button>
                    {getMiljø() === Miljø.LabsGcp && <AdvarselOmMocketApp />}
                    <Switch>
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater`}
                            component={DefaultKandidatsøk}
                        />
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater/kandidatliste/:kandidatlisteId`}
                            component={KandidatsøkFraKandidatliste}
                        />
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater/stilling/:stillingsId`}
                            component={KandidatsøkFraStilling}
                        />
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater/lister`}
                            component={Kandidatlisteoversikt}
                        />
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater/lister/stilling/:id/detaljer`}
                            component={KandidatlistesideMedStilling}
                        />
                        <Route
                            exact
                            path={`${appPrefiks}/kandidater/lister/detaljer/:listeid`}
                            component={KandidatlisteUtenStilling}
                        />
                        <Route path={`${appPrefiks}/kandidater/kandidat/:kandidatnr`}>
                            <Kandidatside>
                                <Switch>
                                    <Route
                                        path={`${appPrefiks}/kandidater/kandidat/:kandidatnr/cv`}
                                    >
                                        <CvSide />
                                    </Route>
                                    <Route
                                        path={`${appPrefiks}/kandidater/kandidat/:kandidatnr/historikk`}
                                    >
                                        <Historikkside />
                                    </Route>
                                    <Redirect
                                        to={`${appPrefiks}/kandidater/kandidat/:kandidatnr/cv`}
                                    />
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

export default withRouter(Application);
