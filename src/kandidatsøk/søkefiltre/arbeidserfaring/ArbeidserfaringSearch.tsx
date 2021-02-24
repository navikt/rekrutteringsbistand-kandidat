import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { TOGGLE_ARBEIDSERFARING_PANEL_OPEN } from './arbeidserfaringReducer';
import { ALERTTYPE } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import AntallÅrArbeidserfaring from './antall-år-arbeidserfaring/AntallÅrArbeidserfaring';
import Merkelapper from './merkelapper/Merkelapper';
import AppState from '../../../AppState';
import FerskArbeidserfaring from './fersk-arbeidserfaring/FerskArbeidserfaring';

interface Props {
    togglePanelOpen: () => void;
    panelOpen: boolean;
    totaltAntallTreff: number;
    visAlertFaKandidater: string;
}

const ArbeidserfaringSearch: FunctionComponent<Props> = (props) => (
    <SokekriteriePanel
        id="ArbeidserfaringSearch__SokekriteriePanel"
        fane="arbeidserfaring"
        tittel="Arbeidserfaring"
        onClick={props.togglePanelOpen}
        apen={props.panelOpen}
    >
        <Merkelapper />
        <FerskArbeidserfaring />
        <AntallÅrArbeidserfaring />
        {props.totaltAntallTreff <= 10 &&
            props.visAlertFaKandidater === ALERTTYPE.ARBEIDSERFARING && (
                <FåKandidaterAlert totaltAntallTreff={props.totaltAntallTreff} />
            )}
    </SokekriteriePanel>
);

const mapStateToProps = (state: AppState) => ({
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.arbeidserfaring.arbeidserfaringPanelOpen,
});

const mapDispatchToProps = (dispatch: any) => ({
    togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
