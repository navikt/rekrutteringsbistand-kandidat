import React, { ReactNode } from 'react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { tilProsent } from '../formatering';

export const Seksjon = ({
    tittel,
    match,
    åpen,
    className,
    children,
}: {
    tittel: string;
    match?: number;
    åpen?: boolean;
    className?: string;
    children?: ReactNode;
}) => {
    const detailsClassName = 'matchforklaring__seksjon' + (className ? ' ' + className : '');

    return (
        <details open={åpen} className={detailsClassName}>
            <summary>
                <h2>
                    <span className="matchforklaring__seksjonsikon">
                        <Expand className="matchforklaring__seksjonsikon--ned" />
                        <Collapse className="matchforklaring__seksjonsikon--opp" />
                    </span>
                    {tittel}
                    {match ? <> ({tilProsent(match)})</> : ''}
                </h2>
            </summary>
            {children}
        </details>
    );
};

export default Seksjon;
