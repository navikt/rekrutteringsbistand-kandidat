import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Column } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, SEARCH, SELECT_TYPE_AHEAD_VALUE, SET_TYPE_AHEAD_VALUE } from '../domene';
import Typeahead from './Typeahead';

class SearchForm extends React.Component {
    onSubmit = (e) => {
        e.preventDefault();
        this.props.search();
    };

    onTypeAheadYrkeChange = (value) => {
        this.props.setSearchString('yrkeserfaring', value);
        this.props.fetchTypeAheadSuggestions('yrkeserfaring', value);
    };

    onTypeAheadYrkeSelect = (value) => {
        this.props.setSearchString('yrkeserfaring', value);
        this.props.selectTypeAheadValue('typeAheadSuggestionsyrkeserfaring');
    };

    onTypeAheadUtdanningChange = (value) => {
        this.props.setSearchString('utdanning', value);
        this.props.fetchTypeAheadSuggestions('utdanning', value);
    };

    onTypeAheadUtdanningSelect = (value) => {
        this.props.setSearchString('utdanning', value);
        this.props.selectTypeAheadValue('typeAheadSuggestionsutdanning');
    };

    onTypeAheadKompetanseChange = (value) => {
        this.props.setSearchString('kompetanse', value);
        this.props.fetchTypeAheadSuggestions('kompetanse', value);
    };

    onTypeAheadKompetanseSelect = (value) => {
        this.props.setSearchString('kompetanse', value);
        this.props.selectTypeAheadValue('typeAheadSuggestionskompetanse');
    };

    render() {
        return (
            <Container className="blokk-s">
                <SkjemaGruppe>
                    <form onSubmit={this.onSubmit}>
                        <label htmlFor="yrke" className="skjemaelement__label">
                            Yrke/Stilling
                        </label>
                        <Typeahead
                            className="skjemaelement__input input--fullbredde"
                            id="yrke"
                            onSelect={this.onTypeAheadYrkeSelect}
                            onChange={this.onTypeAheadYrkeChange}
                            label=""
                            autocomplete="off"
                            name="yrke"
                            placeholder=""
                            suggestions={this.props.typeAheadSuggestionsYrke}
                            value={this.props.query.yrkeserfaring}
                        />
                        <label htmlFor="utdanning" className="skjemaelement__label">
                            Utdanning
                        </label>
                        <Typeahead
                            className="skjemaelement__input input--fullbredde"
                            id="utdanninger"
                            onSelect={this.onTypeAheadUtdanningSelect}
                            onChange={this.onTypeAheadUtdanningChange}
                            label=""
                            autocomplete="off"
                            name="utdanning"
                            placeholder=""
                            suggestions={this.props.typeAheadSuggestionsUtdanning}
                            value={this.props.query.utdanning}
                        />
                        <label htmlFor="kompetanse" className="skjemaelement__label">
                            Kompetanse
                        </label>
                        <Typeahead
                            className="skjemaelement__input input--fullbredde"
                            id="kompetanser"
                            onSelect={this.onTypeAheadKompetanseSelect}
                            onChange={this.onTypeAheadKompetanseChange}
                            label=""
                            placeholder=""
                            autocomplete="off"
                            name="kompetanser"
                            suggestions={this.props.typeAheadSuggestionsKompetanse}
                            value={this.props.query.kompetanse}
                        />
                        <Row>&nbsp;</Row>
                        <Row>
                            <Column xs="5" md="3">
                                <Knapp htmlType="submit" type="standard" className="knapp knapp-pam-hoved">Søk</Knapp>
                            </Column>
                        </Row>
                    </form>
                </SkjemaGruppe>
            </Container>
        );
    }
}

SearchForm.propTypes = {
    search: PropTypes.func.isRequired,
    query: PropTypes.shape({
        yrkeserfaring: PropTypes.string,
        utdanning: PropTypes.string,
        kompetanse: PropTypes.string,
    }).isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired,
    typeAheadSuggestionsYrke: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsUtdanning: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.isSearching,
    query: state.query,
    typeAheadSuggestionsYrke: state.typeAheadSuggestionsyrkeserfaring,
    typeAheadSuggestionsUtdanning: state.typeAheadSuggestionsutdanning,
    typeAheadSuggestionsKompetanse: state.typeAheadSuggestionskompetanse
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (name, value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name, value }),
    selectTypeAheadValue: (typeAheadField) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE, typeAheadSuggestionsLabel: typeAheadField }),
    setSearchString: (name, value) => dispatch({ type: SET_TYPE_AHEAD_VALUE, name, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
