import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavkontorSearchFelles from '../../../felles/sok/navkontor/NavkontorSearch';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import { SEARCH } from '../searchReducer';
import {
    REMOVE_SELECTED_NAVKONTOR,
    SELECT_TYPE_AHEAD_VALUE_NAVKONTOR,
    TOGGLE_MINEKANDIDATER,
    TOGGLE_NAVKONTOR_PANEL_OPEN,
} from './navkontorReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';

const NavkontorSearch = ({ ...props }) => {
    const {
        search,
        removeNavkontor,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        clearTypeAheadNavkontor,
        navkontor,
        typeAheadSuggestionsNavkontor,
        totaltAntallTreff,
        visAlertFaKandidater,
        skjulNavkontor,
        panelOpen,
        togglePanelOpen,
        toggleMinekandidater,
        minekandidater,
    } = props;
    return (
        <NavkontorSearchFelles
            search={search}
            removeNavkontor={removeNavkontor}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            clearTypeAheadNavkontor={clearTypeAheadNavkontor}
            navkontor={navkontor}
            typeAheadSuggestionsNavkontor={typeAheadSuggestionsNavkontor}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulNavkontor={skjulNavkontor}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
            minekandidater={minekandidater}
            toggleMinekandidater={toggleMinekandidater}
            showMineKandidater
        />
    );
};

NavkontorSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeNavkontor: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadNavkontor: PropTypes.func.isRequired,
    navkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsNavkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulNavkontor: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    minekandidater: PropTypes.bool.isRequired,
    toggleMinekandidater: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    navkontor: state.navkontorReducer.navkontor,
    typeAheadSuggestionsNavkontor: state.typeahead.navkontor.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulNavkontor: state.search.featureToggles['skjul-navkontor'],
    panelOpen: state.navkontorReducer.navkontorPanelOpen,
    minekandidater: state.navkontorReducer.minekandidater,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.NAVKONTOR }),
    clearTypeAheadNavkontor: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.NAVKONTOR }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.NAVKONTOR, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_NAVKONTOR, value }),
    removeNavkontor: (value) => dispatch({ type: REMOVE_SELECTED_NAVKONTOR, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_NAVKONTOR_PANEL_OPEN }),
    toggleMinekandidater: () => dispatch({ type: TOGGLE_MINEKANDIDATER }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavkontorSearch);
