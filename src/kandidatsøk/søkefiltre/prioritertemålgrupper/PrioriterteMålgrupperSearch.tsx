import * as React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';

import { SEARCH } from '../../reducer/searchReducer';
import {
    CHANGE_PRIORITERTE_MÅLGRUPPER,
    TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN,
} from './prioriterteMålgrupperReducer';
import PrioritertMålgruppe from './PrioritertMålgruppe';
import './PrioriterteMålgrupper.less';
import AppState from '../../../AppState';

interface PrioriterteMålgrupperSearchProps {
    search: () => void;
    panelOpen: boolean;
    togglePanelOpen: () => void;
    changePrioriterteMålgrupper: (prioriterteMålgrupper: PrioritertMålgruppe[]) => void;
    valgteMålgrupper: PrioritertMålgruppe[];
}

const PrioriterteMålgrupperSearch = (props: PrioriterteMålgrupperSearchProps) => {
    const {
        search,
        togglePanelOpen,
        panelOpen,
        changePrioriterteMålgrupper,
        valgteMålgrupper,
    } = props;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const målgruppe = event.currentTarget.value as PrioritertMålgruppe;
        changePrioriterteMålgrupper(
            event.target.checked
                ? [...valgteMålgrupper, målgruppe]
                : valgteMålgrupper.filter((k) => k !== målgruppe)
        );

        search();
    };

    return (
        <SokekriteriePanel
            id="PrioriterteMålgrupper__SokekriteriePanel"
            fane="prioriterteMålgrupper"
            tittel="Prioriterte målgrupper"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Checkbox
                id="hullicv-checkbox"
                label="Har hull i CV-en"
                checked={valgteMålgrupper.includes(PrioritertMålgruppe.HullICv)}
                value={PrioritertMålgruppe.HullICv}
                onChange={onChange}
            />
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    panelOpen: state.søkefilter.prioriterteMålgrupper.prioriterteMålgrupperPanelOpen,
    valgteMålgrupper: state.søkefilter.prioriterteMålgrupper.valgte,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN }),
    changePrioriterteMålgrupper: (valgteMålgrupper: PrioritertMålgruppe[]) =>
        dispatch({ type: CHANGE_PRIORITERTE_MÅLGRUPPER, valgteMålgrupper }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrioriterteMålgrupperSearch);
