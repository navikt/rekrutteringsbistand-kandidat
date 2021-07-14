import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

import {
    CHECK_UTDANNINGSNIVA,
    REMOVE_SELECTED_UTDANNING,
    UNCHECK_UTDANNINGSNIVA,
    TOGGLE_UTDANNING_PANEL_OPEN,
} from './utdanningReducer';
import { ALERTTYPE, UTDANNING } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import './Utdanning.less';

const UtdanningSearch = ({ ...props }) => {
    const {
        search,
        checkUtdanningsniva,
        uncheckUtdanningsniva,
        utdanningsniva,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;

    const utdanningsnivaKategorier = Object.keys(UTDANNING).map((key) => UTDANNING[key]);

    const onUtdanningsnivaChange = (e) => {
        if (e.target.checked) {
            checkUtdanningsniva(e.target.value);
        } else {
            uncheckUtdanningsniva(e.target.value);
        }
        search();
    };

    return (
        <SokekriteriePanel
            id="Utdanning__SokekriteriePanel"
            fane="utdanning"
            tittel="Utdanningsnivå"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <SkjemaGruppe legend={<Element>Velg ett eller flere utdanningsnivå</Element>}>
                {utdanningsnivaKategorier.map((utdanning) => (
                    <Checkbox
                        className="checkbox--utdanningsniva"
                        id={`utdanningsniva-${utdanning.key.toLowerCase()}-checkbox`}
                        label={utdanning.label}
                        key={utdanning.key}
                        value={utdanning.key}
                        checked={utdanningsniva.includes(utdanning.key)}
                        onChange={onUtdanningsnivaChange}
                    />
                ))}
            </SkjemaGruppe>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.UTDANNING && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeUtdanning: PropTypes.func.isRequired,
    checkUtdanningsniva: PropTypes.func.isRequired,
    uncheckUtdanningsniva: PropTypes.func.isRequired,
    utdanningsniva: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    utdanninger: state.søkefilter.utdanning.utdanninger,
    utdanningsniva: state.søkefilter.utdanning.utdanningsniva,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.utdanning.utdanningPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.UTDANNING }),
    removeUtdanning: (value) => dispatch({ type: REMOVE_SELECTED_UTDANNING, value }),
    checkUtdanningsniva: (value) => dispatch({ type: CHECK_UTDANNINGSNIVA, value }),
    uncheckUtdanningsniva: (value) => dispatch({ type: UNCHECK_UTDANNINGSNIVA, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_UTDANNING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
