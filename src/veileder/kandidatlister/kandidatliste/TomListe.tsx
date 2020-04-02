import React, { FunctionComponent, ReactNode } from 'react';
import { Undertittel } from 'nav-frontend-typografi';

type Props = {
    children: ReactNode;
};

const TomListe: FunctionComponent<Props> = ({ children }) => (
    <div className="tom-liste">
        <div className="content">
            <Undertittel className="tekst">Du har ingen kandidater i kandidatlisten</Undertittel>
            <div className="knapper">{children}</div>
        </div>
    </div>
);

export default TomListe;
