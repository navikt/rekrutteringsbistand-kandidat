import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { SkjemaGruppe, Checkbox } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    SEARCH
} from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { REMOVE_SELECTED_ARBEIDSERFARING, SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, CHECK_TOTAL_ERFARING, UNCHECK_TOTAL_ERFARING } from './arbeidserfaringReducer';

class ArbeidserfaringSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.erfaringer = [{ label: 'Under 1 år', value: '0-11' }, { label: '1-3 år', value: '12-47' },
            { label: '4-9 år', value: '48-119' }, { label: 'Over 10 år', value: '120-' }];
    }

    onTotalErfaringChange = (e) => {
        if (e.target.checked) {
            this.props.checkTotalErfaring(e.target.value);
        } else {
            this.props.uncheckTotalErfaring(e.target.value);
        }
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
                typeAheadValue: ''
            });
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

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadArbeidserfaring('suggestionsarbeidserfaring');
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.typeAheadValue !== '') {
            this.onTypeAheadArbeidserfaringSelect(this.state.typeAheadValue);
            this.typeAhead.input.focus();
        }
    };

    render() {
        return (
            <div>
                <Systemtittel>Arbeidserfaring</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Hvilken arbeidserfaring skal kandidaten ha?
                    </Element>
                    <Normaltekst className="text--italic">
                        For eksempel barnehagelærer
                    </Normaltekst>
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
                                        id="typeahead-arbeidserfaring"
                                        onSubmit={this.onSubmit}
                                        onTypeAheadBlur={this.onTypeAheadBlur}
                                    />
                                </form>
                            </div>
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp"
                                id="leggtil-arbeidserfaring-knapp"
                            >
                                +Legg til arbeidserfaring
                            </Knapp>
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
                    <SkjemaGruppe title="Totalt antall år med arbeidserfaring - velg en eller flere">
                        <div className="sokekriterier--kriterier">
                            {this.erfaringer.map((arbeidserfaring) => (
                                <Checkbox
                                    id={`arbeidserfaring-${arbeidserfaring.value.toLowerCase()}-checkbox`}
                                    className={this.props.totalErfaring.includes(arbeidserfaring.value) ?
                                        'checkbox--sokekriterier--checked' :
                                        'checkbox--sokekriterier--unchecked'}
                                    label={arbeidserfaring.label}
                                    key={arbeidserfaring.value}
                                    value={arbeidserfaring.value}
                                    checked={this.props.totalErfaring.includes(arbeidserfaring.value)}
                                    onChange={this.onTotalErfaringChange}
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
    uncheckTotalErfaring: PropTypes.func.isRequired,
    arbeidserfaringer: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsArbeidserfaring: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalErfaring: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    checkTotalErfaring: (value) => dispatch({ type: CHECK_TOTAL_ERFARING, value }),
    uncheckTotalErfaring: (value) => dispatch({ type: UNCHECK_TOTAL_ERFARING, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
