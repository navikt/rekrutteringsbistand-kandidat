import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_ARBEIDSERFARING, SEARCH, SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, SELECT_TYPE_AHEAD_VALUE_YRKE, SET_TYPE_AHEAD_VALUE } from '../domene';

class ArbeidserfaringSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
            arbeidserfaringer: ['Ingen arbeidserfaring', 'Over 3 år', 'Over 5 år', 'Over 10 år'],
            checkedArbeidserfaringer: []
        };
    }

    // TODO: Må skrives om til Redux når vi får mappingen
    onCheckedArbeidserfaringChange = (e) => {
        if (e.target.checked) {
            this.setState({
                checkedArbeidserfaringer: [
                    ...this.state.checkedArbeidserfaringer,
                    e.target.value
                ]
            });
        } else {
            this.setState({
                checkedArbeidserfaringer: this.state.checkedArbeidserfaringer.filter((u) => u !== e.target.value)
            });
        }
    };

    onTypeAheadArbeidserfaringChange = (value) => {
        this.props.setSearchString(value);
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadArbeidserfaringSelect = (value) => {
        this.props.setSearchString(value);
        this.props.selectTypeAheadValue();
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
        this.props.removeArbeidserfaring(e.target.value);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.selectTypeAheadValue();
        this.props.search();
    };

    render() {
        return (
            <div>
                <Undertittel>Arbeidserfaring</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Krav til arbeidserfaring
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.props.query.arbeidserfaringer.map((arbeidserfaring) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={arbeidserfaring}
                                value={arbeidserfaring}
                            >
                                {arbeidserfaring}
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
                                        onSelect={this.onTypeAheadArbeidserfaringSelect}
                                        onChange={this.onTypeAheadArbeidserfaringChange}
                                        label=""
                                        name="arbeidserfaring"
                                        placeholder="Skriv inn arbeidserfaring"
                                        suggestions={this.props.typeAheadSuggestionsArbeidserfaring}
                                        value={this.state.typeAheadValue}
                                        id="arbeidserfaring"
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
                                Legg til arbeidserfaring
                            </LeggTilKnapp>
                        )}
                    </div>
                    <Element>Antall år med arbeideserfaring</Element>
                    <div className="sokekriterier--kriterier">
                        {this.state.arbeidserfaringer.map((arbeidserfaring) => (
                            <Checkbox
                                className={this.state.checkedArbeidserfaringer.includes(arbeidserfaring) ? 'checkbox--sokekriterier--checked' : 'checkbox--sokekriterier--unchecked'}
                                label={arbeidserfaring}
                                key={arbeidserfaring}
                                value={arbeidserfaring}
                                onChange={this.onCheckedArbeidserfaringChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

ArbeidserfaringSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeArbeidserfaring: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired,
    query: PropTypes.shape({
        arbeidserfaring: PropTypes.string,
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsArbeidserfaring: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsArbeidserfaring: state.typeAheadSuggestionsarbeidserfaring
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'arbeidserfaring', value }),
    selectTypeAheadValue: () => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING }),
    setSearchString: (value) => dispatch({ type: SET_TYPE_AHEAD_VALUE, name: 'arbeidserfaring', value }),
    removeArbeidserfaring: (value) => dispatch({ type: REMOVE_SELECTED_ARBEIDSERFARING, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
