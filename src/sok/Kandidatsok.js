import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Ingress, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { INITIAL_SEARCH, REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, SET_STATE } from './searchReducer';
import StillingSearch from './stilling/StillingSearch';
import UtdanningSearch from './utdanning/UtdanningSearch';
import ArbeidserfaringSearch from './arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from './kompetanse/KompetanseSearch';
import GeografiSearch from './geografi/GeografiSearch';
import SprakSearch from './sprak/SprakSearch';
import Feedback from '../feedback/Feedback';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
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
            sprak: []
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
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
                        <Feedback />
                        <Container className="blokk-s">
                            <div>
                                <Row>
                                    <Column className="text-center">
                                        <Sidetittel>Finn kandidater</Sidetittel>
                                    </Column>
                                </Row>
                                <div className="search-page">
                                    <Row>
                                        <Column xs="12" md="8">
                                            <button
                                                className="lenke lenke--slett--kriterier typo-normal"
                                                id="slett-alle-kriterier-lenke"
                                                onClick={this.onRemoveCriteriaClick}
                                            >
                                                Slett alle kriterier
                                            </button>
                                            <StillingSearch />
                                            <UtdanningSearch />
                                            <ArbeidserfaringSearch />
                                            <SprakSearch />
                                            <KompetanseSearch />
                                            <GeografiSearch />
                                        </Column>
                                        <Column xs="12" md="4">
                                            <div className="panel resultatsummering--sokekriterier">
                                                <div className="antall-treff-panel">
                                                    {this.props.isEmptyQuery ? (
                                                        <Systemtittel className="antall-treff-sokekriterier--empty" id="antall-kandidater-treff">{this.props.totaltAntallTreff.toLocaleString('nb')} kandidater</Systemtittel>
                                                    ) : (
                                                        <div>
                                                            <Ingress>Treff på aktuelle kandidater</Ingress>
                                                            <Systemtittel className="antall-treff-sokekriterier" id="antall-kandidater-treff">{this.props.totaltAntallTreff.toLocaleString('nb')} treff</Systemtittel>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    to="/pam-kandidatsok/resultat"
                                                >
                                                    <Knapp
                                                        type="hoved"
                                                        id="se-kandidatene-knapp"
                                                        disabled={this.props.totaltAntallTreff === 0}
                                                    >
                                                        Se kandidatene
                                                    </Knapp>
                                                </Link>
                                            </div>
                                        </Column>
                                    </Row>
                                </div>
                            </div>
                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

Kandidatsok.propTypes = {
    initialSearch: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    resetQuery: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isInitialSearch: state.search.isInitialSearch,
    isEmptyQuery: state.search.isEmptyQuery
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
