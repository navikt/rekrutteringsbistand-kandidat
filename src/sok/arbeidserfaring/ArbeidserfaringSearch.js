import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { SkjemaGruppe, Radio } from 'nav-frontend-skjema';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    SEARCH
} from '../domene';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { REMOVE_SELECTED_ARBEIDSERFARING, SELECT_TOTAL_ERFARING, SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING } from './arbeidserfaringReducer';

class ArbeidserfaringSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.erfaringer = [{ label: 'Ikke relevant', value: '0-' },
            { label: 'Under 1 år', value: '0-11' }, { label: '1-3 år', value: '12-36' },
            { label: '4-9 år', value: '37-108' }, { label: 'Over 10 år', value: '109-' }];
    }

    onCheckTotalErfaring = (e) => {
        this.props.checkTotalErfaring(e.target.value);
        this.props.search();
    };

    onTypeAheadArbeidserfaringChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadArbeidserfaringSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadArbeidserfaring('suggestionsarbeidserfaring');
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
        this.props.removeArbeidserfaring(e.target.value);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
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
                        {this.props.arbeidserfaringer.map((arbeidserfaring) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={arbeidserfaring}
                                value={arbeidserfaring}
                            >
                                {arbeidserfaring}
                            </button>
                        ))}
                    </div>
                    <SkjemaGruppe title="Totalt antall år med arbeidserfaring">
                        <div className="sokekriterier--kriterier">
                            {this.erfaringer.map((arbeidserfaring) => (
                                <Radio
                                    className={this.props.totalErfaring === arbeidserfaring.value ? 'checkbox--sokekriterier--checked' : 'checkbox--sokekriterier--unchecked'}
                                    label={arbeidserfaring.label}
                                    key={arbeidserfaring.value}
                                    value={arbeidserfaring.value}
                                    name={arbeidserfaring.label}
                                    checked={this.props.totalErfaring === arbeidserfaring.value}
                                    onChange={this.onCheckTotalErfaring}
                                />
                            ))}
                        </div>
                    </SkjemaGruppe>
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
    checkTotalErfaring: PropTypes.func.isRequired,
    arbeidserfaringer: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsArbeidserfaring: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalErfaring: PropTypes.string.isRequired,
    clearTypeAheadArbeidserfaring: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
    typeAheadSuggestionsArbeidserfaring: state.typeahead.suggestionsarbeidserfaring,
    totalErfaring: state.arbeidserfaring.totalErfaring
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    clearTypeAheadArbeidserfaring: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'arbeidserfaring', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, value }),
    removeArbeidserfaring: (value) => dispatch({ type: REMOVE_SELECTED_ARBEIDSERFARING, value }),
    checkTotalErfaring: (value) => dispatch({ type: SELECT_TOTAL_ERFARING, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
