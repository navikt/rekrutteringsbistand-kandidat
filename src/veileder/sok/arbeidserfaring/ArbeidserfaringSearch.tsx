import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { TOGGLE_ARBEIDSERFARING_PANEL_OPEN } from './arbeidserfaringReducer';
import { ALERTTYPE } from '../../../felles/konstanter';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import AntallÅrArbeidserfaring from './antall-år-arbeidserfaring/AntallÅrArbeidserfaring';
import Merkelapper from './merkelapper/Merkelapper';
import AppState from '../../AppState';
import FerskArbeidserfaring from './fersk-arbeidserfaring/FerskArbeidserfaring';

interface Props {
    togglePanelOpen: () => void;
    panelOpen: boolean;
    totaltAntallTreff: number;
    visAlertFaKandidater: string;
}

const ArbeidserfaringSearch: FunctionComponent<Props> = props => (
    <SokekriteriePanel
        id="ArbeidserfaringSearch__SokekriteriePanel"
        tittel="Arbeidserfaring"
        onClick={props.togglePanelOpen}
        apen={props.panelOpen}
    >
        <Merkelapper />
        <div className="sokekriterier--margin-top-extra-large">
            <AntallÅrArbeidserfaring />
        </div>
        <FerskArbeidserfaring />
        {props.totaltAntallTreff <= 10 &&
            props.visAlertFaKandidater === ALERTTYPE.ARBEIDSERFARING && (
                <AlertStripeInfo totaltAntallTreff={props.totaltAntallTreff} />
            )}
    </SokekriteriePanel>
);

const mapStateToProps = (state: AppState) => ({
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.arbeidserfaring.arbeidserfaringPanelOpen,
});

const mapDispatchToProps = (dispatch: any) => ({
    togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidserfaringSearch);
