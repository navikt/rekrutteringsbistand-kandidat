import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Element, Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import KnappBase from 'nav-frontend-knapper';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import KandidaterVisning from './KandidaterVisning';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, MATCH_SEARCH, PERFORM_INITIAL_SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import HjelpetekstFading from '../common/HjelpetekstFading';
import { LAGRE_STATUS } from '../konstanter';
import { CONTEXT_ROOT, USE_JANZZ } from '../common/fasitProperties';
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
        if (USE_JANZZ) {
            this.props.matchSearch();
        }
    };

    onMatchClick = () => {
        this.props.matchSearch();
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
        const { antallLagredeKandidater } = this.props;
        return (
            <div>
                {this.props.isInitialSearch ? (
                    <div className="text-center">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <HjelpetekstFading
                            synlig={this.state.suksessmeldingLagreKandidatVises}
                            type="suksess"
                            tekst={antallLagredeKandidater > 1 ? `${antallLagredeKandidater} kandidater er lagt til` : 'Kandidaten er lagt til'}
                        />
                        <div className="ResultatVisning--hovedside--header">
                            {this.props.visKandidatlister ? (
                                <Container className="container--header">
                                    <div className="child-item__container--header">
                                        <div className="no-content" />
                                    </div>
                                    <div className="child-item__container--header">
                                        <Sidetittel> Kandidatsøk </Sidetittel>
                                    </div>
                                    <div className="child-item__container--header lenke--lagrede-kandidatlister">
                                        <div className="ikonlenke">
                                            <ListeIkon fargeKode="white" className="ListeIkon" />
                                            <Link to={`/${CONTEXT_ROOT}/lister`} className="lenke">
                                                <Normaltekst>Lagrede kandidatlister</Normaltekst>
                                            </Link>
                                        </div>
                                    </div>
                                </Container>
                            ) : (
                                <div className="wrapper container">
                                    <Sidetittel>Kandidatsøk</Sidetittel>
                                </div>
                            )}
                        </div>
                        <Container className="blokk-s">
                            <Column xs="12" md="4">
                                <div className="sokekriterier--column">
                                    <div className="knapp-wrapper">
                                        <KnappBase
                                            mini
                                            type="flat"
                                            className="lenke lenke--slett--kriterier typo-normal"
                                            id="slett-alle-kriterier-lenke"
                                            onClick={this.onRemoveCriteriaClick}
                                        >
                                            <Element>
                                            Slett alle kriterier
                                            </Element>
                                        </KnappBase>
                                    </div>
                                    {USE_JANZZ ? <KnappBase
                                        type="hoved"
                                        onClick={this.onMatchClick}
                                        className="send--sokekriterier--knapp"
                                        id="knapp-send--sokekriterier-knapp"
                                    >
                                        Finn kandidater
                                    </KnappBase> : ''}
                                    <div className="resultatvisning--sokekriterier">
                                        <StillingSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        <KompetanseSearch />
                                        <GeografiSearch />
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <div className="kandidatervisning--column">
                                    <KandidaterVisning />
                                </div>
                            </Column>
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
    matchSearch: PropTypes.func.isRequired,
    performInitialSearch: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    visKandidatlister: PropTypes.bool.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    matchSearch: () => dispatch({ type: MATCH_SEARCH }),
    performInitialSearch: () => dispatch({ type: PERFORM_INITIAL_SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
