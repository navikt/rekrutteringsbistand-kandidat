import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { ArbeidserfaringAction, ArbeidserfaringActionType } from './arbeidserfaringReducer';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import AntallÅrArbeidserfaring from './antall-år-arbeidserfaring/AntallÅrArbeidserfaring';
import Merkelapper from './merkelapper/Merkelapper';
import AppState from '../../../AppState';
import FerskArbeidserfaring from './fersk-arbeidserfaring/FerskArbeidserfaring';
import { Dispatch } from 'redux';
import { KandidatsøkAlert } from '../../reducer/searchReducer';

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
            props.visAlertFaKandidater === KandidatsøkAlert.Arbeidserfaring && (
                <FåKandidaterAlert totaltAntallTreff={props.totaltAntallTreff} />
            )}
    </SokekriteriePanel>
);

const mapStateToProps = (state: AppState) => ({
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.arbeidserfaring.arbeidserfaringPanelOpen,
});

const mapDispatchToProps = (dispatch: Dispatch<ArbeidserfaringAction>) => ({
    togglePanelOpen: () =>
        dispatch({ type: ArbeidserfaringActionType.ToggleArbeidserfaringPanelOpen }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
