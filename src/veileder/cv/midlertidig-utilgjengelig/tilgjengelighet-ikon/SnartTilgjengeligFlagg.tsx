import React, { FunctionComponent } from 'react';

interface Props {
    className: string;
}

const SnartTilgjengeligFlagg: FunctionComponent<Props> = ({ className }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
        <title>Tilgjengelig innen 1 uke</title>
        <g
            fill="none"
            strokeMiterlimit="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={2}
            stroke="black"
        >
            <path d="M1.5.5v23M1.5 13.5V.5l15 6.5z" />
        </g>
    </svg>
);

export default SnartTilgjengeligFlagg;
