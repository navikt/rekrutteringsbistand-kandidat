import React, { FunctionComponent } from 'react';

const FlaggIkonStroke: FunctionComponent<{ className: string }> = ({ className }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
        <g
            fill="none"
            strokeMiterlimit="10"
            stroke="#8C368E"
            strokeLinejoin="round"
            strokeLinecap="round"
        >
            <path d="M1.5.5v23M1.5 13.5V.5l15 6.5z" />
        </g>
    </svg>
);

export default FlaggIkonStroke;
