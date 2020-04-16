import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_ARBEIDSERFARING,
    SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING,
    TOGGLE_ARBEIDSERFARING_PANEL_OPEN,
} from './arbeidserfaringReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import LeggtilKnapp from '../../../felles/common/leggtilKnapp/LeggtilKnapp';
import './Arbeidserfaring.less';
import AntallÅrArbeidserfaring from './antall-år-arbeidserfaring/AntallÅrArbeidserfaring';

interface Props {
    search: () => void;
    fetchTypeAheadSuggestions: (value: string) => void;
    selectTypeAheadValue: (value: string) => void;
    clearTypeAheadArbeidserfaring: () => void;
    removeArbeidserfaring: (erfaring: string) => void;
    skjulArbeidserfaring: boolean;
    togglePanelOpen: () => void;
    panelOpen: boolean;
    typeAheadSuggestionsArbeidserfaring: string[];
    arbeidserfaringer: string[];
    totaltAntallTreff: number;
    visAlertFaKandidater: string;
}

interface State {
    showTypeAhead: boolean;
    typeAheadValue: string;
}

class ArbeidserfaringSearch extends React.Component<Props, State> {
    typeAhead: any = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
        };
    }

    onTypeAheadArbeidserfaringChange = (value: string) => {
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

    onFjernClick = (erfaring: string) => {
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
                    <AntallÅrArbeidserfaring />
                </div>
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.ARBEIDSERFARING && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
        );
    }
}

const mapStateToProps = state => ({
    arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
    typeAheadSuggestionsArbeidserfaring: state.typeahead.arbeidserfaring.suggestions,
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
    togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
