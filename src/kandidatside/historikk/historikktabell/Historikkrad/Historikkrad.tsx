import moment from 'moment';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../../../app/paths';
import { Statusvisning } from '../../../../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../../historikkReducer';
import './Historikkrad.less';
import { Undertekst } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../../../../kandidatliste/kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';

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
            <td className="historikkrad__utfall">{utfallToDisplayName(kandidatliste.utfall)}</td>
            <td className="historikkrad__stilling">
                {!kandidatliste.slettet && kandidatliste.stillingId && (
                    <Link to={lenkeTilStilling(kandidatliste.stillingId)} className="lenke">
                        Se stilling
                    </Link>
                )}
            </td>
        </tr>
    );
};
