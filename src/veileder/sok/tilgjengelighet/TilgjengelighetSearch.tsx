import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import MidlertidigUtilgjengeligSearch from './midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import OppstartstidspunktSearch from './oppstardstidspunkt/OppstartstidspunktSearch';
import './TilgjengelighetSearch.less';
import AppState from '../../AppState';
import { connect } from 'react-redux';
import { TilgjengelighetAction } from './tilgjengelighetReducer';

interface Props {
    panelOpen: boolean;
    togglePanelOpen: () => void;
    visMidlertidigUtilgjengeligFilter: boolean;
}

const TilgjengelighetSearch: FunctionComponent<Props> = ({
    panelOpen,
    togglePanelOpen,
    visMidlertidigUtilgjengeligFilter,
}) => {
    return (
        <SokekriteriePanel
            apen={panelOpen}
            id="Tilgjengelighet__SokekriteriePanel"
            fane="tilgjengelighet"
            tittel={
                <div className="tilgjengelighet-search__tittel">
                    Tilgjengelighet
                    <NyttFilterIkon />
                </div>
            }
            onClick={togglePanelOpen}
        >
            <OppstartstidspunktSearch />
            {visMidlertidigUtilgjengeligFilter && <MidlertidigUtilgjengeligSearch />}
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    panelOpen: state.tilgjengelighet.panelOpen,
    visMidlertidigUtilgjengeligFilter: true, // TODO Ta tilbake
    // state.search.featureToggles['vis-midlertidig-utilgjengelig-filter'],
});

const mapDispatchToProps = (dispatch: any) => ({
    togglePanelOpen: () => dispatch({ type: TilgjengelighetAction.ToggleTilgjengelighetOpen }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilgjengelighetSearch);
