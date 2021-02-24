import React, { FunctionComponent } from 'react';

interface Props {
    className?: string;
}

const Forstørrelsesglass: FunctionComponent<Props> = (props) => (
    <svg className={props.className} width="99" height="97" xmlns="http://www.w3.org/2000/svg">
        <g fillRule="nonzero" fill="none">
            <path
                d="M35.8 71.7a35.8 35.8 0 110-71.7 35.8 35.8 0 010 71.7zm0-6.7a29.1 29.1 0 100-58.3 29.1 29.1 0 000 58.3z"
                fill="#3E3832"
            />
            <path
                d="M59.5 57.3a4.4 4.4 0 016.3 0l31.5 31.4A4.4 4.4 0 1191 95L59.5 63.6a4.4 4.4 0 010-6.3z"
                fill="#3E3832"
            />
            <circle fill="#C2EAF7" opacity=".5" cx="35.8" cy="35.8" r="29.1" />
            <path
                d="M26.9 54.6c2 .8 4.3 1.2 6.7 1.2 11.1 0 20.2-9.8 20.2-21.9 0-7.6-3.6-14.3-9-18.2 7.8 3 13.4 11.1 13.4 20.6 0 12.1-9 22-20.1 22a19 19 0 01-11.2-3.7z"
                fill="#FFF"
            />
        </g>
    </svg>
);

export default Forstørrelsesglass;
