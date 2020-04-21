import React, { FunctionComponent } from 'react';

interface Props {
    className: string;
}

const FlaggIkonFill: FunctionComponent<Props> = ({ className }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
        <path
            stroke="none"
            d="M16.199 6.541L1.627.227a.998.998 0 0 0-.539-.218L1.055.005C1.036.004 1.019 0 1 0L.975.002l-.04.005A.997.997 0 0 0 0 1v22a1 1 0 1 0 2 0v-9.389l14.199-6.152a.5.5 0 0 0 0-.918z"
        />
    </svg>
);

export default FlaggIkonFill;
