import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import { INITIAL_SEARCH } from './domene';
import Resultat from './components/Resultat';
import SearchForm from './components/SearchForm';
import Arbeidserfaring from './components/Arbeidserfaring';

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
                <Column xs="12" md="4">
                    <Arbeidserfaring />
                </Column>
                <Column xs="12" md="8">
                    <SearchForm />
                </Column>
                <Resultat />
            </div>
        );
    }
}

Kandidatsok.propTypes = {
    initialSearch: PropTypes.func.isRequired,
    urlParams: PropTypes.shape({
        yrkeserfaring: PropTypes.string,
        utdanning: PropTypes.string,
        kompetanse: PropTypes.string,
        fritekst: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    // No props
});

const mapDispatchToProps = (dispatch) => ({
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
