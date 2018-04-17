import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import { INITIAL_SEARCH } from './domene';
import Resultat from './components/Resultat';
import SearchForm from './components/SearchForm';
import Utdanninger from './components/Utdanninger';
import Yrkeserfaringer from './components/Yrkeserfaringer';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
    }


    render() {
        return (
            <div>
                <div className="search-page-header" />
                <Container className="search-page-margin">
                    <Systemtittel>Kandidatsøk</Systemtittel>
                </Container>
                <SearchForm />
                <Undertittel className="text-center">
                    Resultat, {this.props.treff} treff
                </Undertittel>
                <Container className="blokk-s">
                    <Column xs="12" md="4">
                        <div className="aggregation-filters">
                            <Utdanninger />
                            <Yrkeserfaringer />
                        </div>
                    </Column>
                    <Column xs="12" md="8">
                        <Resultat />
                    </Column>
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
        kompetanse: PropTypes.string,
        fritekst: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    treff: state.elasticSearchResultat.total
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
