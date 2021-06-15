import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { SuccessStroke } from '@navikt/ds-icons';
import './Hendelse.less';

type Props = {
    checked: boolean;
    tittel?: string;
    beskrivelse?: string;
};

const Hendelse: FunctionComponent<Props> = ({ checked, tittel, beskrivelse, children }) => {
    let className = 'hendelse';
    let ikonClassName = 'hendelse__ikon';

    if (checked) {
        className += ' hendelse--checked';
        ikonClassName += ' hendelse__ikon--checked';
    }

    return (
        <li className={className}>
            <div className={ikonClassName}>
                {checked && <SuccessStroke className="hendelse__ikon-grafikk" />}
            </div>
            {(tittel || beskrivelse) && (
                <div className="hendelse__tekst">
                    {tittel && <Element tag="h3">{tittel}</Element>}
                    {beskrivelse && <Normaltekst>{beskrivelse}</Normaltekst>}
                </div>
            )}
            <div className="hendelse__children">{children}</div>
        </li>
    );
};

export default Hendelse;
