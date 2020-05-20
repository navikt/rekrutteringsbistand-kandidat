import moment from 'moment';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../application/paths';
import { Statusvisning } from '../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { utfallToString } from '../../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import Lenke from 'nav-frontend-lenker';
import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from './historikkReducer';

interface Props {
    kandidatlister: KandidatlisteForKandidat[];
}

export const HistorikktabellDesktop: FunctionComponent<Props> = ({ kandidatlister }) => (
    <table className="tabell tabell--stripet">
        <thead>
            <th>Lagt i listen</th>
            <th>Navn på kandidatliste</th>
            <th>Arbeidsgiver</th>
            <th>Lagt til av</th>
            <th>Status</th>
            <th>Utfall</th>
            <th>Stilling</th>
        </thead>
        <tbody>
            {kandidatlister.map((liste) => (
                <tr>
                    <td>{moment(liste.lagtTilTidspunkt).format('DD.MM YYYY')}</td>
                    <td>
                        <Link className="lenke" to={lenkeTilKandidatliste(liste.uuid)}>
                            {liste.tittel}
                        </Link>
                    </td>
                    <td>{liste.organisasjonNavn}</td>
                    <td>
                        {liste.lagtTilAvNavn} ({liste.lagtTilAvIdent})
                    </td>
                    <td>
                        <Statusvisning status={liste.status} />
                    </td>
                    <td>{utfallToString(liste.utfall)}</td>
                    <td>
                        {liste.stillingId && (
                            <Lenke href={lenkeTilStilling(liste.stillingId)}>Se stilling</Lenke>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);
