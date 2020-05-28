import React, { FunctionComponent, useState } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { AlderAction, AlderActionType } from './alderReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import AppState from '../../AppState';

export const AlderSearch: FunctionComponent = () => {
    const dispatch = useDispatch();

    const [fra, setFra] = useState<number | undefined>();
    const [til, setTil] = useState<number | undefined>();

    const setAlder = (fra: number | undefined, til: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlder, fra, til });
    const search = () => dispatch({ type: SEARCH });
    const togglePanel = () => dispatch({ type: AlderActionType.ToggleAlderPanel });
    const erÅpen = useSelector((state: AppState) => state.alder.panelOpen);

    const onBrukKlikk = () => {};

    return (
        <SokekriteriePanel
            apen={erÅpen}
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
            <div className="alder-search__innhold">
                <Input className="alder-search__fra-input" label="Fra" aria-label="Alder fra" />
                <div className="alder-search__tankestrek">–</div>
                <Input className="alder-search__til-input" label="Til" aria-label="Alder til" />
                <Knapp kompakt>Bruk</Knapp>
            </div>
        </SokekriteriePanel>
    );
};
