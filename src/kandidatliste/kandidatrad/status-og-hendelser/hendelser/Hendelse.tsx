import { FunctionComponent, ReactNode } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import css from './Hendelse.module.css';
import { BodyLong, Heading, Label } from '@navikt/ds-react';
import classNames from 'classnames';

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
    const beskrivelseContainerTag = typeof beskrivelse === 'string' ? 'p' : 'div';

    return (
        <li
            className={classNames(
                { [css.heltrukkenStrek]: status !== Hendelsesstatus.Hvit },
                css.hendelse
            )}
        >
            <div
                aria-hidden
                className={classNames(css.ikon, {
                    [css.grøntIkon]: status === Hendelsesstatus.Grønn,
                    [css.oransjeIkon]: status === Hendelsesstatus.Oransje,
                    [css.blåttIkon]: status === Hendelsesstatus.Blå,
                    [css.rødtIkon]: status === Hendelsesstatus.Rød,
                })}
            >
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

            <div
                className={classNames(css.innhold, {
                    [css.childrenBelowContent]: renderChildrenBelowContent,
                })}
            >
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
