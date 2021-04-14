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
import AppState from '../../../AppState';
import './PrioriterteMålgrupper.less';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';

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
                id="ung-checkbox"
                className="prioriterteMålgrupper__kategoriUtenHjelpetekst"
                label="Unge under 30 år"
                checked={valgteMålgrupper.includes(PrioritertMålgruppe.Ung)}
                value={PrioritertMålgruppe.Ung}
                onChange={onChange}
            />
            <Checkbox
                id="senior-checkbox"
                className="prioriterteMålgrupper__kategoriUtenHjelpetekst"
                label="Senior 50+"
                checked={valgteMålgrupper.includes(PrioritertMålgruppe.Senior)}
                value={PrioritertMålgruppe.Senior}
                onChange={onChange}
            />
            <div className="prioriterteMålgrupper__checkboksMedHjelpetekst">
                <Checkbox
                    id="hullicv-checkbox"
                    className="prioriterteMålgrupper__kategori"
                    label="Har hull i CV-en"
                    checked={valgteMålgrupper.includes(PrioritertMålgruppe.HullICv)}
                    value={PrioritertMålgruppe.HullICv}
                    onChange={onChange}
                />
                <Hjelpetekst
                    type={PopoverOrientering.Under}
                    className="prioriterteMålgrupper__hjelpetekst"
                >
                    <div className="prioriterteMålgrupper__hjelpetekst__innhold">
                        Du får treff på kandidater som ikke har registrert jobb eller utdanning i
                        CV-en i en sammenhengende periode på 2 år i løpet av de siste 5 årene.
                    </div>
                </Hjelpetekst>
            </div>
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
