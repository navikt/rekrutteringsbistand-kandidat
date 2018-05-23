import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import {
    FETCH_KOMPETANSE_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
    REMOVE_SELECTED_STILLING, SEARCH,
    SELECT_TYPE_AHEAD_VALUE_STILLING
} from '../domene';

class StillingSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    componentDidMount() {
        this.props.fetchKompetanseSuggestions();
        this.props.search();
    }

    onTypeAheadStillingChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadStillingSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.setState({
                typeAheadValue: '',
                showTypeAhead: false
            }, () => this.leggTilKnapp.button.focus());
            this.props.fetchKompetanseSuggestions();
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeStilling(e.target.value);
        this.props.fetchKompetanseSuggestions();
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <div>
                <Undertittel>Stilling</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Hvilken stilling skal du ansette en kandidat til?
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.state.showTypeAhead ? (
                            <div className="leggtil--sokekriterier" >
                                <form
                                    onSubmit={this.onSubmit}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadStillingSelect}
                                        onChange={this.onTypeAheadStillingChange}
                                        label=""
                                        name="stilling"
                                        placeholder="Skriv inn stillingstittel"
                                        suggestions={this.props.typeAheadSuggestionsStilling}
                                        value={this.state.typeAheadValue}
                                        id="stilling"
                                    />
                                </form>
                            </div>
                        ) : (
                            <LeggTilKnapp
                                ref={(leggTilKnapp) => {
                                    this.leggTilKnapp = leggTilKnapp;
                                }}
                                onClick={this.onLeggTilClick}
                                className="lenke dashed leggtil--sokekriterier--knapp"
                            >
                                Legg til stilling
                            </LeggTilKnapp>
                        )}
                        {this.props.query.stillinger.map((stilling) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={stilling}
                                value={stilling}
                            >
                                {stilling}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

StillingSearch.propTypes = {
    fetchKompetanseSuggestions: PropTypes.func.isRequired,
    removeStilling: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    query: PropTypes.shape({
        stilling: PropTypes.string,
        stillinger: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsStilling: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsStilling: state.typeAheadSuggestionsstilling
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'stilling', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_STILLING, value }),
    removeStilling: (value) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    fetchKompetanseSuggestions: () => dispatch({ type: FETCH_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingSearch);
