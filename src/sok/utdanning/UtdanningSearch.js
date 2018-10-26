import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    CHECK_UTDANNINGSNIVA,
    REMOVE_SELECTED_UTDANNING,
    SELECT_TYPE_AHEAD_VALUE_UTDANNING,
    UNCHECK_UTDANNINGSNIVA,
    TOGGLE_UTDANNING_PANEL_OPEN
} from './utdanningReducer';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE, BRANCHNAVN, UTDANNING } from '../../konstanter';
import './Utdanning.less';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.utdanningsnivaKategorier = Object.keys(UTDANNING).map((key) => UTDANNING[key]);
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
            this.props.clearTypeAheadUtdanning();
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
        this.props.removeUtdanning(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadUtdanning();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulUtdanning) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Utdanning"
                tittelProps="undertittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}

            >
                <SkjemaGruppe title="Velg et eller flere utdanningsnivå">
                    <div className="sokekriterier--kriterier sokekriterier--margin-top-large">
                        {this.utdanningsnivaKategorier.map((utdanning) => (
                            <Checkbox
                                id={`utdanningsniva-${utdanning.key.toLowerCase()}-checkbox`}
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
                <Element className="sokekriterier--margin-top-extra-large">I hvilket fagfelt skal kandidaten ha utdanning?</Element>
                <Normaltekst className="text--italic">
                    For eksempel pedagogikk
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
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
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-fagfelt-knapp"
                                mini
                            >
                                +Legg til fagfelt
                            </Knapp>
                        )}
                    </div>
                    {this.props.utdanninger.map((utdanning) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={utdanning}
                            value={utdanning}
                        >
                            {utdanning}
                        </button>
                    ))}{this.props.visIngenUtdanning && (
                        <div className="Checkbox--ingen-utdanning">
                            <Checkbox
                                id={'utdanningsniva-ingen-utdanning-checkbox'}
                                className={this.props.utdanningsniva.includes('Ingen') ?
                                    'checkbox--checked' :
                                    'checkbox--unchecked'}
                                label="Jeg ønsker treff på kandidater som ikke har utdanning"
                                key="Ingen"
                                value="Ingen"
                                checked={this.props.utdanningsniva.includes('Ingen')}
                                onChange={this.onUtdanningsnivaChange}
                            />
                        </div>
                    )
                    }
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.UTDANNING && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
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
    visManglendeArbeidserfaringBoks: PropTypes.bool,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulUtdanning: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    visIngenUtdanning: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    utdanninger: state.utdanning.utdanninger,
    typeAheadSuggestionsUtdanning: state.typeahead.utdanning.suggestions,
    utdanningsniva: state.utdanning.utdanningsniva,
    visManglendeArbeidserfaringBoks: state.search.featureToggles['vis-manglende-arbeidserfaring-boks'],
    skjulUtdanning: state.search.featureToggles['skjul-utdanning'],
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.utdanning.utdanningPanelOpen,
    visIngenUtdanning: state.search.featureToggles['ingen-utdanning-filter']
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.UTDANNING }),
    clearTypeAheadUtdanning: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.UTDANNING }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.UTDANNING, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_UTDANNING, value }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value }),
    checkUtdanningsniva: (value) => dispatch({ type: CHECK_UTDANNINGSNIVA, value }),
    uncheckUtdanningsniva: (value) => dispatch({ type: UNCHECK_UTDANNINGSNIVA, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_UTDANNING_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
