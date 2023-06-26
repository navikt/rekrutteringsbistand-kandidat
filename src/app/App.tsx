import { FunctionComponent, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { NavKontorAction, NavKontorActionTypes } from '../state/navKontorReducer';
import { setNavKontorIAmplitude } from '../amplitude/amplitude';
import { TilToppenKnapp } from '../komponenter/tilToppenKnapp/TilToppenKnapp';
import { ErrorAction, ErrorActionType } from '../state/errorReducer';
import AppState from '../state/AppState';
import CvSide from '../cv/CvSide';
import ErrorSide from '../komponenter/errorside/ErrorSide';
import Historikkside from '../historikk/Historikkside';
import Kandidatlisteoversikt from '../kandidatlisteoversikt/Kandidatlisteoversikt';
import KandidatlistesideMedStilling from '../kandidatliste/KandidatlistesideMedStilling';
import KandidatlisteUtenStilling from '../kandidatliste/KandidatlistesideUtenStilling';
import Kandidatside from '../kandidatside/Kandidatside';
import NotFound from '../komponenter/errorside/NotFound';
import Varsling from '../varsling/Varsling';
import ManglerTilgang from './ManglerTilgang';
import css from './App.module.css';

type Props = {
    error: {
        status: number;
    };
    fjernError: () => void;
    navKontor: string | null;
    velgNavKontor: (navKontor: string | null) => void;
};

const App: FunctionComponent<Props> = (props) => {
    const { error, fjernError, navKontor, velgNavKontor } = props;

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
            <div className={css.app}>
                <main className={css.main}>
                    <Routes>
                        <Route path="/kandidater/mangler-tilgang" element={<ManglerTilgang />} />
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
            </div>
            <TilToppenKnapp />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    error: state.error.error,
});

const mapDispatchToProps = (dispatch: Dispatch<ErrorAction | NavKontorAction>) => ({
    fjernError: () => dispatch({ type: ErrorActionType.FjernError }),
    velgNavKontor: (valgtNavKontor: string) =>
        dispatch({ type: NavKontorActionTypes.VelgNavKontor, valgtNavKontor }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
