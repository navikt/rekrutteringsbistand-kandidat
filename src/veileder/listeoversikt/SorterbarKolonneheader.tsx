import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import Indikator from '../kandidatliste/liste-header/Indikator';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import {
    KandidatlisteSorteringsfelt,
    KandidatlisteSorteringsretning,
} from './Kandidatlistesortering';

interface Props {
    tekst: string;
    sorteringsfelt: KandidatlisteSorteringsfelt;
    sorteringsretning: null | KandidatlisteSorteringsretning;
    onClick: (sorteringsfelt: KandidatlisteSorteringsfelt) => void;
    className?: string;
}

const SorterbarKolonneheader: FunctionComponent<Props> = ({
    tekst,
    sorteringsfelt,
    sorteringsretning,
    onClick,
    className,
    children,
}) => {
    let { pathname, search } = useLocation();

    let ariaSort: 'none' | 'ascending' | 'descending' = 'none';
    if (sorteringsretning) {
        ariaSort =
            sorteringsretning === KandidatlisteSorteringsretning.Stigende
                ? 'ascending'
                : 'descending';
    }

    const mainClassName = classnames('sorterbar-kolonne', className ? className : undefined, {
        'sorterbar-kolonne--valgt': ariaSort !== 'none',
    });

    return (
        <Link
            to={pathname + search + '#'}
            role="columnheader"
            aria-sort={ariaSort}
            onClick={() => onClick(sorteringsfelt)}
            className={mainClassName}
        >
            <Element tag="div" className="sorterbar-kolonne__tekst">
                {tekst}
            </Element>
            {children}
            {ariaSort === 'none' ? (
                <Indikator />
            ) : ariaSort === 'ascending' ? (
                <OppChevron className="sorterbar-kolonne__chevron" />
            ) : (
                <NedChevron className="sorterbar-kolonne__chevron" />
            )}
        </Link>
    );
};

export default SorterbarKolonneheader;
