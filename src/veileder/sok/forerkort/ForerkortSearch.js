import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ForerkortSearchFelles from '../../../felles/sok/forerkort/ForerkortSearch';
import { SEARCH } from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_FORERKORT,
    SELECT_TYPE_AHEAD_VALUE_FORERKORT,
    TOGGLE_FORERKORT_PANEL_OPEN
} from './forerkortReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';


const ForerkortSearch = ({ ...props }) => {
    const { search, removeForerkort, fetchTypeAheadSuggestionsForerkort, selectTypeAheadValueForerkort,
        forerkortList, typeAheadSuggestionsForerkort, clearTypeAheadForerkort, totaltAntallTreff,
        visAlertFaKandidater, panelOpen, togglePanelOpen } = props;
    return (
        <ForerkortSearchFelles
            search={search}
            removeForerkort={removeForerkort}
            fetchTypeAheadSuggestionsForerkort={fetchTypeAheadSuggestionsForerkort}
            selectTypeAheadValueForerkort={selectTypeAheadValueForerkort}
            forerkortList={forerkortList}
            typeAheadSuggestionsForerkort={typeAheadSuggestionsForerkort}
            clearTypeAheadForerkort={clearTypeAheadForerkort}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

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
