import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArbeidserfaringSearchFelles from '../../../felles/sok/arbeidserfaring/ArbeidserfaringSearch';
import { SEARCH } from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_ARBEIDSERFARING,
    SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING,
    CHECK_TOTAL_ERFARING,
    UNCHECK_TOTAL_ERFARING,
    TOGGLE_ARBEIDSERFARING_PANEL_OPEN
} from './arbeidserfaringReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import { USE_JANZZ } from '../../common/fasitProperties';

const ArbeidserfaringSearch = ({ ...props }) => {
    const { search, removeArbeidserfaring, fetchTypeAheadSuggestions, selectTypeAheadValue, checkTotalErfaring,
        uncheckTotalErfaring, arbeidserfaringer, typeAheadSuggestionsArbeidserfaring, totalErfaring,
        clearTypeAheadArbeidserfaring, totaltAntallTreff, visAlertFaKandidater, skjulArbeidserfaring,
        panelOpen, togglePanelOpen } = props;
    return (
        <ArbeidserfaringSearchFelles
            search={search}
            removeArbeidserfaring={removeArbeidserfaring}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            checkTotalErfaring={checkTotalErfaring}
            uncheckTotalErfaring={uncheckTotalErfaring}
            arbeidserfaringer={arbeidserfaringer}
            typeAheadSuggestionsArbeidserfaring={typeAheadSuggestionsArbeidserfaring}
            totalErfaring={totalErfaring}
            clearTypeAheadArbeidserfaring={clearTypeAheadArbeidserfaring}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulArbeidserfaring={skjulArbeidserfaring}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
            useJanzz={USE_JANZZ}
        />
    );
};

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
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
    typeAheadSuggestionsArbeidserfaring: state.typeahead.arbeidserfaring.suggestions,
    totalErfaring: state.arbeidserfaring.totalErfaring,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulArbeidserfaring: state.search.featureToggles['skjul-arbeidserfaring'],
    panelOpen: state.arbeidserfaring.arbeidserfaringPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.ARBEIDSERFARING }),
    clearTypeAheadArbeidserfaring: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, value }),
    removeArbeidserfaring: (value) => dispatch({ type: REMOVE_SELECTED_ARBEIDSERFARING, value }),
    checkTotalErfaring: (value) => dispatch({ type: CHECK_TOTAL_ERFARING, value }),
    uncheckTotalErfaring: (value) => dispatch({ type: UNCHECK_TOTAL_ERFARING, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
