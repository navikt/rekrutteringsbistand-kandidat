import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    CHECK_TOTAL_HOVEDMAL,
    UNCHECK_TOTAL_HOVEDMAL,
    TOGGLE_HOVEDMAL_PANEL_OPEN,
} from './hovedmalReducer';
import { ALERTTYPE } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Checkbox } from 'nav-frontend-skjema';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import './Hovedmal.less';

const HovedmalEnum = {
    SKAFFE_ARBEID: 'SKAFFEA',
    BEHOLDE_ARBEID: 'BEHOLDEA',
    OKE_DELTAKELSE: 'OKEDELT',
};

const HovedmalSearch = ({ ...props }) => {
    const {
        search,
        checkHovedmal,
        uncheckHovedmal,
        totaltHovedmal,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;

    const hovedmal = [
        { label: 'Skaffe arbeid', value: HovedmalEnum.SKAFFE_ARBEID },
        { label: 'Beholde arbeid', value: HovedmalEnum.BEHOLDE_ARBEID },
        { label: 'Øke deltakelse', value: HovedmalEnum.OKE_DELTAKELSE },
    ];

    const onTotalHovedmalChange = (e) => {
        if (e.target.checked) {
            checkHovedmal(e.target.value);
        } else {
            uncheckHovedmal(e.target.value);
        }
        search();
    };

    return (
        <SokekriteriePanel
            id="Hovedmaal__SokekriteriePanel"
            fane="hovedmål"
            tittel="Hovedmål"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <div>
                {hovedmal.map((h) => (
                    <Checkbox
                        className="checkbox--hovedmal"
                        id={`hovedmal-${h.value.toLowerCase()}-checkbox`}
                        label={h.label}
                        key={h.value}
                        value={h.value}
                        checked={totaltHovedmal.includes(h.value)}
                        onChange={onTotalHovedmalChange}
                    />
                ))}
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.HOVEDMAL && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

HovedmalSearch.propTypes = {
    search: PropTypes.func.isRequired,
    checkHovedmal: PropTypes.func.isRequired,
    uncheckHovedmal: PropTypes.func.isRequired,
    totaltHovedmal: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    totaltHovedmal: state.søkefilter.hovedmal.totaltHovedmal,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.hovedmal.panelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.HOVEDMAL }),
    checkHovedmal: (value) => dispatch({ type: CHECK_TOTAL_HOVEDMAL, value }),
    uncheckHovedmal: (value) => dispatch({ type: UNCHECK_TOTAL_HOVEDMAL, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_HOVEDMAL_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HovedmalSearch);
