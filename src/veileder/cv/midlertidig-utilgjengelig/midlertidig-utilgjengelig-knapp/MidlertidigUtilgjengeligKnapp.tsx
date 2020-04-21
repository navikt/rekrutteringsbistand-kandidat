import React, { FunctionComponent } from 'react';
import './MidlertidigUtilgjengeligKnapp.less';
import TilgjengelighetIkon, { Tilgjengelighet } from '../tilgjengelighet-ikon/TilgjengelighetIkon';
import Chevron from 'nav-frontend-chevron';
import classNames from 'classnames';

interface Props {
    chevronType: 'opp' | 'ned';
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tilgjengelighet: Tilgjengelighet;
}

const getKnappetekst = (tilgjengelighet: Tilgjengelighet) => {
    switch (tilgjengelighet) {
        case Tilgjengelighet.TILGJENGELIG:
            return 'Registrer som utilgjengelig';
        case Tilgjengelighet.SNART_TILGJENGELIG:
            return 'Tilgjengelig innen 1 uke';
        case Tilgjengelighet.UTILGJENGELIG:
            return 'Midlertidig utilgjengelig';
    }
};

const MidlertidigUtilgjengeligKnapp: FunctionComponent<Props> = (props) => {
    const tekst = getKnappetekst(props.tilgjengelighet);

    const modifier = 'midlertidig-utilgjengelig-knapp--' + props.tilgjengelighet.toLowerCase();
    return (
        <button
            className={classNames('midlertidig-utilgjengelig-knapp', modifier)}
            onClick={props.onClick}
        >
            <TilgjengelighetIkon
                tilgjengelighet={props.tilgjengelighet}
                className="midlertidig-utilgjengelig-knapp__ikon"
            />
            {tekst}
            <Chevron
                type={props.chevronType}
                className="midlertidig-utilgjengelig-knapp__chevron"
            />
        </button>
    );
};

export default MidlertidigUtilgjengeligKnapp;
