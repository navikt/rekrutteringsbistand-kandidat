import React, { ReactNode } from 'react';
import { BodyLong, SortState, Table } from '@navikt/ds-react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../AppState';
import { nesteSorteringsretning, Retning } from '../../common/sorterbarKolonneheader/Retning';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { ListeoversiktActionType } from '../reducer/ListeoversiktAction';
import { Nettstatus } from '../../api/Nettressurs';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import Sidelaster from '../../common/sidelaster/Sidelaster';
import css from './Kandidatlistetabell.module.css';
import classNames from 'classnames';

type Props = {
    nettstatus: Nettstatus;
    kandidatlister: KandidatlisteSammendrag[];
    className?: string;
    children: ReactNode;
};

const Kandidatlistetabell = ({ nettstatus, kandidatlister, className, children }: Props) => {
    const dispatch = useDispatch();

    const aktivtSorteringsfelt = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortField
    );

    const aktivRetning = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortDirection
    );

    const onSortChange = (sorteringsfelt: KandidatlisteSorteringsfelt) => {
        const sorteringPåNyttFelt = aktivtSorteringsfelt !== sorteringsfelt;
        const nyRetning = sorteringPåNyttFelt
            ? Retning.Stigende
            : nesteSorteringsretning(aktivRetning);

        const nyttFelt = nyRetning === null ? null : sorteringsfelt;

        dispatch({
            type: ListeoversiktActionType.SetSortering,
            sortering: { sortField: nyttFelt, sortDirection: nyRetning },
        });
    };

    const sort = aktivtSorteringsfelt
        ? {
              orderBy: aktivtSorteringsfelt,
              direction: aktivRetning === Retning.Stigende ? 'ascending' : 'descending',
          }
        : undefined;

    if (nettstatus !== Nettstatus.Suksess) {
        return <Sidelaster className={className} />;
    } else if (kandidatlister.length === 0) {
        return (
            <div className={classNames(className, css.fantIngenKandidater)}>
                <BodyLong size="medium">Fant ingen kandidatlister som matcher søket ditt.</BodyLong>
            </div>
        );
    }

    return (
        <Table
            zebraStripes
            size="medium"
            sort={sort as SortState}
            onSortChange={onSortChange}
            className={classNames(css.tabell, className)}
        >
            {children}
        </Table>
    );
};

export default Kandidatlistetabell;
