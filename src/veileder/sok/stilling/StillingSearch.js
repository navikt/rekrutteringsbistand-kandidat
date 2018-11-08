import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StillingSearchFelles from '../../../felles/sok/stilling/StillingSearch';
import {
    FETCH_KOMPETANSE_SUGGESTIONS,
    SEARCH
} from '../searchReducer';
import {
    REMOVE_SELECTED_STILLING,
    SELECT_TYPE_AHEAD_VALUE_STILLING,
    TOGGLE_STILLING_PANEL_OPEN
} from './stillingReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const StillingSearch = ({ ...props }) => {
    const { stillinger, typeAheadSuggestionsStilling, totaltAntallTreff, visAlertFaKandidater,
        skjulYrke, panelOpen, search, clearTypeAheadStilling, fetchTypeAheadSuggestions,
        selectTypeAheadValue, removeStilling, fetchKompetanseSuggestions, togglePanelOpen } = props;
    return (
        <StillingSearchFelles
            stillinger={stillinger}
            typeAheadSuggestionsStilling={typeAheadSuggestionsStilling}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulYrke={skjulYrke}
            panelOpen={panelOpen}
            search={search}
            clearTypeAheadStilling={clearTypeAheadStilling}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            removeStilling={removeStilling}
            fetchKompetanseSuggestions={fetchKompetanseSuggestions}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

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
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulYrke: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    stillinger: state.stilling.stillinger,
    typeAheadSuggestionsStilling: state.typeahead.stilling.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulYrke: state.search.featureToggles['skjul-yrke'],
    panelOpen: state.stilling.stillingPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.STILLING }),
    clearTypeAheadStilling: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.STILLING }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.STILLING, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_STILLING, value }),
    removeStilling: (value) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    fetchKompetanseSuggestions: () => dispatch({ type: FETCH_KOMPETANSE_SUGGESTIONS }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_STILLING_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingSearch);
