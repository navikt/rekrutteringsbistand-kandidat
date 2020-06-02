import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { AlderActionType } from './alderReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import AppState from '../../AppState';

export const AlderSearch: FunctionComponent = () => {
    const dispatch = useDispatch();

    const defaultAlder = useSelector((state: AppState) => ({
        fra: state.alder.fra,
        til: state.alder.til,
    }));

    const [fra, setFra] = useState<number | undefined>(defaultAlder.fra);
    const [til, setTil] = useState<number | undefined>(defaultAlder.til);

    const setAlder = (fra: number | undefined, til: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlder, fra, til });
    const search = () => dispatch({ type: SEARCH });
    const togglePanel = () => dispatch({ type: AlderActionType.ToggleAlderPanel });
    const erÅpen = useSelector((state: AppState) => state.alder.panelOpen);

    const onBrukKlikk = () => {
        setAlder(fra, til);
        search();
    };

    const onInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        setState: (alder: number | undefined) => void
    ) => {
        const stringValue = event.target.value;
        if (stringValue === undefined || stringValue === '') {
            setState(undefined);
        }
        const value: number = parseInt(event.target.value);
        if (!isNaN(value)) {
            setState(value);
        }
    };

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
                <Input
                    className="alder-search__fra-input"
                    label="Fra"
                    aria-label="Alder fra"
                    onChange={(event) => onInputChange(event, setFra)}
                    value={fra ?? ''}
                />
                <div className="alder-search__tankestrek">–</div>
                <Input
                    className="alder-search__til-input"
                    label="Til"
                    aria-label="Alder til"
                    onChange={(event) => onInputChange(event, setTil)}
                    value={til ?? ''}
                />
                <Knapp kompakt onClick={onBrukKlikk}>
                    Bruk
                </Knapp>
            </div>
        </SokekriteriePanel>
    );
};
