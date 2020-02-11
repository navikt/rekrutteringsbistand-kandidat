import * as React from 'react';
import { FunctionComponent } from 'react';

interface Props {
    children: string;
    className?: string;
    id?: string;
}

const Sidetittel: FunctionComponent<Props> = ({ children, className = '', id = 'sidetittel' }) => (
    <h1
        id={id}
        className={`h1 display-1 ${className}`}
        style={{ fontFamily: 'Source Sans Pro, Arial, sans-serif' }}
    >
        {children}
    </h1>
);

export default Sidetittel;
