import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KompetanseSearchFelles from '../../../felles/sok/kompetanse/KompetanseSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_KOMPETANSE,
    SELECT_TYPE_AHEAD_VALUE_KOMPETANSE,
    TOGGLE_KOMPETANSE_PANEL_OPEN,
} from './kompetanseReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const KompetanseSearch = ({ ...props }) => {
    const {
        search,
        removeKompetanse,
        fetchTypeAheadSuggestionsKompetanse,
        selectTypeAheadValueKompetanse,
        kompetanser,
        kompetanseSuggestions,
        typeAheadSuggestionsKompetanse,
        clearTypeAheadKompetanse,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;
    return (
        <KompetanseSearchFelles
            search={search}
            removeKompetanse={removeKompetanse}
            fetchTypeAheadSuggestionsKompetanse={fetchTypeAheadSuggestionsKompetanse}
            selectTypeAheadValueKompetanse={selectTypeAheadValueKompetanse}
            kompetanser={kompetanser}
            kompetanseSuggestions={kompetanseSuggestions}
            typeAheadSuggestionsKompetanse={typeAheadSuggestionsKompetanse}
            clearTypeAheadKompetanse={clearTypeAheadKompetanse}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
            allowOnlyTypeaheadSuggestions
        />
    );
};

KompetanseSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeKompetanse: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsKompetanse: PropTypes.func.isRequired,
    selectTypeAheadValueKompetanse: PropTypes.func.isRequired,
    kompetanser: PropTypes.arrayOf(PropTypes.string).isRequired,
    kompetanseSuggestions: PropTypes.arrayOf(
        PropTypes.shape({
            feltnavn: PropTypes.string,
            antall: PropTypes.number,
            subfelt: PropTypes.array,
        })
    ).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadKompetanse: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    kompetanser: state.kompetanse.kompetanser,
    kompetanseSuggestions: state.search.searchResultat.kompetanseSuggestions,
    typeAheadSuggestionsKompetanse: state.typeahead.kompetanse.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.kompetanse.kompetansePanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.KOMPETANSE }),
    clearTypeAheadKompetanse: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE }),
    fetchTypeAheadSuggestionsKompetanse: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE, value }),
    selectTypeAheadValueKompetanse: (value) =>
        dispatch({ type: SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, value }),
    removeKompetanse: (value) => dispatch({ type: REMOVE_SELECTED_KOMPETANSE, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_KOMPETANSE_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
