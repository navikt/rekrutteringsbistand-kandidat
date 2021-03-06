import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import Indikator from '../../kandidatliste/liste-header/Indikator';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { Retning } from './Retning';
import './SorterbarKolonneheader.less';

interface Props {
    tekst: string;
    sorteringsfelt: number;
    aktivtSorteringsfelt: number | null;
    aktivSorteringsretning: Retning | null;
    onClick: (sorteringsfelt: number) => void;
    className?: string;
}

const SorterbarKolonneheader: FunctionComponent<Props> = ({
    tekst,
    sorteringsfelt,
    aktivtSorteringsfelt,
    aktivSorteringsretning,
    onClick,
    className,
    children,
}) => {
    let { pathname, search } = useLocation();

    let ariaSort: 'none' | 'ascending' | 'descending' = 'none';

    if (sorteringsfelt === aktivtSorteringsfelt && aktivSorteringsretning !== null) {
        ariaSort = aktivSorteringsretning === Retning.Stigende ? 'ascending' : 'descending';
    }

    const mainClassName = classnames('sorterbar-kolonneheader', className ? className : undefined, {
        'sorterbar-kolonneheader--valgt': ariaSort !== 'none',
    });

    return (
        <Link
            to={pathname + search + '#'}
            role="columnheader"
            aria-sort={ariaSort}
            onClick={() => onClick(sorteringsfelt)}
            className={mainClassName}
        >
            <Element tag="div" className="sorterbar-kolonneheader__tekst">
                {tekst}
            </Element>
            {children}
            {ariaSort === 'none' ? (
                <Indikator />
            ) : ariaSort === 'ascending' ? (
                <OppChevron className="sorterbar-kolonneheader__chevron" />
            ) : (
                <NedChevron className="sorterbar-kolonneheader__chevron" />
            )}
        </Link>
    );
};

export default SorterbarKolonneheader;
