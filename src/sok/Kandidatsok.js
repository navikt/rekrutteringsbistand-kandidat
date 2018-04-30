import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Ingress, Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { INITIAL_SEARCH } from './domene';
import YrkeSearch from './components/YrkeSearch';
import UtdanningSearch from './components/UtdanningSearch';
import ArbeidserfaringSearch from './components/ArbeidserfaringSearch';
import KompetanseSearch from './components/KompetanseSearch';
import GeografiSearch from './components/GeografiSearch';
import ResultatVisning from './ResultatVisning';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
        this.state = {
            showResultsPage: false
        };
    }

    toggleResultsClick = () => {
        this.setState({
            showResultsPage: !this.state.showResultsPage
        });
    };

    render() {
        if (this.props.isInitialSearch) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                {this.state.showResultsPage ? (
                    <Container className="blokk-s container--wide">
                        <ResultatVisning />
                    </Container>
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
                                    <Column xs="8">
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
                                            <Hovedknapp onClick={this.toggleResultsClick}>
                                                Se kandidatene
                                            </Hovedknapp>
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
        yrkeserfaring: PropTypes.string,
        utdanning: PropTypes.string,
        kompetanse: PropTypes.string
    }).isRequired,
    isInitialSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    treff: state.elasticSearchResultat.total,
    isInitialSearch: state.isInitialSearch
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
