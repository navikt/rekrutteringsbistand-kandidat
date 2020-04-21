import React, { FunctionComponent } from 'react';
import './MidlertidigUtilgjengeligKnapp.less';
import TilgjengelighetIkon, { Tilgjengelighet } from '../tilgjengelighet-ikon/TilgjengelighetIkon';
import Chevron from 'nav-frontend-chevron';
import classNames from 'classnames';

interface Props {
    chevronType: 'opp' | 'ned';
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tilgjengelighet?: Tilgjengelighet;
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

const MidlertidigUtilgjengeligKnapp: FunctionComponent<Props> = ({
    chevronType,
    onClick,
    tilgjengelighet,
}) => {
    if (!tilgjengelighet) {
        return null;
    }
    const tekst = getKnappetekst(tilgjengelighet);

    const modifier = 'midlertidig-utilgjengelig-knapp--' + tilgjengelighet.toLowerCase();
    return (
        <button
            className={classNames('midlertidig-utilgjengelig-knapp', modifier)}
            onClick={onClick}
        >
            <TilgjengelighetIkon
                tilgjengelighet={tilgjengelighet}
                className="midlertidig-utilgjengelig-knapp__ikon"
            />
            {tekst}
            <Chevron
                type={chevronType}
                className="midlertidig-utilgjengelig-knapp__chevron"
            />
        </button>
    );
};

export default MidlertidigUtilgjengeligKnapp;
