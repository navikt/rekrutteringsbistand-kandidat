import React, { ReactNode } from 'react';
import { Table } from '@navikt/ds-react';
import { useSelector } from 'react-redux';
import AppState from '../AppState';
import { Retning } from '../common/sorterbarKolonneheader/Retning';

type Props = {
    children: ReactNode;
};

const Kandidatlistetabell = ({ children }: Props) => {
    const aktivtSorteringsfelt = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortField
    );

    const aktivRetning = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortDirection
    );

    /*
    const endreSortering = (sorteringsfeltIndex: number) => {
        const endringPåAktivtFelt = aktivtSorteringsfeltIndeks() === sorteringsfeltIndex;

        const nyRetning = endringPåAktivtFelt
            ? nesteSorteringsretning(aktivRetning)
            : Retning.Stigende;
        const felt =
            nyRetning === null
                ? null
                : Object.keys(KandidatlisteSorteringsfelt)[sorteringsfeltIndex];

        dispatch({
            type: ListeoversiktActionType.SetSortering,
            sortering: { sortField: felt, sortDirection: nyRetning },
        });
    };
    */

    let direction: string | null = null;
    if (aktivRetning === Retning.Stigende) {
        direction = 'ascending';
    } else if (aktivRetning === Retning.Synkende) {
        direction = 'descending';
    }

    const sort = {
        orderBy: String(aktivtSorteringsfelt) ?? undefined,
        direction,
    };

    return <Table sort={sort} className="kandidatlister-table"></Table>;
};

export default Kandidatlistetabell;
