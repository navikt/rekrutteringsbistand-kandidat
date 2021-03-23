import * as React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';

import { SEARCH } from '../../reducer/searchReducer';
import { TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN } from './prioriterteMålgrupperReducer';
import './PrioriterteMålgrupper.less';
import AppState from '../../../AppState';

interface PrioriterteMålgrupperSearchProps {
    search: () => void;
    panelOpen: boolean;
    togglePanelOpen: () => void;
}

const PrioriterteMålgrupperSearch = (props: PrioriterteMålgrupperSearchProps) => {
    const { search, togglePanelOpen, panelOpen } = props;

    const onTilretteleggingsbehovChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                label="Vis kandidater med tilretteleggingsbehov"
                checked={false}
                onChange={togglePanelOpen}
            />
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    panelOpen: state.søkefilter.prioriterteMålgrupper.prioriterteMålgrupperPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_PRIORITERTE_MÅLGRUPPER_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrioriterteMålgrupperSearch);
