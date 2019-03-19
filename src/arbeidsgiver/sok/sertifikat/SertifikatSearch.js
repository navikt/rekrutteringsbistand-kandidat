import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SertifikatSearchFelles from '../../../felles/sok/sertifikat/SertifikatSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../../common/typeahead/typeaheadReducer';
import {
    SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT,
    REMOVE_SELECTED_SERTIFIKAT,
    TOGGLE_SERTIFIKAT_PANEL_OPEN
} from './sertifikatReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const SertifikatSearch = ({ ...props }) => {
    const { search, removeSertifikat, fetchTypeAheadSuggestions, selectTypeAheadValue, clearTypeAheadSertifikat, sertifikat,
        typeAheadSuggestionsSertifikat, totaltAntallTreff, visAlertFaKandidater, skjulSertifikat, panelOpen, togglePanelOpen } = props;
    return (
        <SertifikatSearchFelles
            search={search}
            removeSertifikat={removeSertifikat}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            clearTypeAheadSertifikat={clearTypeAheadSertifikat}
            sertifikat={sertifikat}
            typeAheadSuggestionsSertifikat={typeAheadSuggestionsSertifikat}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulSertifikat={skjulSertifikat}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

SertifikatSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSertifikat: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSertifikat: PropTypes.func.isRequired,
    sertifikat: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSertifikat: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSertifikat: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    sertifikat: state.sertifikatReducer.sertifikat,
    typeAheadSuggestionsSertifikat: state.typeahead.sertifikat.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulSertifikat: false,
    panelOpen: state.sertifikatReducer.sertifikatPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.SERTIFIKAT }),
    clearTypeAheadSertifikat: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SERTIFIKAT }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SERTIFIKAT, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT, value }),
    removeSertifikat: (value) => dispatch({ type: REMOVE_SELECTED_SERTIFIKAT, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_SERTIFIKAT_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(SertifikatSearch);
