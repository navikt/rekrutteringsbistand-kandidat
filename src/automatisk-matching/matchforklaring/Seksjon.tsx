import React, { ReactNode } from 'react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { tilProsent } from '../formatering';
import './Seksjon.less';

export const Seksjon = ({
    tittel,
    match,
    nn_match,
    åpen,
    className,
    children,
}: {
    tittel: string;
    match?: number;
    nn_match?: number;
    åpen?: boolean;
    className?: string;
    children?: ReactNode;
}) => {
    const detailsClassName = 'matchforklaring-seksjon' + (className ? ' ' + className : '');

    return (
        <details open={åpen} className={detailsClassName}>
            <summary>
                <h2>
                    <span className="matchforklaring-seksjon__ikon">
                        <Expand className="matchforklaring-seksjon__ikon--ned" />
                        <Collapse className="matchforklaring-seksjon__ikon--opp" />
                    </span>
                    {tittel}
                    {match ? <> (spacy: {tilProsent(match)})</> : ''}
                    {nn_match ? <> (gensim: {tilProsent(nn_match)})</> : ''}
                </h2>
            </summary>
            {children}
        </details>
    );
};

export default Seksjon;
