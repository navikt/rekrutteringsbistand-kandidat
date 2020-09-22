import React, { FunctionComponent, ReactNode } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import classnames from 'classnames';
import './TomListe.less';

type Props = {
    children?: ReactNode;
    kandidatlistenErLukket: boolean;
};

const TomListe: FunctionComponent<Props> = ({ kandidatlistenErLukket, children }) => (
    <div className="tom-liste">
        <div
            className={classnames('tom-liste__content', {
                'tom-liste__content--lukket-liste': kandidatlistenErLukket,
            })}
        >
            <Undertittel
                className={classnames('tom-liste__tekst', {
                    'tom-liste__tekst--med-children': children,
                })}
            >
                <span>Du har ingen kandidater i kandidatlisten.</span>
                {kandidatlistenErLukket && <span> Listen er avsluttet.</span>}
            </Undertittel>
            {children && <div className="tom-liste__knapper">{children}</div>}
        </div>
    </div>
);

export default TomListe;
