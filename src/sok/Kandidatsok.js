import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { INITIAL_SEARCH } from './domene';
import Resultat from './components/Resultat';
import YrkeSearch from './components/YrkeSearch';
import UtdanningSearch from './components/UtdanningSearch';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
    }

    render() {
        return (
            <div>
                <Container className="blokk-s">
                    <Row>
                        <Column className="text-center">
                            <Innholdstittel>Finn kandidater</Innholdstittel>
                        </Column>
                    </Row>
                    {this.props.isInitialSearch ? (
                        <div className="text-center">
                            <NavFrontendSpinner type="L" />
                        </div>
                    ) : (
                        <div className="search-page">
                            <Row>
                                <Column xs="7">
                                    <YrkeSearch />
                                    <UtdanningSearch />
                                </Column>
                                <Column xs="12" md="5">
                                    <Undertittel className="text-center">
                                        Resultat, {this.props.treff} treff
                                    </Undertittel>
                                </Column>
                            </Row>
                            <Row>
                                <Column xs="12" md="6">
                                    <Resultat />
                                </Column>
                            </Row>
                        </div>
                    )}
                </Container>
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
