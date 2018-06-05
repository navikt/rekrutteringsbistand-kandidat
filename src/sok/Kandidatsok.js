import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Ingress, Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { fromUrlQuery, INITIAL_SEARCH } from './domene';
import YrkeSearch from './stilling/StillingSearch';
import UtdanningSearch from './utdanning/UtdanningSearch';
import ArbeidserfaringSearch from './arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from './kompetanse/KompetanseSearch';
import GeografiSearch from './geografi/GeografiSearch';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
        this.state = {
            urlParameters: fromUrlQuery(window.location.href)
        };
    }

    componentWillReceiveProps() {
        this.setState({
            urlParameters: fromUrlQuery(window.location.href)
        });
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
                                            <Systemtittel className="antall--treff--sokekriterier">{this.props.totaltAntallTreff} treff</Systemtittel>
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
    totaltAntallTreff: PropTypes.number.isRequired,
    isInitialSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    totaltAntallTreff: state.search.elasticSearchResultat.resultat.totaltAntallTreff,
    isInitialSearch: state.search.isInitialSearch
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
