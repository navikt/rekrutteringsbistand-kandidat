import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel, Element } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../../common/typeahead/typeaheadReducer';
import { SELECT_TYPE_AHEAD_VALUE_SPRAK, REMOVE_SELECTED_SPRAK } from './sprakReducer';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE } from '../../konstanter';
import './Sprak.less';

class SprakSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadSprakChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadSprakSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadSprak('suggestionssprak');
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
        this.props.removeSprak(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadSprak('suggestionssprak');
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        return (
            <div>
                <Systemtittel>Språk</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <Element>Krav til språk i jobbsituasjon</Element>
                    <div className="sokekriterier--kriterier">
                        <div className="sokefelt--wrapper--sprak">
                            {this.state.showTypeAhead ? (
                                <Typeahead
                                    ref={(typeAhead) => {
                                        this.typeAhead = typeAhead;
                                    }}
                                    onSelect={this.onTypeAheadSprakSelect}
                                    onChange={this.onTypeAheadSprakChange}
                                    label=""
                                    name="utdanning"
                                    placeholder="Skriv inn språk"
                                    suggestions={this.props.typeAheadSuggestionsSprak}
                                    value={this.state.typeAheadValue}
                                    id="yrke"
                                    onSubmit={this.onSubmit}
                                    onTypeAheadBlur={this.onTypeAheadBlur}
                                />
                            ) : (
                                <Knapp
                                    onClick={this.onLeggTilClick}
                                    className="leggtil--sokekriterier--knapp"
                                    id="leggtil-fagfelt-knapp"
                                >
                                    +Legg til språk
                                </Knapp>
                            )}
                        </div>
                        {this.props.sprak.map((sprak) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={sprak}
                                value={sprak}
                            >
                                {sprak}
                            </button>
                        ))}
                    </div>
                    {this.props.totaltAntallTreff <= 10 && !this.props.isSearching
                    && this.props.visAlertFaKandidater === ALERTTYPE.SPRAK && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
                </div>
            </div>
        );
    }
}

SprakSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSprak: PropTypes.func.isRequired,
    sprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    isSearching: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.search.isSearching,
    sprak: state.sprakReducer.sprak,
    typeAheadSuggestionsSprak: state.typeahead.suggestionssprak,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.SPRAK }),
    clearTypeAheadSprak: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'sprak', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(SprakSearch);
