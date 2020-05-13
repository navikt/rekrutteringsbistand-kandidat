import React, { FunctionComponent, ReactNode } from 'react';
import classNames from 'classnames';
import './Lenkeknapp.less';

type Props = {
    children: ReactNode | string;
    onClick: () => void;
    className: string;
    tittel?: string;
};

const Lenkeknapp: FunctionComponent<Props> = ({ children, onClick, className = '', tittel }) => {
    return (
        <button
            className={classNames('Lenkeknapp', 'typo-normal', 'lenke', className)}
            onClick={onClick}
            title={tittel}
        >
            {children}
        </button>
    );
};

export default Lenkeknapp;
