import moment from 'moment';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../../application/paths';
import { Statusvisning } from '../../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { utfallToString } from '../../../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import Lenke from 'nav-frontend-lenker';
import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../historikkReducer';
import './Historikktabell.less';
import { Historikkrad } from './Historikkrad';

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
