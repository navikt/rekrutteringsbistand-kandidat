import React, { FunctionComponent, ReactNode } from 'react';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import './Hendelse.less';

export enum Hendelsesstatus {
    Hvit = 'hvit',
    Grønn = 'grønn',
    Blå = 'blå',
    Oransje = 'oransje',
    Rød = 'rød',
}

type Props = {
    status: Hendelsesstatus;
    tittel?: string;
    beskrivelse?: ReactNode;
    renderChildrenBelowContent?: boolean;
};

const Hendelse: FunctionComponent<Props> = ({
    status,
    tittel,
    beskrivelse,
    renderChildrenBelowContent,
    children,
}) => {
    let className = 'hendelse';
    let ikonClassName = 'hendelse__ikon';
    let innholdClassName = 'hendelse__innhold';

    if (status !== Hendelsesstatus.Hvit) {
        className += ` hendelse--${status}`;
        ikonClassName += ` hendelse__ikon--${status}`;
    }

    if (renderChildrenBelowContent) {
        innholdClassName += ' hendelse__innhold--children-below-content';
    }

    const beskrivelseContainerTag = typeof beskrivelse === 'string' ? 'p' : 'div';

    return (
        <li className={className}>
            <div className={ikonClassName}>
                {status === Hendelsesstatus.Grønn && (
                    <CheckmarkIcon className="hendelse__ikon-grafikk-grønn" />
                )}
                {status === Hendelsesstatus.Oransje && (
                    <Element className="hendelse__ikon-grafikk-oransje">!</Element>
                )}
                {status === Hendelsesstatus.Blå && (
                    <code className="hendelse__ikon-grafikk-blå">i</code>
                )}
                {status === Hendelsesstatus.Rød && (
                    <code className="hendelse__ikon-grafikk-rød">×</code>
                )}
            </div>
            <div className={innholdClassName}>
                {(tittel || beskrivelse) && (
                    <div className="hendelse__tekst">
                        {tittel && <Element tag="h3">{tittel}</Element>}
                        {beskrivelse && (
                            <Undertekst
                                tag={beskrivelseContainerTag}
                                className="hendelse__beskrivelse"
                            >
                                {beskrivelse}
                            </Undertekst>
                        )}
                    </div>
                )}
                <div className="hendelse__children">{children}</div>
            </div>
        </li>
    );
};

export default Hendelse;
