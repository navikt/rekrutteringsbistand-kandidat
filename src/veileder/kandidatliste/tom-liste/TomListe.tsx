import React, { FunctionComponent, ReactNode } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './TomListe.less';

type Props = {
    children: ReactNode;
};

const TomListe: FunctionComponent<Props> = ({ children }) => (
    <div className="tom-liste">
        <div className="tom-liste__content">
            <Undertittel className="tom-liste__tekst">
                Du har ingen kandidater i kandidatlisten
            </Undertittel>
            <div className="tom-liste__knapper">{children}</div>
        </div>
    </div>
);

export default TomListe;
