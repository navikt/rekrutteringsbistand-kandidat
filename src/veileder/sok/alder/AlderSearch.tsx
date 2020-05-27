import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { PermitteringActionType } from '../permittering/permitteringReducer';

export const AlderSearch: FunctionComponent = () => {
    return (
        <SokekriteriePanel
            apen={true}
            id="Alder__SokekriteriePanel"
            fane="alder"
            tittel={
                <div className="alder-search__tittel">
                    Alder
                    <NyttFilterIkon />
                </div>
            }
            onClick={() => {}}
        >
            hei test
        </SokekriteriePanel>
    );
};

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    search: () => dispatch({ type: SEARCH }),
    setAlder: () => {},
    togglePanel: () => dispatch({ type: PermitteringActionType.TOGGLE_PERMITTERING_PANEL }),
});
