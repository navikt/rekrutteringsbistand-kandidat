import React, { ReactNode } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
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
                        <ChevronDownIcon className="matchforklaring-seksjon__ikon--ned" />
                        <ChevronUpIcon className="matchforklaring-seksjon__ikon--opp" />
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
