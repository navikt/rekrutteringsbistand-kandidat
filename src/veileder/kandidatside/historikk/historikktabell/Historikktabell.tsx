import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../historikkReducer';
import './Historikktabell.less';
import { Historikkrad } from './Historikkrad/Historikkrad';

interface Props {
    kandidatlister: KandidatlisteForKandidat[];
    aktivKandidatlisteId: string | null;
}

export const Historikktabell: FunctionComponent<Props> = ({
    kandidatlister,
    aktivKandidatlisteId,
}) => (
    <table className="historikktabell tabell tabell--stripet">
        <thead>
            <tr>
                <th>Lagt i listen</th>
                <th>Navn på kandidatliste</th>
                <th>Arbeidsgiver</th>
                <th>Lagt til av</th>
                <th>Status</th>
                <th>Utfall</th>
                <th>Stilling</th>
            </tr>
        </thead>
        <tbody>
            {kandidatlister.map((liste) => (
                <Historikkrad kandidatliste={liste} aktiv={liste.uuid === aktivKandidatlisteId} />
            ))}
        </tbody>
    </table>
);
