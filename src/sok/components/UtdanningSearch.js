import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_UTDANNING, SEARCH, SELECT_TYPE_AHEAD_VALUE_UTDANNING, SET_TYPE_AHEAD_VALUE } from '../domene';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
            utdanninger: ['Doktorgrad (ph.d)', 'Mastergrad', 'Bachelorgrad', 'Fagbrev', 'Videregående', 'Ingen utdanning'],
            checkedUtdanninger: []
        };
    }

    onCheckedUtanningerChange = (e) => {
        if (e.target.checked) {
            this.setState({
                checkedUtdanninger: [
                    ...this.state.checkedUtdanninger,
                    e.target.value
                ]
            });
        } else {
            this.setState({
                checkedUtdanninger: this.state.checkedUtdanninger.filter((u) => u !== e.target.value)
            });
        }
    };

    onTypeAheadUtdanningChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadUtdanningSelect = (value) => {
        this.props.selectTypeAheadValue(value);
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeUtdanning(e.target.value);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.props.selectTypeAheadValue(this.state.typeAheadValue);
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    render() {
        return (
            <div>
                <Undertittel>Utdanning</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>Utdanningsnivå</Element>
                    <div className="sokekriterier--kriterier">
                        {this.state.utdanninger.map((utdanning) => (
                            <Checkbox
                                className={this.state.checkedUtdanninger.includes(utdanning) ? 'checkbox--sokekriterier--checked' : 'checkbox--sokekriterier--unchecked'}
                                label={utdanning}
                                key={utdanning}
                                value={utdanning}
                                onChange={this.onCheckedUtanningerChange}
                            />
                        ))}
                    </div>
                    <Element>I hvilket fagfelt skal kandidaten ha utdanning</Element>
                    {this.props.query.utdanninger.map((utdanning) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={utdanning}
                            value={utdanning}
                        >
                            {utdanning}
                        </button>
                    ))}
                    {this.state.showTypeAhead ? (
                        <div className="leggtil--sokekriterier">
                            <form
                                onSubmit={this.onSubmit}
                            >
                                <Typeahead
                                    ref={(typeAhead) => {
                                        this.typeAhead = typeAhead;
                                    }}
                                    onSelect={this.onTypeAheadUtdanningSelect}
                                    onChange={this.onTypeAheadUtdanningChange}
                                    label=""
                                    name="utdanning"
                                    placeholder="Skriv inn fagfelt"
                                    suggestions={this.props.typeAheadSuggestionsUtdanning}
                                    value={this.state.typeAheadValue}
                                    id="yrke"
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
                            Legg til fagfelt
                        </LeggTilKnapp>
                    )}
                </div>
            </div>
        );
    }
}

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeUtdanning: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    query: PropTypes.shape({
        utdanning: PropTypes.string,
        utdanninger: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsUtdanning: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsUtdanning: state.typeAheadSuggestionsutdanning
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'utdanning', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_UTDANNING, value }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
