import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_GEOGRAFI, SEARCH, SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, SET_TYPE_AHEAD_VALUE } from '../domene';
import Typeahead from '../../common/Typeahead';
import LeggTilKnapp from '../../common/LeggTilKnapp';

class GeografiSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadGeografiChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadGeografiSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.setState({
                typeAheadValue: '',
                showTypeAhead: false
            }, () => this.leggTilKnapp.button.focus());
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeGeografi(e.target.value);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.typeAheadValue !== '') {
            this.props.selectTypeAheadValue(this.state.typeAheadValue);
            this.setState({
                typeAheadValue: '',
                showTypeAhead: false
            }, () => this.leggTilKnapp.button.focus());
            this.props.search();
        }
    };

    render() {
        return (
            <div>
                <Undertittel>Stillingens geografiske plassering</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Legg til fylke, kommune eller by
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.state.showTypeAhead ? (
                            <div className="leggtil--sokekriterier">
                                <form
                                    onSubmit={this.onSubmit}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadGeografiSelect}
                                        onChange={this.onTypeAheadGeografiChange}
                                        label=""
                                        name="geografi"
                                        placeholder="Skriv inn sted"
                                        suggestions={this.props.typeAheadSuggestionsGeografi}
                                        value={this.state.typeAheadValue}
                                        id="geografi"
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
                                Legg til sted
                            </LeggTilKnapp>
                        )}
                        {this.props.query.geografiList.map((geo) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={geo}
                                value={geo}
                            >
                                {geo}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

GeografiSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeGeografi: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    query: PropTypes.shape({
        geografi: PropTypes.string,
        geografiList: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.isSearching,
    query: state.query,
    typeAheadSuggestionsGeografi: state.typeAheadSuggestionsgeografi
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'geografi', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, value }),
    removeGeografi: (value) => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(GeografiSearch);
