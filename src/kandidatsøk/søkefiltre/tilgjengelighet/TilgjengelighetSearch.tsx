import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import OppstartstidspunktSearch from './oppstardstidspunkt/OppstartstidspunktSearch';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { TilgjengelighetAction } from './tilgjengelighetReducer';

interface Props {
    panelOpen: boolean;
    togglePanelOpen: () => void;
}

const TilgjengelighetSearch: FunctionComponent<Props> = ({ panelOpen, togglePanelOpen }) => {
    return (
        <SokekriteriePanel
            apen={panelOpen}
            id="Tilgjengelighet__SokekriteriePanel"
            fane="tilgjengelighet"
            tittel="Tilgjengelighet"
            onClick={togglePanelOpen}
        >
            <OppstartstidspunktSearch />
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    panelOpen: state.søkefilter.tilgjengelighet.panelOpen,
});

const mapDispatchToProps = (dispatch: any) => ({
    togglePanelOpen: () => dispatch({ type: TilgjengelighetAction.ToggleTilgjengelighetOpen }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilgjengelighetSearch);
