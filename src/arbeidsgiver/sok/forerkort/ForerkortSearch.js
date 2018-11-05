import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    SEARCH
} from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_FORERKORT,
    SELECT_TYPE_AHEAD_VALUE_FORERKORT,
    TOGGLE_FORERKORT_PANEL_OPEN
} from './forerkortReducer';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import './Forerkort.less';
import alleForerkort from './forerkort';


const forerkortHeading = (
    <div className="heading--forerkort ekspanderbartPanel__heading">
        <Undertittel>Førerkort</Undertittel>
    </div>
);

const matcherLignendeTekst = (typeaheadVerdi, tekst) => {
    if (typeaheadVerdi === tekst) {
        return true;
    }
    const tV = typeaheadVerdi.includes('(') ? [...typeaheadVerdi.split('(').shift().split(/[:|;|.|,|\s]/).map((v) => v.split(''))].flatten() :
        [...typeaheadVerdi.split(/[:|;|.|,|\s]/).map((v) => v.split(''))].flatten();
    return JSON.stringify(tV) === JSON.stringify(tekst.split(/[:|;|.|,|\s]/).map((t) => t.split('')).flatten());
};

class ForerkortSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAheadForerkort: false,
            typeAheadValueForerkort: '',
            antallForerkort: 4,
            feil: false
        };
    }

    onTypeAheadForerkortChange = (value) => {
        this.props.fetchTypeAheadSuggestionsForerkort(value);
        this.setState({
            typeAheadValueForerkort: value,
            feil: false
        });
    };

    onTypeAheadForerkortSelect = (value) => {
        if (value !== '') {
            const forerkort = alleForerkort.find((fk) => matcherLignendeTekst(fk.toLowerCase(), value.toLowerCase()));
            if (forerkort !== undefined) {
                this.props.selectTypeAheadValueForerkort(forerkort);
                this.props.clearTypeAheadForerkort();
                this.setState({
                    typeAheadValueForerkort: ''
                });
                this.props.search();
                this.setState({
                    feil: false
                });
            } else {
                this.setState({
                    feil: true
                });
            }
        }
    };

    onLeggTilForerkortClick = () => {
        this.setState({
            showTypeAheadForerkort: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernForerkortClick = (e) => {
        this.props.removeForerkort(e.target.value);
        this.props.search();
    };

    onSubmitForerkort = (e) => {
        e.preventDefault();
        this.onTypeAheadForerkortSelect(this.state.typeAheadValueForerkort);
        this.typeAhead.input.focus();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValueForerkort: '',
            showTypeAheadForerkort: false,
            feil: false
        });
        this.props.clearTypeAheadForerkort();
    };

    render() {
        return (
            <EkspanderbartpanelBase
                heading={forerkortHeading}
                className="panel--sokekriterier"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
                ariaTittel="Panel førerkort"
            >
                <Normaltekst className="text--italic">
                    For eksempel: førerkort: kl. B
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAheadForerkort ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadForerkortSelect}
                                onChange={this.onTypeAheadForerkortChange}
                                label=""
                                name="forerkort"
                                placeholder="Skriv inn førerkort"
                                suggestions={this.props.typeAheadSuggestionsForerkort}
                                value={this.state.typeAheadValueForerkort}
                                id="typeahead-forerkort"
                                onSubmit={this.onSubmitForerkort}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilForerkortClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-forerkort-knapp"
                                mini
                            >
                                +Legg til førerkort
                            </Knapp>
                        )}
                        {this.state.feil &&
                        <Normaltekst className="skjemaelement__feilmelding">
                            Ordet du har skrevet inn gir ingen treff
                        </Normaltekst>
                        }
                    </div>
                    {this.props.forerkortList.map((forerkort) => (
                        <button
                            onClick={this.onFjernForerkortClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={forerkort}
                            value={forerkort}
                        >
                            {forerkort}
                        </button>
                    ))}
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.FORERKORT && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </EkspanderbartpanelBase>
        );
    }
}

ForerkortSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeForerkort: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsForerkort: PropTypes.func.isRequired,
    selectTypeAheadValueForerkort: PropTypes.func.isRequired,
    forerkortList: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsForerkort: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadForerkort: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    forerkortList: state.forerkort.forerkortList,
    typeAheadSuggestionsForerkort: state.typeahead.forerkort.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.forerkort.forerkortPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.FORERKORT }),
    clearTypeAheadForerkort: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.FORERKORT }),
    fetchTypeAheadSuggestionsForerkort: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.FORERKORT, value }),
    selectTypeAheadValueForerkort: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_FORERKORT, value }),
    removeForerkort: (value) => dispatch({ type: REMOVE_SELECTED_FORERKORT, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_FORERKORT_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(ForerkortSearch);
