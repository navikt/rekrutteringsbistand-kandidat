import React, { ChangeEvent, FunctionComponent, useState, KeyboardEvent, useEffect } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { AlderActionType } from './alderReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Knapp, Flatknapp } from 'nav-frontend-knapper';
import AppState from '../../AppState';
import { Element } from 'nav-frontend-typografi';

const inputPropsForAlder = {
    type: 'number',
    min: '15',
    max: '100',
};

export const AlderSearch: FunctionComponent = () => {
    const dispatch = useDispatch();

    const defaultAlder = useSelector((state: AppState) => ({
        fra: state.søkefilter.alder.fra,
        til: state.søkefilter.alder.til,
    }));

    const [fra, setFra] = useState<number | undefined>(defaultAlder.fra);
    const [til, setTil] = useState<number | undefined>(defaultAlder.til);

    useEffect(() => {
        setFra(defaultAlder.fra);
        setTil(defaultAlder.til);
    }, [defaultAlder.fra, defaultAlder.til]);

    const setAlder = (fra: number | undefined, til: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlder, fra, til });

    const search = () => dispatch({ type: SEARCH });
    const togglePanel = () => dispatch({ type: AlderActionType.ToggleAlderPanel });
    const erÅpen = useSelector((state: AppState) => state.søkefilter.alder.panelOpen);

    const søkMedAlder = () => {
        setAlder(fra, til);
        search();
    };

    const nullstill = () => {
        setAlder(undefined, undefined);
        setFra(undefined);
        setTil(undefined);
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

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            søkMedAlder();
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
            <Element className="alder-search__tittel">Skriv inn alder:</Element>
            <div className="alder-search__innhold">
                <Input
                    className="alder-search__fra-input"
                    label="Fra og med"
                    aria-label="Alder fra og med"
                    onChange={(event) => onInputChange(event, setFra)}
                    onKeyPress={onKeyPress}
                    value={fra ?? ''}
                    {...inputPropsForAlder}
                />
                <div className="alder-search__tankestrek">
                    <div />
                </div>
                <Input
                    className="alder-search__til-input"
                    label="Til og med"
                    aria-label="Alder til og med"
                    onChange={(event) => onInputChange(event, setTil)}
                    onKeyPress={onKeyPress}
                    value={til ?? ''}
                    {...inputPropsForAlder}
                />
                <Knapp className="alder-search__knapp" onClick={søkMedAlder}>
                    Bruk
                </Knapp>
                <span />
                <Flatknapp className="alder-search__knapp" kompakt onClick={nullstill}>
                    Nullstill
                </Flatknapp>
            </div>
        </SokekriteriePanel>
    );
};
