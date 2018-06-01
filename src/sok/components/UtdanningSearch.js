import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { CHECK_UTDANNINGSNIVA, FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_UTDANNING, SEARCH, SELECT_TYPE_AHEAD_VALUE_UTDANNING, UNCHECK_UTDANNINGSNIVA } from '../domene';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.utdanningsnivaKategorier = [{ key: 'Ingen', label: 'Ingen utdanning' },
            { key: 'Grunnskole', label: 'Grunnskole' }, { key: 'Videregaende', label: 'Videregående' },
            { key: 'Fagskole', label: 'Fagskole' }, { key: 'Bachelor', label: 'Bachelorgrad' },
            { key: 'Master', label: 'Mastergrad' }, { key: 'Doktorgrad', label: 'Doktorgrad' }];
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
        this.props.removeUtdanning(e.target.value);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <div>
                <Undertittel>Utdanning</Undertittel>
                <div className="panel panel--sokekriterier">
                    <SkjemaGruppe title="Utdanningsnivå">
                        <div className="sokekriterier--kriterier">
                            {this.utdanningsnivaKategorier.map((utdanning) => (
                                <Checkbox
                                    className={this.props.utdanningsniva.includes(utdanning.key) ? 'checkbox--sokekriterier--checked' : 'checkbox--sokekriterier--unchecked'}
                                    label={utdanning.label}
                                    key={utdanning.key}
                                    value={utdanning.key}
                                    checked={this.props.utdanningsniva.includes(utdanning.key)}
                                    onChange={this.onUtdanningsnivaChange}
                                />
                            ))}
                        </div>
                    </SkjemaGruppe>
                    <Checkbox
                        label="Arbeidserfaring kan veie opp for manglende utdanning"
                        className="checkbox--manglende--arbeidserfaring"
                    />
                    <Element>I hvilket fagfelt skal kandidaten ha utdanning</Element>
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
                    </div>
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
    checkUtdanningsniva: PropTypes.func.isRequired,
    uncheckUtdanningsniva: PropTypes.func.isRequired,
    query: PropTypes.shape({
        utdanning: PropTypes.string,
        utdanninger: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsUtdanning: PropTypes.arrayOf(PropTypes.string).isRequired,
    utdanningsniva: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsUtdanning: state.typeAheadSuggestionsutdanning,
    utdanningsniva: state.query.utdanningsniva
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'utdanning', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_UTDANNING, value }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value }),
    checkUtdanningsniva: (value) => dispatch({ type: CHECK_UTDANNINGSNIVA, value }),
    uncheckUtdanningsniva: (value) => dispatch({ type: UNCHECK_UTDANNINGSNIVA, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
