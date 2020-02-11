import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GeografiSearchFelles from '../../../felles/sok/geografi/GeografiSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_GEOGRAFI,
    SELECT_TYPE_AHEAD_VALUE_GEOGRAFI,
    TOGGLE_GEOGRAFI_PANEL_OPEN,
    TOGGLE_MA_BO_INNENFOR_GEOGRAFI,
} from './geografiReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const GeografiSearch = ({ ...props }) => {
    const {
        geografiListKomplett,
        typeAheadSuggestionsGeografi,
        typeAheadSuggestionsGeografiKomplett,
        totaltAntallTreff,
        visAlertFaKandidater,
        skjulSted,
        panelOpen,
        maaBoInnenforGeografi,
        search,
        removeGeografi,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        clearTypeAheadGeografi,
        togglePanelOpen,
        toggleMaBoPaGeografi,
        stillingsId,
    } = props;
    return (
        <GeografiSearchFelles
            geografiListKomplett={geografiListKomplett}
            typeAheadSuggestionsGeografi={typeAheadSuggestionsGeografi}
            typeAheadSuggestionsGeografiKomplett={typeAheadSuggestionsGeografiKomplett}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulSted={skjulSted}
            panelOpen={panelOpen}
            maaBoInnenforGeografi={maaBoInnenforGeografi}
            search={search}
            removeGeografi={removeGeografi}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            clearTypeAheadGeografi={clearTypeAheadGeografi}
            togglePanelOpen={togglePanelOpen}
            toggleMaBoPaGeografi={toggleMaBoPaGeografi}
            stillingsId={stillingsId}
        />
    );
};

GeografiSearch.defaultProps = {
    panelOpen: undefined,
    stillingsId: undefined,
};

GeografiSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeGeografi: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    geografiListKomplett: PropTypes.arrayOf(
        PropTypes.shape({
            geografiKodeTekst: PropTypes.string,
            geografiKode: PropTypes.string,
        })
    ).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsGeografiKomplett: PropTypes.arrayOf(
        PropTypes.shape({
            geografiKodeTekst: PropTypes.string,
            geografiKode: PropTypes.string,
        })
    ).isRequired,
    clearTypeAheadGeografi: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSted: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool,
    togglePanelOpen: PropTypes.func.isRequired,
    maaBoInnenforGeografi: PropTypes.bool.isRequired,
    toggleMaBoPaGeografi: PropTypes.func.isRequired,
    stillingsId: PropTypes.string,
};

const mapStateToProps = state => ({
    geografiListKomplett: state.geografi.geografiListKomplett,
    typeAheadSuggestionsGeografi: state.typeahead.geografi.suggestions,
    typeAheadSuggestionsGeografiKomplett: state.typeahead.geografiKomplett.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulSted: state.search.featureToggles['skjul-sted'],
    panelOpen: state.geografi.geografiPanelOpen,
    maaBoInnenforGeografi: state.geografi.maaBoInnenforGeografi,
});

const mapDispatchToProps = dispatch => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.GEOGRAFI }),
    clearTypeAheadGeografi: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.GEOGRAFI }),
    fetchTypeAheadSuggestions: value =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.GEOGRAFI, value }),
    selectTypeAheadValue: value => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, value }),
    removeGeografi: value => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_GEOGRAFI_PANEL_OPEN }),
    toggleMaBoPaGeografi: () => dispatch({ type: TOGGLE_MA_BO_INNENFOR_GEOGRAFI }),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeografiSearch);
