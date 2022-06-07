import { Down, Up } from '@navikt/ds-icons';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { tilProsent } from '../formatering';

export const Seksjon = ({
    tittel,
    match,
    sammentrukket: defaultSammentrukket = false,
    className,
    children,
}: {
    tittel: string;
    match?: number;
    sammentrukket?: boolean;
    className?: string;
    children?: ReactNode;
}) => {
    const [sammentrukket, setSammentrukket] = useState<boolean>(defaultSammentrukket);

    const onTittelClick = () => {
        setSammentrukket(!sammentrukket);
    };

    return (
        <section
            className={`matchforklaring__seksjon${className === undefined ? '' : ' ' + className}`}
        >
            <h2 onClick={onTittelClick} className="matchforklaring__seksjontittel">
                {tittel}
                {match ? <> ({tilProsent(match)})</> : ''}
                <span className="matchforklaring__seksjonikon">
                    {sammentrukket ? <Down /> : <Up />}
                </span>
            </h2>
            <div
                className={classNames({
                    'matchforklaring__seksjon--sammentrukket': sammentrukket,
                })}
                aria-expanded={!sammentrukket}
            >
                {children}
            </div>
        </section>
    );
};

export default Seksjon;
