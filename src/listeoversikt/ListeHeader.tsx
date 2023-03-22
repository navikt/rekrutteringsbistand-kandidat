import React, { FunctionComponent } from 'react';
import { KandidatlisteSorteringsfelt } from './Kandidatlistesortering';
import { Table } from '@navikt/ds-react';

const ListeHeader: FunctionComponent = () => (
    <Table.Header className="liste-rad-innhold">
        <Table.Row>
            <Table.ColumnHeader sortable sortKey={KandidatlisteSorteringsfelt.OpprettetTidspunkt}>
                Dato opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortable sortKey={KandidatlisteSorteringsfelt.Tittel}>
                Navn på kandidatliste
            </Table.ColumnHeader>
            <Table.ColumnHeader sortable sortKey={KandidatlisteSorteringsfelt.AntallKandidater}>
                Antall kandidater
            </Table.ColumnHeader>
            <Table.ColumnHeader sortable sortKey={KandidatlisteSorteringsfelt.OpprettetAv}>
                Veileder
            </Table.ColumnHeader>
            <Table.HeaderCell scope="col">Finn kandidater</Table.HeaderCell>
            <Table.HeaderCell scope="col">Rediger</Table.HeaderCell>
            <Table.HeaderCell scope="col">Meny</Table.HeaderCell>
        </Table.Row>
    </Table.Header>
);

export default ListeHeader;
