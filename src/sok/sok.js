import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import KnappBase from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import ResultatVisning from '../result/ResultatVisning';
import ManglerRolleAltinn from './error/ManglerRolleAltinn';
import { BACKEND_OPPE, LOGIN_URL, CONTEXT_ROOT, LOGOUT_URL } from '../common/fasitProperties';
import './../styles.less';
import './sok.less';
import searchReducer, { FETCH_FEATURE_TOGGLES_BEGIN, saga } from './searchReducer';
import stillingReducer from './stilling/stillingReducer';
import typeaheadReducer, { typeaheadSaga } from '../common/typeahead/typeaheadReducer';
import kompetanseReducer from './kompetanse/kompetanseReducer';
import arbeidserfaringReducer from './arbeidserfaring/arbeidserfaringReducer';
import utdanningReducer from './utdanning/utdanningReducer';
import geografiReducer from './geografi/geografiReducer';
import cvReducer, { cvSaga } from './cv/cvReducer';
import kandidatlisteReducer, { kandidatlisteSaga } from '../kandidatlister/kandidatlisteReducer';
import Feilside from './error/Feilside';
import arbeidsgivervelgerReducer, {
    HENT_ARBEIDSGIVERE_BEGIN,
    mineArbeidsgivereSaga
} from '../arbeidsgiver/arbeidsgiverReducer';
import { KandidatlisteHeader, KandidatsokHeader } from '../common/toppmeny/Toppmeny';
import Feedback from '../feedback/Feedback';
import sprakReducer from './sprak/sprakReducer';
import NedeSide from './error/NedeSide';
import VisKandidat from '../result/visKandidat/VisKandidat';
import Kandidatlister from '../kandidatlister/Kandidatlister';
import OpprettKandidatliste from '../kandidatlister/OpprettKandidatliste';
import VelgArbeidsgiver from '../arbeidsgiver/VelgArbeidsgiver';
import KandidatlisteDetalj from '../kandidatlister/KandidatlisteDetalj';
import forerkortReducer from './forerkort/forerkortReducer';
import VisKandidatFraLister from '../kandidatlister/VisKandidatFraLister';
import TokenChecker from './tokenCheck';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers({
    search: searchReducer,
    typeahead: typeaheadReducer,
    stilling: stillingReducer,
    kompetanse: kompetanseReducer,
    arbeidserfaring: arbeidserfaringReducer,
    utdanning: utdanningReducer,
    geografi: geografiReducer,
    forerkort: forerkortReducer,
    sprakReducer,
    cvReducer,
    kandidatlister: kandidatlisteReducer,
    mineArbeidsgivere: arbeidsgivervelgerReducer
}), composeWithDevTools(applyMiddleware(sagaMiddleware)));


/*
Begin class Sok
 */
class Sok extends React.Component {
    constructor(props) {
        super(props);
        this.tokenChecker = new TokenChecker();
        this.tokenChecker.on('token_expires_soon', this.visUtloperSnartModal);
        this.tokenChecker.on('token_expired', this.visSesjonUtgaattModal);
        this.state = {
            visSesjonUtloperSnartModal: false,
            visSesjonHarUtgaattModal: false
        };
    }

    componentDidMount() {
        this.tokenChecker.start();
        this.props.fetchFeatureTogglesOgInitialSearch();
        this.props.fetchArbeidsgivere();
    }

    // Have to wait for the error-message to be set in Redux, and redirect to Id-porten
    // if the error is 401 and to a new page if error is 403
    componentWillUpdate(nextProps) {
        const { error } = nextProps;
        if (error && error.status === 401) {
            this.redirectToLogin();
        } else if (error && error.status === 403) {
            window.location.href = `/${CONTEXT_ROOT}/altinn`;
        }
    }

    componentWillUnmount() {
        this.tokenChecker.destroy();
    }

    visUtloperSnartModal = () => {
        this.setState({
            visSesjonUtloperSnartModal: true
        });
    }

    visSesjonUtgaattModal = () => {
        this.setState({
            visSesjonUtloperSnartModal: false,
            visSesjonHarUtgaattModal: true
        });
        this.tokenChecker.pause();
    }

    lukkUtloperSnartModal = () => {
        this.setState({
            visSesjonUtloperSnartModal: false
        });
    }

    lukkSesjonUtgaattModal = () => {
        this.setState({
            visSesjonHarUtgaattModal: false
        });
        this.tokenChecker.pause();
    }

    // Redirect to login with Id-Porten
    redirectToLogin = () => {
        window.location.href = `${LOGIN_URL}&redirect=${window.location.href}`;
    };

    redirectToLoginMedForsideCallback = () => {
        window.location.href = `${LOGIN_URL}&redirect=${window.location.origin}/${CONTEXT_ROOT}`;
    }

    loggUt = () => {
        sessionStorage.clear();
        window.location.href = LOGOUT_URL;
    }

