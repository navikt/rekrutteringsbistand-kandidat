import React, { ReactNode } from 'react';
import { SortState, Table } from '@navikt/ds-react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../../AppState';
import { nesteSorteringsretning, Retning } from '../../common/sorterbarKolonneheader/Retning';
import { KandidatlisteSorteringsfelt } from '../Kandidatlistesortering';
import { ListeoversiktActionType } from '../reducer/ListeoversiktAction';

type Props = {
    children: ReactNode;
};

const Kandidatlistetabell = ({ children }: Props) => {
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

    return (
        <Table
            sort={sort as SortState}
            onSortChange={onSortChange}
            className="kandidatlister-table"
        >
            {children}
        </Table>
    );
};

export default Kandidatlistetabell;
