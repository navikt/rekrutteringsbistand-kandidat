import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { Kandidatsortering, Sorteringsalgoritme, Sorteringsvariant } from '../sortering';
import './SorterbarKolonne.less';

type Props = {
    tekst: string;
    sortering?: Kandidatsortering;
    sorteringsalgoritme: Sorteringsalgoritme;
    className?: string;
    onClick?: () => void;
};

const SorterbarKolonne: FunctionComponent<Props> = ({
    tekst,
    sortering,
    sorteringsalgoritme,
    className,
    children,
    onClick,
}) => {
    let ariaSort: 'none' | 'ascending' | 'descending' = 'none';
    if (sortering && sortering.algoritme === sorteringsalgoritme) {
        ariaSort = sortering.variant === Sorteringsvariant.Stigende ? 'ascending' : 'descending';
    }

    return (
        <Link
            to="#"
            role="columnheader"
            aria-sort={ariaSort}
            onClick={onClick}
            className={`sorterbar-kolonne${className ? ' ' + className : ''}`}
        >
            <Element tag="div" className="sorterbar-kolonne__tekst">
                {tekst}
            </Element>
            {children}
            {ariaSort !== 'none' &&
                (ariaSort === 'ascending' ? (
                    <OppChevron className="sorterbar-kolonne__chevron" />
                ) : (
                    <NedChevron className="sorterbar-kolonne__chevron" />
                ))}
        </Link>
    );
};

export default SorterbarKolonne;
