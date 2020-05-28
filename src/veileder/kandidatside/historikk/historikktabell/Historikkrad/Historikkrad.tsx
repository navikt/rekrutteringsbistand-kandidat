import moment from 'moment';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../../../application/paths';
import { Statusvisning } from '../../../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { utfallToString } from '../../../../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import Lenke from 'nav-frontend-lenker';
import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../../historikkReducer';
import './Historikkrad.less';
import { Undertekst } from 'nav-frontend-typografi';

interface Props {
    kandidatliste: KandidatlisteForKandidat;
    aktiv: boolean;
}

export const Historikkrad: FunctionComponent<Props> = ({ kandidatliste, aktiv }) => {
    const listenavn = kandidatliste.slettet ? (
        <>
            {kandidatliste.tittel}{' '}
            <Undertekst tag="span" className="historikkrad__slettet">
                (slettet)
            </Undertekst>
        </>
    ) : (
        <Link className="lenke" to={lenkeTilKandidatliste(kandidatliste.uuid)}>
            {kandidatliste.tittel}
        </Link>
    );
    return (
        <tr
            key={kandidatliste.uuid}
            className={'historikkrad ' + (aktiv ? 'tabell__tr--valgt' : '')}
        >
            <td>{moment(kandidatliste.lagtTilTidspunkt).format('DD.MM.YYYY')}</td>
            <td>{listenavn}</td>
            <td>{kandidatliste.organisasjonNavn}</td>
            <td>
                {kandidatliste.lagtTilAvNavn} ({kandidatliste.lagtTilAvIdent})
            </td>
            <td>
                <Statusvisning status={kandidatliste.status} />
            </td>
            <td className="historikkrad__utfall">{utfallToString(kandidatliste.utfall)}</td>
            <td className="historikkrad__stilling">
                {!kandidatliste.slettet && kandidatliste.stillingId && (
                    <Lenke href={lenkeTilStilling(kandidatliste.stillingId)}>Se stilling</Lenke>
                )}
            </td>
        </tr>
    );
};
