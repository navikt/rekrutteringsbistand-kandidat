import React, { FunctionComponent, ReactNode } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './TomListe.less';

type Props = {
    children?: ReactNode;
    kandidatlistenErLukket: boolean;
};

const TomListe: FunctionComponent<Props> = ({ kandidatlistenErLukket, children }) => (
    <div className="tom-liste">
        <div
            className={`tom-liste__content${
                kandidatlistenErLukket ? ' tom-liste__content--lukket-liste' : ''
            }`}
        >
            <Undertittel
                className={`tom-liste__tekst${children ? ' tom-liste__tekst--med-children' : ''}`}
            >
                <span>Du har ingen kandidater i kandidatlisten.</span>
                {kandidatlistenErLukket && <span> Listen er avsluttet.</span>}
            </Undertittel>
            {children && <div className="tom-liste__knapper">{children}</div>}
        </div>
    </div>
);

export default TomListe;
