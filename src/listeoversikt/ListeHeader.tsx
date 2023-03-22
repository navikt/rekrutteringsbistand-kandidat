import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import SorterbarKolonneheader from '../common/sorterbarKolonneheader/SorterbarKolonneheader';
import { KandidatlisteSorteringsfelt } from './Kandidatlistesortering';
import AppState from '../AppState';
import { ListeoversiktActionType } from './reducer/ListeoversiktAction';
import { nesteSorteringsretning, Retning } from '../common/sorterbarKolonneheader/Retning';
import { Table } from '@navikt/ds-react';

const ListeHeader: FunctionComponent = () => {
    const dispatch = useDispatch();

    const aktivtSorteringsfelt = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortField
    );
    const aktivRetning = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortDirection
    );

    const indeksFra = (kandidatlisteSorteringsfelt: KandidatlisteSorteringsfelt): number =>
        Object.keys(KandidatlisteSorteringsfelt).indexOf(kandidatlisteSorteringsfelt);

    const aktivtSorteringsfeltIndeks = (): number | null =>
        aktivtSorteringsfelt === null
            ? null
            : Object.keys(KandidatlisteSorteringsfelt).indexOf(aktivtSorteringsfelt);

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

    return (
        <Table.Header className="liste-rad-innhold">
            <Table.Row>
                <Table.ColumnHeader
                    sortable
                    sortKey={KandidatlisteSorteringsfelt.OpprettetTidspunkt}
                >
                    Dato opprettet
                </Table.ColumnHeader>
            </Table.Row>

            <SorterbarKolonneheader
                tekst="Dato opprettet"
                sorteringsfelt={indeksFra(KandidatlisteSorteringsfelt.OpprettetTidspunkt)}
                aktivtSorteringsfelt={aktivtSorteringsfeltIndeks()}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-middels sorterbar-kolonne-header"
            />
            <SorterbarKolonneheader
                tekst="Navn på kandidatliste"
                sorteringsfelt={indeksFra(KandidatlisteSorteringsfelt.Tittel)}
                aktivtSorteringsfelt={aktivtSorteringsfeltIndeks()}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-bred sorterbar-kolonne-header"
            />
            <SorterbarKolonneheader
                tekst="Antall kandidater"
                sorteringsfelt={indeksFra(KandidatlisteSorteringsfelt.AntallKandidater)}
                aktivtSorteringsfelt={aktivtSorteringsfeltIndeks()}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-middels sorterbar-kolonne-header"
            />
            <SorterbarKolonneheader
                tekst="Veileder"
                sorteringsfelt={indeksFra(KandidatlisteSorteringsfelt.OpprettetAv)}
                aktivtSorteringsfelt={aktivtSorteringsfeltIndeks()}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-bred sorterbar-kolonne-header"
            />
            <div className="kolonne-middels__finn-kandidater">
                <Element>Finn kandidater</Element>
            </div>
            <div className="kolonne-smal">
                <Element>Rediger</Element>
            </div>
            <div className="kolonne-smal">
                <Element>Meny</Element>
            </div>
        </Table.Header>
    );
};

export default ListeHeader;