    render() {
        if (this.props.error) {
            return <Feilside />;
        } else if (this.props.isFetchingArbeidsgivere) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        } else if (this.props.arbeidsgivere.length > 1 && this.props.valgtArbeidsgiverId === undefined) {
            return <VelgArbeidsgiver />;
        } else if (this.state.visSesjonUtloperSnartModal) {
            return (<SesjonUtgaarModal
                tittelTekst={'Du blir snart logget ut'}
                innholdTekst={'Vil du fortsette å bruke tjenesten?'}
                primaerKnappTekst={'Forbli innlogget'}
                onPrimaerKnappClick={this.redirectToLogin}
                isOpen={this.state.visSesjonUtloperSnartModal}
                sekundaerKnappTekst={'Logg ut'}
                onSekundaerKnappClick={this.loggUt}
                sekundaerKnapp
            />);
        } else if (this.state.visSesjonHarUtgaattModal) {
            return (<SesjonUtgaarModal
                tittelTekst={'Du har blitt logget ut'}
                innholdTekst={'Denne sesjonen har utløpt. Gå til forsiden for å logge inn på nytt.'}
                primaerKnappTekst={'Til forsiden'}
                onPrimaerKnappClick={this.redirectToLoginMedForsideCallback}
                isOpen={this.state.visSesjonHarUtgaattModal}
            />);
        }
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path={`/${CONTEXT_ROOT}/lister`} component={KandidatlisteHeader} />
                        <Route component={KandidatsokHeader} />
                    </Switch>
                    <Switch>
                        <Route exact path={`/${CONTEXT_ROOT}`} component={ResultatVisning} />
                        <Route exact path={`/${CONTEXT_ROOT}/cv`} component={VisKandidat} />
                        <Route exact path={`/${CONTEXT_ROOT}/lister`} component={Kandidatlister} />
                        <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid`} component={KandidatlisteDetalj} />
                        <Route exact path={`/${CONTEXT_ROOT}/lister/detaljer/:listeid/cv`} component={VisKandidatFraLister} />
                        <Route exact path={`/${CONTEXT_ROOT}/lister/opprett`} component={OpprettKandidatliste} />
                        <Route exact path={`/${CONTEXT_ROOT}/altinn`} component={ManglerRolleAltinn} />
                        <Route exact path={`/${CONTEXT_ROOT}/feilside`} component={Feilside} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

Sok.defaultProps = {
    error: undefined,
    valgtArbeidsgiverId: undefined
};

Sok.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number
    }),
    fetchFeatureTogglesOgInitialSearch: PropTypes.func.isRequired,
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired,
    valgtArbeidsgiverId: PropTypes.string,
    fetchArbeidsgivere: PropTypes.func.isRequired,
    isFetchingArbeidsgivere: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    error: state.search.error,
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId,
    isFetchingArbeidsgivere: state.mineArbeidsgivere.isFetchingArbeidsgivere
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureTogglesOgInitialSearch: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fetchArbeidsgivere: () => dispatch({ type: HENT_ARBEIDSGIVERE_BEGIN })
});
/*
End class Sok
 */

const SokApp = connect(mapStateToProps, mapDispatchToProps)(Sok);

// eslint-disable-next-line no-unused-vars
const App = () => (
    <div>
        <Provider store={store}>
            <div>
                <Feedback />
                <SokApp />
            </div>
        </Provider>
    </div>
);

const MidlertidigNede = () => (
    <div>
        <KandidatsokHeader />
        <NedeSide />
    </div>
);

const SesjonUtgaarModal = ({ tittelTekst, innholdTekst, primaerKnappTekst, sekundaerKnappTekst, onPrimaerKnappClick, onSekundaerKnappClick, isOpen, sekundaerKnapp }) => (
    <NavFrontendModal
        className="SesjonUgaarModal"
        closeButton={false}
        shouldCloseOnOverlayClick={false}
        isOpen={isOpen}
        shouldFocusAfterRender
        onRequestClose={() => {}}
    >
        <Systemtittel>{tittelTekst}</Systemtittel>
        <div className="innhold">
            <Normaltekst>
                {innholdTekst}
            </Normaltekst>
        </div>
        <div className="knapperad">
            <KnappBase onClick={onPrimaerKnappClick} type="hoved">{primaerKnappTekst}</KnappBase>
            {sekundaerKnapp && <KnappBase onClick={onSekundaerKnappClick} type="flat">{sekundaerKnappTekst}</KnappBase>}
        </div>
    </NavFrontendModal>
);

SesjonUtgaarModal.defaultProps = {
    sekundaerKnapp: false,
    onSekundaerKnappClick: () => {},
    sekundaerKnappTekst: ''
};

SesjonUtgaarModal.propTypes = {
    tittelTekst: PropTypes.string.isRequired,
    innholdTekst: PropTypes.string.isRequired,
    primaerKnappTekst: PropTypes.string.isRequired,
    onPrimaerKnappClick: PropTypes.func.isRequired,
    sekundaerKnappTekst: PropTypes.string,
    onSekundaerKnappClick: PropTypes.func,
    sekundaerKnapp: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired
};

sagaMiddleware.run(saga);
sagaMiddleware.run(typeaheadSaga);
sagaMiddleware.run(cvSaga);
sagaMiddleware.run(kandidatlisteSaga);
sagaMiddleware.run(mineArbeidsgivereSaga);

const Root = () => (
    BACKEND_OPPE ? <App /> : <MidlertidigNede />
);

ReactDOM.render(
    <Root />,
    document.getElementById('app')
);

