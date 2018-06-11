import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../domene';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { CHECK_UTDANNINGSNIVA, REMOVE_SELECTED_UTDANNING, SELECT_TYPE_AHEAD_VALUE_UTDANNING, UNCHECK_UTDANNINGSNIVA } from './utdanningReducer';
import './Utdanning.less';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.utdanningsnivaKategorier = [{ key: 'Ingen', label: 'Ingen utdanning' },
            { key: 'Videregaende', label: 'Videregående' }, { key: 'Fagskole', label: 'Fagskole' },
            { key: 'Bachelor', label: 'Bachelorgrad' }, { key: 'Master', label: 'Mastergrad' },
            { key: 'Doktorgrad', label: 'Doktorgrad' }];
    }

    onUtdanningsnivaChange = (e) => {
        if (e.target.checked) {
            this.props.checkUtdanningsniva(e.target.value);
        } else {
            this.props.uncheckUtdanningsniva(e.target.value);
        }
        this.props.search();
    };

    onTypeAheadUtdanningChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadUtdanningSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadUtdanning('suggestionsutdanning');
            this.setState({
                typeAheadValue: '',
                showTypeAhead: false
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
        this.props.removeUtdanning(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadUtdanning('suggestionsutdanning');
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
    };

    render() {
        return (
            <div>
                <Systemtittel>Utdanning</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <SkjemaGruppe title="Utdanningsnivå">
                        <div className="sokekriterier--kriterier">
                            {this.utdanningsnivaKategorier.map((utdanning) => (
                                <Checkbox
                                    className={this.props.utdanningsniva.includes(utdanning.key) ?
                                        'checkbox--sokekriterier--checked utdanningsniva' :
                                        'checkbox--sokekriterier--unchecked utdanningsniva'}
                                    label={utdanning.label}
                                    key={utdanning.key}
                                    value={utdanning.key}
                                    checked={this.props.utdanningsniva.includes(utdanning.key)}
                                    onChange={this.onUtdanningsnivaChange}
                                />
                            ))}
                        </div>
                    </SkjemaGruppe>
                    {this.props.visManglendeArbeidserfaringBoks && (
                        <Checkbox
                            label="Arbeidserfaring kan veie opp for manglende utdanning"
                            className="checkbox--manglende--arbeidserfaring"
                        />
                    )}
                    <Element>I hvilket fagfelt skal kandidaten ha utdanning</Element>
                    <Normaltekst className="text--italic">
                        For eksempel pedagogikk
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
                                        onSelect={this.onTypeAheadUtdanningSelect}
                                        onChange={this.onTypeAheadUtdanningChange}
                                        label=""
                                        name="utdanning"
                                        placeholder="Skriv inn fagfelt"
                                        suggestions={this.props.typeAheadSuggestionsUtdanning}
                                        value={this.state.typeAheadValue}
                                        id="yrke"
                                        onSubmit={this.onSubmit}
                                        onTypeAheadBlur={this.onTypeAheadBlur}
                                    />
                                </form>
                            </div>
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp"
                            >
                                +Legg til fagfelt
                            </Knapp>
                        )}
                        {this.props.utdanninger.map((utdanning) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={utdanning}
                                value={utdanning}
                            >
                                {utdanning}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

UtdanningSearch.defaultProps = {
    visManglendeArbeidserfaringBoks: false
};

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeUtdanning: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    checkUtdanningsniva: PropTypes.func.isRequired,
    uncheckUtdanningsniva: PropTypes.func.isRequired,
    utdanninger: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsUtdanning: PropTypes.arrayOf(PropTypes.string).isRequired,
    utdanningsniva: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadUtdanning: PropTypes.func.isRequired,
    visManglendeArbeidserfaringBoks: PropTypes.bool
};

const mapStateToProps = (state) => ({
    utdanninger: state.utdanning.utdanninger,
    typeAheadSuggestionsUtdanning: state.typeahead.suggestionsutdanning,
    utdanningsniva: state.utdanning.utdanningsniva,
    visManglendeArbeidserfaringBoks: state.search.featureToggles['vis-manglende-arbeidserfaring-boks']
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    clearTypeAheadUtdanning: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'utdanning', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_UTDANNING, value }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value }),
    checkUtdanningsniva: (value) => dispatch({ type: CHECK_UTDANNINGSNIVA, value }),
    uncheckUtdanningsniva: (value) => dispatch({ type: UNCHECK_UTDANNINGSNIVA, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
