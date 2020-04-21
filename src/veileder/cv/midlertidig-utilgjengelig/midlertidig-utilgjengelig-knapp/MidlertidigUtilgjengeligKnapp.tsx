import React, { FunctionComponent } from 'react';
import './MidlertidigUtilgjengeligKnapp.less';
import TilgjengelighetIkon, { Tilgjengelighet } from '../tilgjengelighet-ikon/TilgjengelighetIkon';
import Chevron from 'nav-frontend-chevron';

interface Props {
    chevronType: 'opp' | 'ned';
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tilgjengelighet: Tilgjengelighet;
}

const MidlertidigUtilgjengeligKnapp: FunctionComponent<Props> = (props) => {
    return (
        <button className="midlertidig-utilgjengelig-knapp" onClick={props.onClick}>
            <TilgjengelighetIkon
                tilgjengelighet={props.tilgjengelighet}
                className="midlertidig-utilgjengelig-knapp__ikon--svart"
            />
            Tilgjengelig innen 1 uke
            <Chevron
                type={props.chevronType}
                className="midlertidig-utilgjengelig-knapp__chevron"
            />
        </button>
    );
};

export default MidlertidigUtilgjengeligKnapp;
