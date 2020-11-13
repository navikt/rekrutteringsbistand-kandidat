import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Link, useLocation } from 'react-router-dom';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import classnames from 'classnames';

import { Kandidatsortering } from '../Kandidatliste';
import { Sorteringsalgoritme, Sorteringsvariant } from '../kandidatsortering';
import './SorterbarKolonne.less';
import Indikator from './Indikator';

type Props = {
    tekst: string;
    sortering?: Kandidatsortering;
    sorteringsalgoritme: Sorteringsalgoritme;
    className?: string;
    onClick: (sorteringsalgoritme: Sorteringsalgoritme) => void;
};

const SorterbarKolonne: FunctionComponent<Props> = ({
    tekst,
    sortering,
    sorteringsalgoritme,
    className,
    children,
    onClick,
}) => {
    let { pathname, search } = useLocation();

    let ariaSort: 'none' | 'ascending' | 'descending' = 'none';
    if (sortering && sortering.algoritme === sorteringsalgoritme) {
        ariaSort = sortering.variant === Sorteringsvariant.Stigende ? 'ascending' : 'descending';
    }

    const mainClassName = classnames('sorterbar-kolonne', className ? className : undefined, {
        'sorterbar-kolonne--valgt': ariaSort !== 'none',
    });

    const onLinkClick = () => {
        onClick(sorteringsalgoritme);
    };

    return (
        <Link
            to={pathname + search + '#'}
            role="columnheader"
            aria-sort={ariaSort}
            onClick={onLinkClick}
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

export default SorterbarKolonne;
