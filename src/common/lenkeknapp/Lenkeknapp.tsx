import React, { FunctionComponent, MouseEvent } from 'react';
import classNames from 'classnames';
import './Lenkeknapp.less';

type Props = {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    tittel?: string;
    disabled?: boolean;
};

const Lenkeknapp: FunctionComponent<Props> = ({
    children,
    onClick,
    className = '',
    tittel,
    disabled,
}) => {
    return (
        <button
            disabled={disabled}
            className={classNames('Lenkeknapp', 'typo-normal', className)}
            onClick={onClick}
            title={tittel}
        >
            {children}
        </button>
    );
};

export default Lenkeknapp;
