import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import MidlertidigUtilgjengeligSearch from './midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import OppstartstidspunktSearch from './oppstardstidspunkt/OppstartstidspunktSearch';
import './TilgjengelighetSearch.less';
import AppState from '../../AppState';
import { connect } from 'react-redux';

interface Props {
    panelOpen: boolean;
}

const TilgjengelighetSearch: FunctionComponent<Props> = ({ panelOpen }) => {
    const todoOpen = () => {
        console.log('click');
    };

    return (
        <SokekriteriePanel
            apen={true}
            id="Tilgjengelighet__SokekriteriePanel"
            tittel={
                <div className="tilgjengelighet-search__tittel">
                    Tilgjengelighet
                    <NyttFilterIkon />
                </div>
            }
            onClick={todoOpen}
        >
            <OppstartstidspunktSearch />
            <MidlertidigUtilgjengeligSearch />
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    // panelOpen: state.arbeidserfaring.arbeidserfaringPanelOpen,
});

const mapDispatchToProps = (dispatch: any) => ({
    // togglePanelOpen: () => dispatch({ type: TOGGLE_ARBEIDSERFARING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilgjengelighetSearch);
