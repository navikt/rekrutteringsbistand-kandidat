import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { REMOVE_SELECTED_GEOGRAFI, SELECT_TYPE_AHEAD_VALUE_GEOGRAFI } from './geografiReducer';
import './Geografi.less';

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
            const geografi = this.props.typeAheadSuggestionsGeografiKomplett.find((k) => k.geografiKodeTekst.toLowerCase() === value.toLowerCase());
            if (geografi !== undefined) {
                this.props.selectTypeAheadValue(geografi);
                this.props.clearTypeAheadGeografi('suggestionsgeografi');
                this.setState({
                    typeAheadValue: ''
                });
                this.props.search();
            }
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

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadGeografi('suggestionsgeografi');
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadGeografiSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        return (
            <div>
                <Systemtittel>Stillingens geografiske plassering</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Legg til fylke, kommune eller by
                    </Element>
                    <div className="sokekriterier--kriterier">
                        <div className="sokefelt--wrapper--geografi">
                            {this.state.showTypeAhead ? (
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
                                    id="typeahead-geografi"
                                    onSubmit={this.onSubmit}
                                    onTypeAheadBlur={this.onTypeAheadBlur}
                                />
                            ) : (
                                <Knapp
                                    onClick={this.onLeggTilClick}
                                    className="leggtil--sokekriterier--knapp"
                                    id="leggtil-sted-knapp"
                                >
                                    +Legg til sted
                                </Knapp>
                            )}
                        </div>
                        {this.props.geografiListKomplett && this.props.geografiListKomplett.map((geo) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={geo.geografiKodeTekst}
                                value={geo.geografiKode}
                            >
                                {geo.geografiKodeTekst}
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
    geografiListKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsGeografiKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    clearTypeAheadGeografi: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.search.isSearching,
    geografiList: state.geografi.geografiList,
    geografiListKomplett: state.geografi.geografiListKomplett,
    typeAheadSuggestionsGeografi: state.typeahead.suggestionsgeografi,
    typeAheadSuggestionsGeografiKomplett: state.typeahead.suggestionsGeografiKomplett
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    clearTypeAheadGeografi: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'geografi', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, value }),
    removeGeografi: (value) => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(GeografiSearch);
