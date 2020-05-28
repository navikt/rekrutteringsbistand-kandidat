import React, { FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import './AlderSearch.less';
import { SEARCH } from '../searchReducer';
import { AlderAction, AlderActionType } from './alderReducer';
import { useDispatch } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';

export const AlderSearch: FunctionComponent = () => {
    const dispatch = useDispatch();

    const setAlder = (fra: number | undefined, til: number | undefined) =>
        dispatch({ type: AlderActionType.SetAlder, fra, til });
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
            <div className="alder-search__innhold">
                <Input className="alder-search__fra-input" label="Fra" aria-label="Alder fra" />
                <div className="alder-search__tankestrek">–</div>
                <Input className="alder-search__til-input" label="Til" aria-label="Alder til" />
                <Knapp>Bruk</Knapp>
            </div>
        </SokekriteriePanel>
    );
};
