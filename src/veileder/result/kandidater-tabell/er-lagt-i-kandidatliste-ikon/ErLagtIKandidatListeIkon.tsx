import React from 'react';
import { FunctionComponent } from 'react';

interface Props {
    className: string;
}

const ErLagtIKandidatListeIkon: FunctionComponent<Props> = ({ className }) => (
    <span className={className}>
        <svg
            width="20"
            height="20"
            viewBox="-1 -1 22 22"
            fill="none"
        >
            <title>Kandidaten ligger allerede i kandidatlisten</title>
            <path
                stroke="#06893A"
                strokeWidth="1"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.205 15.7112C7.28333 15.7895 7.39 15.8328 7.5 15.8328H7.5225C7.64 15.8262 7.75 15.7695 7.825 15.6778L19.9083 0.677845C20.0525 0.498679 20.0242 0.236179 19.845 0.0920121C19.6658 -0.0521546 19.4025 -0.0238213 19.2592 0.155345L7.46583 14.7937L3.6275 10.9553C3.465 10.7928 3.20083 10.7928 3.03833 10.9553C2.87583 11.1178 2.87583 11.382 3.03833 11.5445L7.205 15.7112ZM0 12.0829C0 16.4479 3.55167 19.9996 7.91667 19.9996C12.2817 19.9996 15.8333 16.4479 15.8333 12.0829C15.8333 11.4904 15.7658 10.8962 15.6342 10.3179C15.5825 10.0929 15.3542 9.95208 15.135 10.0046C14.91 10.0562 14.77 10.2796 14.8217 10.5037C14.94 11.0212 15 11.5529 15 12.0829C15 15.9887 11.8225 19.1662 7.91667 19.1662C4.01083 19.1662 0.833333 15.9887 0.833333 12.0829C0.833333 8.17708 4.01083 4.99958 7.91667 4.99958C9.0225 4.99958 10.0817 5.24708 11.065 5.73541C11.2717 5.83874 11.5208 5.75374 11.6233 5.54791C11.7258 5.34208 11.6417 5.09208 11.4358 4.98958C10.3358 4.44374 9.15167 4.16624 7.91667 4.16624C3.55167 4.16624 0 7.71791 0 12.0829Z"
            />
        </svg>
    </span>
);

export default ErLagtIKandidatListeIkon;
