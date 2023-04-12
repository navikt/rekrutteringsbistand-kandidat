import React, { FunctionComponent, ReactNode } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import './Hendelse.less';
import css from './Hendelse.module.css';
import { BodyLong, Heading, Label } from '@navikt/ds-react';

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
                    <CheckmarkIcon className={css.ikonGrafikkGrønn} />
                )}
                {status === Hendelsesstatus.Oransje && (
                    <Label as="span" className={css.ikonGrafikkOransje}>
                        !
                    </Label>
                )}
                {status === Hendelsesstatus.Blå && <code>i</code>}
                {status === Hendelsesstatus.Rød && <code>×</code>}
            </div>
            <div className={innholdClassName}>
                {(tittel || beskrivelse) && (
                    <div>
                        {tittel && (
                            <Heading level="3" size="xsmall">
                                {tittel}
                            </Heading>
                        )}
                        {beskrivelse && (
                            <BodyLong as={beskrivelseContainerTag} size="small">
                                {beskrivelse}
                            </BodyLong>
                        )}
                    </div>
                )}
                <div className={css.children}>{children}</div>
            </div>
        </li>
    );
};

export default Hendelse;
