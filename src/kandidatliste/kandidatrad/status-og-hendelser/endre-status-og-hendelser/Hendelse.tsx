import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { SuccessStroke } from '@navikt/ds-icons';
import './Hendelse.less';

type Props = {
    checked: boolean;
    tittel?: string;
    beskrivelse?: string;
    renderChildrenBelowContent?: boolean;
};

const Hendelse: FunctionComponent<Props> = ({
    checked,
    tittel,
    beskrivelse,
    renderChildrenBelowContent,
    children,
}) => {
    let className = 'hendelse';
    let ikonClassName = 'hendelse__ikon';
    let innholdClassName = 'hendelse__innhold';

    if (checked) {
        className += ' hendelse--checked';
        ikonClassName += ' hendelse__ikon--checked';
    }

    if (renderChildrenBelowContent) {
        innholdClassName += ' hendelse__innhold--children-below-content';
    }

    return (
        <li className={className}>
            <div className={ikonClassName}>
                {checked && <SuccessStroke className="hendelse__ikon-grafikk" />}
            </div>
            <div className={innholdClassName}>
                {(tittel || beskrivelse) && (
                    <div className="hendelse__tekst">
                        {tittel && <Element tag="h3">{tittel}</Element>}
                        {beskrivelse && <Normaltekst>{beskrivelse}</Normaltekst>}
                    </div>
                )}
                <div className="hendelse__children">{children}</div>
            </div>
        </li>
    );
};

export default Hendelse;
