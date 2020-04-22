import React, { FunctionComponent } from 'react';

interface Props {
    className: string;
}

const FlaggIkonStroke: FunctionComponent<Props> = ({ className }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
        <g fill="none" strokeMiterlimit="10" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2}>
            <path d="M1.5.5v23M1.5 13.5V.5l15 6.5z" />
        </g>
    </svg>
);

export default FlaggIkonStroke;
