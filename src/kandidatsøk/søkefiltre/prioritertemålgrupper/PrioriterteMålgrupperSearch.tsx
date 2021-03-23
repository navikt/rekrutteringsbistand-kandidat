import * as React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';

import { SEARCH } from '../../reducer/searchReducer';
import {
    CHANGE_PRIORITERTE_MÅLGRUPPER_KATEGORIER,
    TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN,
} from './prioriterteMålgrupperReducer';
import PrioriterteMålgrupperKategori from './PrioriterteMålgrupperKategori';
import './PrioriterteMålgrupper.less';
import AppState from '../../../AppState';

interface PrioriterteMålgrupperSearchProps {
    search: () => void;
    panelOpen: boolean;
    togglePanelOpen: () => void;
    changePrioriterteMålgrupper: (kategorier: PrioriterteMålgrupperKategori[]) => void;
}

const PrioriterteMålgrupperSearch = (props: PrioriterteMålgrupperSearchProps) => {
    const { search, togglePanelOpen, panelOpen, changePrioriterteMålgrupper } = props;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const kategori = event.currentTarget.value as PrioriterteMålgrupperKategori;
        changePrioriterteMålgrupper(
            kategorier.includes(kategori)
                ? kategorier.filter((k) => k !== kategori)
                : [...kategorier, kategori]
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
                id="tilretteleggingsbehov-checkbox"
                label="Har hull i CV-en"
                checked={false}
                onChange={onChange}
            />
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    panelOpen: state.søkefilter.prioriterteMålgrupper.prioriterteMålgrupperPanelOpen,
    kategorier: state.søkefilter.prioriterteMålgrupper.kategorier,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN }),
    changePrioriterteMålgrupper: (kategorier: PrioriterteMålgrupperKategori[]) =>
        dispatch({ type: CHANGE_PRIORITERTE_MÅLGRUPPER_KATEGORIER, kategorier }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrioriterteMålgrupperSearch);
