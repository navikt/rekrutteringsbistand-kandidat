import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_ARBEIDSERFARING,
    SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING,
    CHECK_TOTAL_ERFARING,
    UNCHECK_TOTAL_ERFARING,
    TOGGLE_ARBEIDSERFARING_PANEL_OPEN,
} from './arbeidserfaringReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import LeggtilKnapp from '../../../felles/common/leggtilKnapp/LeggtilKnapp';
import { Merkelapp } from 'pam-frontend-merkelapper';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';

import './Arbeidserfaring.less';

const aarMedErfaringer = [
    { label: 'Under 1 år', value: '0-11' },
    { label: '1-3 år', value: '12-47' },
    { label: '4-9 år', value: '48-119' },
    { label: 'Over 10 år', value: '120-' },
];

class ArbeidserfaringSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
        };
    }

    onTotalErfaringChange = e => {
        if (e.target.checked) {
            this.props.checkTotalErfaring(e.target.value);
        } else {
            this.props.uncheckTotalErfaring(e.target.value);
        }
        this.props.search();
    };

    onTypeAheadArbeidserfaringChange = value => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value,
        });
    };

    onTypeAheadArbeidserfaringSelect = value => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadArbeidserfaring();
            this.setState({
                typeAheadValue: '',
            });
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState(
            {
                showTypeAhead: true,
            },
            () => this.typeAhead.input.focus()
        );
    };

    onFjernClick = erfaring => {
        this.props.removeArbeidserfaring(erfaring);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false,
        });
        this.props.clearTypeAheadArbeidserfaring();
    };

    onSubmit = e => {
        e.preventDefault();
        this.onTypeAheadArbeidserfaringSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    renderTotalErfaring = () => (
        <SkjemaGruppe
            className="ar-med-arbeidserfaring__header"
            title="Totalt antall år med arbeidserfaring"
        >
            <Normaltekst>Velg en eller flere</Normaltekst>
            <div className="sokekriterier--kriterier">
                {aarMedErfaringer.map(arbeidserfaring => (
                    <Checkbox
                        className="checkbox--arbeidserfaring skjemaelement--pink"
                        id={`arbeidserfaring-${arbeidserfaring.value.toLowerCase()}-checkbox`}
                        label={arbeidserfaring.label}
                        key={arbeidserfaring.value}
                        value={arbeidserfaring.value}
                        checked={this.props.totalErfaring.includes(arbeidserfaring.value)}
                        onChange={this.onTotalErfaringChange}
                    />
                ))}
            </div>
        </SkjemaGruppe>
    );

    render() {
        if (this.props.skjulArbeidserfaring) {
            return null;
        }

        return (
            <SokekriteriePanel
                id="ArbeidserfaringSearch__SokekriteriePanel"
                tittel="Arbeidserfaring"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Hvilken erfaring skal kandidaten ha?</Element>
                <Normaltekst>For eksempel: barnehagelærer</Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={typeAhead => {
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
                        ) : (
                            <LeggtilKnapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-arbeidserfaring-knapp"
                                mini
                            >
                                +Legg til arbeidserfaring
                            </LeggtilKnapp>
                        )}
                    </div>
                    <div className="Merkelapp__wrapper">
                        {this.props.arbeidserfaringer.map(arbeidserfaring => (
                            <Merkelapp
                                onRemove={this.onFjernClick}
                                key={arbeidserfaring}
                                value={arbeidserfaring}
                            >
                                {arbeidserfaring}
                            </Merkelapp>
                        ))}
                    </div>
                </div>
                <div className="sokekriterier--margin-top-extra-large">
                    {this.renderTotalErfaring()}
                </div>
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.ARBEIDSERFARING && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
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
    clearTypeAheadArbeidserfaring: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulArbeidserfaring: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
    typeAheadSuggestionsArbeidserfaring: state.typeahead.arbeidserfaring.suggestions,
    totalErfaring: state.arbeidserfaring.totalErfaring,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulArbeidserfaring: state.search.featureToggles['skjul-arbeidserfaring'],
    panelOpen: state.arbeidserfaring.arbeidserfaringPanelOpen,
});

const mapDispatchToProps = dispatch => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.ARBEIDSERFARING }),
    clearTypeAheadArbeidserfaring: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING }),
    fetchTypeAheadSuggestions: value =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING, value }),
    selectTypeAheadValue: value =>
        dispatch({ type: SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, value }),
    removeArbeidserfaring: value => dispatch({ type: REMOVE_SELECTED_ARBEIDSERFARING, value }),
    checkTotalErfaring: value => dispatch({ type: CHECK_TOTAL_ERFARING, value }),
    uncheckTotalErfaring: value => dispatch({ type: UNCHECK_TOTAL_ERFARING, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
