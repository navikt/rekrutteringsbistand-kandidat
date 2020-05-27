import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UtdanningSearchFelles from '../../../felles/sok/utdanning/UtdanningSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import {
    CHECK_UTDANNINGSNIVA,
    REMOVE_SELECTED_UTDANNING,
    SELECT_TYPE_AHEAD_VALUE_UTDANNING,
    UNCHECK_UTDANNINGSNIVA,
    TOGGLE_UTDANNING_PANEL_OPEN,
} from './utdanningReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const UtdanningSearch = ({ ...props }) => {
    const {
        search,
        removeUtdanning,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        checkUtdanningsniva,
        uncheckUtdanningsniva,
        utdanninger,
        typeAheadSuggestionsUtdanning,
        utdanningsniva,
        clearTypeAheadUtdanning,
        totaltAntallTreff,
        visAlertFaKandidater,
        skjulUtdanning,
        panelOpen,
        togglePanelOpen,
        visIngenUtdanning,
    } = props;
    return (
        <UtdanningSearchFelles
            search={search}
            removeUtdanning={removeUtdanning}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            checkUtdanningsniva={checkUtdanningsniva}
            uncheckUtdanningsniva={uncheckUtdanningsniva}
            utdanninger={utdanninger}
            typeAheadSuggestionsUtdanning={typeAheadSuggestionsUtdanning}
            utdanningsniva={utdanningsniva}
            clearTypeAheadUtdanning={clearTypeAheadUtdanning}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulUtdanning={skjulUtdanning}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
            visIngenUtdanning={visIngenUtdanning}
        />
    );
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
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulUtdanning: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    visIngenUtdanning: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    utdanninger: state.utdanning.utdanninger,
    typeAheadSuggestionsUtdanning: state.typeahead.utdanning.suggestions,
    utdanningsniva: state.utdanning.utdanningsniva,
    skjulUtdanning: state.search.featureToggles['skjul-utdanning'],
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.utdanning.utdanningPanelOpen,
    visIngenUtdanning: state.search.featureToggles['ingen-utdanning-filter'],
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.UTDANNING }),
    clearTypeAheadUtdanning: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.UTDANNING }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.UTDANNING, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_UTDANNING, value }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value }),
    checkUtdanningsniva: (value) => dispatch({ type: CHECK_UTDANNINGSNIVA, value }),
    uncheckUtdanningsniva: (value) => dispatch({ type: UNCHECK_UTDANNINGSNIVA, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_UTDANNING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
