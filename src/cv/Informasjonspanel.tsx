import React, { ReactNode } from 'react';
import { Accordion } from '@navikt/ds-react';
import css from './Informasjonspanel.module.css';
import classNames from 'classnames';

type Props = {
    tittel: string;
    className?: string;
    children: ReactNode;
};

const Informasjonspanel = ({ tittel, className, children }: Props) => {
    return (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header className={css.header}>{tittel}</Accordion.Header>
                <Accordion.Content className={classNames(css.content, className)}>
                    {children}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default Informasjonspanel;
