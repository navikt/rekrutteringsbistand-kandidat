import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutorisasjonSearchFelles from '../../../felles/sok/autorisasjon/AutorisasjonSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../../common/typeahead/typeaheadReducer';
import {
    SELECT_TYPE_AHEAD_VALUE_AUTORISASJON,
    REMOVE_SELECTED_AUTORISASJON,
    TOGGLE_AUTORISASJON_PANEL_OPEN
} from './autorisasjonReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const AutorisasjonSearch = ({ ...props }) => {
    const { search, removeAutorisasjon, fetchTypeAheadSuggestions, selectTypeAheadValue, clearTypeAheadAutorisasjon, autorisasjon,
        typeAheadSuggestionsAutorisasjon, totaltAntallTreff, visAlertFaKandidater, skjulAutorisasjon, panelOpen, togglePanelOpen } = props;
    return (
        <AutorisasjonSearchFelles
            search={search}
            removeAutorisasjon={removeAutorisasjon}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            clearTypeAheadAutorisasjon={clearTypeAheadAutorisasjon}
            autorisasjon={autorisasjon}
            typeAheadSuggestionsAutorisasjon={typeAheadSuggestionsAutorisasjon}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulAutorisasjon={skjulAutorisasjon}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

AutorisasjonSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeAutorisasjon: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadAutorisasjon: PropTypes.func.isRequired,
    autorisasjon: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsAutorisasjon: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulAutorisasjon: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    autorisasjon: state.autorisasjonReducer.autorisasjon,
    typeAheadSuggestionsAutorisasjon: state.typeahead.autorisasjon.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulAutorisasjon: false,
    panelOpen: state.autorisasjonReducer.autorisasjonPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.AUTORISASJON }),
    clearTypeAheadAutorisasjon: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.AUTORISASJON }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.AUTORISASJON, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_AUTORISASJON, value }),
    removeAutorisasjon: (value) => dispatch({ type: REMOVE_SELECTED_AUTORISASJON, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_AUTORISASJON_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(AutorisasjonSearch);
