import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Ingress, Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { INITIAL_SEARCH } from './domene';
import YrkeSearch from './components/StillingSearch';
import UtdanningSearch from './components/UtdanningSearch';
import ArbeidserfaringSearch from './components/ArbeidserfaringSearch';
import KompetanseSearch from './components/KompetanseSearch';
import GeografiSearch from './components/GeografiSearch';
import { createUrlParamsFromState } from './sok';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
        this.state = {
            urlParameters: createUrlParamsFromState({ query: props.urlParams })
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.query !== this.props.query) {
            this.setState({
                urlParameters: createUrlParamsFromState({ query: nextProps.query })
            });
        }
    }

    render() {
        return (
            <div>
                {this.props.isInitialSearch ? (
                    <div className="text-center">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <Container className="blokk-s">
                        <div>
                            <Row>
                                <Column className="text-center">
                                    <Innholdstittel>Finn kandidater</Innholdstittel>
                                </Column>
                            </Row>
                            <div className="search-page">
                                <Row>
                                    <Column xs="12" md="8">
                                        <YrkeSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <KompetanseSearch />
                                        <GeografiSearch />
                                    </Column>
                                    <Column xs="12" md="4">
                                        <div className="panel resultatsummering--sokekriterier">
                                            <Ingress>Treff på aktuelle kandidater</Ingress>
                                            <Systemtittel className="antall--treff--sokekriterier">{this.props.treff} treff</Systemtittel>
                                            <Link
                                                to={`/pam-kandidatsok/resultat?${this.state.urlParameters}`}
                                                className="knapp knapp--hoved"
                                            >
                                                Se kandidatene
                                            </Link>
                                        </div>
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    </Container>
                )}
            </div>
        );
    }
}

Kandidatsok.propTypes = {
    initialSearch: PropTypes.func.isRequired,
    treff: PropTypes.number.isRequired,
    urlParams: PropTypes.shape({
        yrkeserfaringer: PropTypes.arrayOf(PropTypes.string),
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string),
        utdanninger: PropTypes.arrayOf(PropTypes.string),
        kompetanser: PropTypes.arrayOf(PropTypes.string),
        geografiList: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    query: PropTypes.shape({
        yrkeserfaringer: PropTypes.arrayOf(PropTypes.string),
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string),
        utdanninger: PropTypes.arrayOf(PropTypes.string),
        kompetanser: PropTypes.arrayOf(PropTypes.string),
        geografiList: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

const mapStateToProps = (state) => ({
    treff: state.elasticSearchResultat.total,
    isInitialSearch: state.isInitialSearch,
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
