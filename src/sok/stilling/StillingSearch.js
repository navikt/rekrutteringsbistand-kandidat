import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    FETCH_KOMPETANSE_SUGGESTIONS,
    SEARCH
} from '../searchReducer';
import { REMOVE_SELECTED_STILLING, SELECT_TYPE_AHEAD_VALUE_STILLING } from './stillingReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE } from '../../konstanter';
import './Stilling.less';

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
            this.props.clearTypeAheadStilling('suggestionsstilling');
            this.setState({
                typeAheadValue: ''
            });
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

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadStilling('suggestionsstilling');
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadStillingSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        return (
            <div>
                <Systemtittel>Stilling/yrke</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Hvilken stilling/yrke trenger du en kandidat til?
                    </Element>
                    <Normaltekst className="text--italic">
                        For eksempel pedagogisk leder
                    </Normaltekst>
                    <div className="sokekriterier--kriterier">
                        <div className="sokefelt--wrapper--stilling">
                            {this.state.showTypeAhead ? (
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
                                    id="typeahead-stilling"
                                    onSubmit={this.onSubmit}
                                    onTypeAheadBlur={this.onTypeAheadBlur}
                                />
                            ) : (
                                <Knapp
                                    onClick={this.onLeggTilClick}
                                    className="leggtil--sokekriterier--knapp"
                                    id="leggtil-stilling-knapp"
                                >
                                    +Legg til stilling
                                </Knapp>
                            )}
                        </div>
                        {this.props.stillinger.map((stilling) => (
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
                    {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.STILLING && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
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
    stillinger: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsStilling: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadStilling: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    stillinger: state.stilling.stillinger,
    typeAheadSuggestionsStilling: state.typeahead.suggestionsstilling,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.STILLING }),
    clearTypeAheadStilling: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'stilling', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_STILLING, value }),
    removeStilling: (value) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    fetchKompetanseSuggestions: () => dispatch({ type: FETCH_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingSearch);
