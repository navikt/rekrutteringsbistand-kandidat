import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sidetittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import KandidaterVisning from './KandidaterVisning';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, PERFORM_INITIAL_SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';
import HjelpetekstFading from '../common/HjelpetekstFading';
import { LAGRE_STATUS } from '../konstanter';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import ListeIkon from '../common/ikoner/ListeIkon';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false
        };
    }

    componentDidMount() {
        this.props.performInitialSearch();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.visAlertstripeLagreKandidater();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
            stillinger: [],
            arbeidserfaringer: [],
            utdanninger: [],
            kompetanser: [],
            geografiList: [],
            geografiListKomplett: [],
            totalErfaring: [],
            utdanningsniva: [],
            sprak: [],
            maaBoInnenforGeografi: false
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
    };

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            suksessmeldingLagreKandidatVises: true
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessmeldingLagreKandidatVises: false
            });
        }, 5000);
    };

    render() {
        return (
            <div>
                {this.props.isInitialSearch ? (
                    <div className="text-center">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <HjelpetekstFading synlig={this.state.suksessmeldingLagreKandidatVises} type="suksess" tekst="Kandidaten har blitt lagret i kandidatlisten" />
                        <div className="ResultatVisning--header">
                            {this.props.visKandidatlister ? (
                                <div className="flex">
                                    <div className="flex-item no-content" />
                                    <div className="flex-item">
                                        <Sidetittel> Kandidatsøk </Sidetittel>
                                    </div>
                                    <div className="flex-item">
                                        <div className="lenke-og-ikon">
                                            <ListeIkon fargeKode="white" className="ListeIkon" />
                                            <Link to={`/${CONTEXT_ROOT}/lister`} className="lenke">
                                            Lagrede kandidatlister
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="wrapper container">
                                    <Sidetittel>Kandidatsøk</Sidetittel>
                                </div>
                            )}
                        </div>
                        <Container className="blokk-s container--wide">
                            <Row className="resultatvisning--body">
                                <Column xs="12" md="4">
                                    <button
                                        className="lenke lenke--slett--kriterier typo-normal"
                                        id="slett-alle-kriterier-lenke"
                                        onClick={this.onRemoveCriteriaClick}
                                    >
                                        Slett alle kriterier
                                    </button>
                                    <div className="resultatvisning--sokekriterier">
                                        <StillingSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <KompetanseSearch />
                                        <GeografiSearch />
                                    </div>
                                </Column>
                                <Column xs="12" md="8">
                                    <KandidaterVisning />
                                </Column>
                            </Row>
                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

ResultatVisning.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    performInitialSearch: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    visKandidatlister: PropTypes.bool.isRequired

};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    performInitialSearch: () => dispatch({ type: PERFORM_INITIAL_SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
