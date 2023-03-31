import React, { FunctionComponent, MouseEvent } from 'react';
import classNames from 'classnames';

import css from './LenkeknappNy.module.css';
import { Button } from '@navikt/ds-react';

type Props = {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    tittel?: string;
    icon?: React.ReactNode;
};

const LenkeknappNy: FunctionComponent<Props> = ({
    children,
    onClick,
    className = '',
    tittel,
    icon,
}) => {
    return (
        <Button
            className={classNames(css.Lenkeknapp, className)}
            onClick={onClick}
            title={tittel}
            variant="tertiary-neutral"
            icon={icon}
        >
            {children}
        </Button>
    );
};

export default LenkeknappNy;
