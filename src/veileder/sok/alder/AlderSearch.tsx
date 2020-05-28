import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { AlderAction, AlderActionType } from './alderReducer';
import { useDispatch } from 'react-redux';

interface Props {
    search: () => void;
    setAlderFra: (fra: number | undefined) => void;
    setAlderTil: (til: number | undefined) => void;
}

export const AlderSearch: FunctionComponent = () => {
    const dispatch = useDispatch();

    const setAlderFra = (fra: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlderFra, fra });
    const setAlderTil = (til: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlderTil, til });
    const search = () => dispatch({ type: SEARCH });
    const togglePanel = () => dispatch({ type: AlderActionType.ToggleAlderPanel });

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
            onClick={togglePanel}
        >
            hei test
        </SokekriteriePanel>
    );
};
