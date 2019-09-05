import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HovedmalSearchFelles from '../../../felles/sok/hovedmal/HovedmalSearch';
import { SEARCH } from '../searchReducer';
import {
    CHECK_TOTAL_HOVEDMAL,
    UNCHECK_TOTAL_HOVEDMAL,
    TOGGLE_HOVEDMAL_PANEL_OPEN
} from './hovedmalReducer';
import { ALERTTYPE } from '../../../felles/konstanter';

const HovedmalSearch = ({ ...props }) => {
    const {
        search, checkHovedmal, uncheckHovedmal, totaltHovedmal,
        totaltAntallTreff, visAlertFaKandidater, skjulHovedmal,
        panelOpen, togglePanelOpen
    } = props;

    return (
        <HovedmalSearchFelles
            search={search}
            checkHovedmal={checkHovedmal}
            uncheckHovedmal={uncheckHovedmal}
            totaltHovedmal={totaltHovedmal}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulHovedmal={skjulHovedmal}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

HovedmalSearch.propTypes = {
    search: PropTypes.func.isRequired,
    checkHovedmal: PropTypes.func.isRequired,
    uncheckHovedmal: PropTypes.func.isRequired,
    totaltHovedmal: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulHovedmal: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    totaltHovedmal: state.hovedmal.totaltHovedmal,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    skjulHovedmal: state.search.featureToggles['skjul-hovedmal'],
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.hovedmal.panelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.HOVEDMAL }),
    checkHovedmal: (value) => dispatch({ type: CHECK_TOTAL_HOVEDMAL, value }),
    uncheckHovedmal: (value) => dispatch({ type: UNCHECK_TOTAL_HOVEDMAL, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_HOVEDMAL_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(HovedmalSearch);
