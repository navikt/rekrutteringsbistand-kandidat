import React, { FunctionComponent, ReactNode } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import classnames from 'classnames';
import css from './TomListe.module.css';

type Props = {
    children?: ReactNode;
    kandidatlistenErLukket: boolean;
};

const TomListe: FunctionComponent<Props> = ({ kandidatlistenErLukket, children }) => (
    <div className={css.tomListe}>
        <div
            className={classnames(css.content, {
                [css.contentLukketListe]: kandidatlistenErLukket,
            })}
        >
            <Undertittel
                className={classnames(css.tekst, {
                    [css.tekstMedChildren]: children,
                })}
            >
                <span>Du har ingen kandidater i kandidatlisten.</span>
                {kandidatlistenErLukket && <span> Listen er avsluttet.</span>}
            </Undertittel>
            {children && <div className={css.knapper}>{children}</div>}
        </div>
    </div>
);

export default TomListe;
