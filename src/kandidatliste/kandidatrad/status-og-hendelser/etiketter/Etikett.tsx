import React, { ReactNode } from 'react';
import { Detail } from '@navikt/ds-react';
import classNames from 'classnames';
import css from './Etikett.module.css';

type Props = {
    label: string;
    children: ReactNode;
    className?: string;
};

const Etikett = ({ children, className, label }: Props) => (
    <Detail as="div" aria-label={label} className={classNames(css.etikett, className)}>
        {children}
    </Detail>
);

export default Etikett;
