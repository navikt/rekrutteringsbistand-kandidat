import { FunctionComponent, ReactNode } from 'react';
import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from '@navikt/aksel-icons';
import { Link, useLocation } from 'react-router-dom';
import { Retning } from './Retning';
import { Label } from '@navikt/ds-react';
import css from './SorterbarKolonneheader.module.css';

interface Props {
    tekst: string;
    sorteringsfelt: number;
    aktivtSorteringsfelt: number | null;
    aktivSorteringsretning: Retning | null;
    onClick: (sorteringsfelt: number) => void;
    children?: ReactNode;
}

const SorterbarKolonneheader: FunctionComponent<Props> = ({
    tekst,
    sorteringsfelt,
    aktivtSorteringsfelt,
    aktivSorteringsretning,
    onClick,
    children,
}) => {
    let { pathname, search } = useLocation();

    let ariaSort: 'none' | 'ascending' | 'descending' = 'none';

    if (sorteringsfelt === aktivtSorteringsfelt && aktivSorteringsretning !== null) {
        ariaSort = aktivSorteringsretning === Retning.Stigende ? 'ascending' : 'descending';
    }

    return (
        <Link
            to={pathname + search + '#'}
            role="columnheader"
            aria-sort={ariaSort}
            onClick={() => onClick(sorteringsfelt)}
            className={css.sorterbarKolonneheader}
        >
            <Label as="div" className={css.sorterbarKolonneheaderTekst}>
                {tekst}
            </Label>
            {children}
            {ariaSort === 'none' ? (
                <ArrowsUpDownIcon aria-hidden />
            ) : ariaSort === 'ascending' ? (
                <ArrowUpIcon aria-hidden />
            ) : (
                <ArrowDownIcon aria-hidden />
            )}
        </Link>
    );
};

export default SorterbarKolonneheader;
