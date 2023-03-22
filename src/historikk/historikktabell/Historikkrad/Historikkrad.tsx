import React, { FunctionComponent, ReactNode } from 'react';
import classNames from 'classnames';
import { LinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Detail, Table } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { capitalizeEmployerName } from '../../../kandidatsøk/utils';
import { ForespørselOmDelingAvCv } from '../../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { KandidatlisteForKandidat } from '../../historikkReducer';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../../app/paths';
import { Sms } from '../../../kandidatliste/domene/Kandidatressurser';
import Hendelsesetikett from '../../../kandidatliste/kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import StatusEtikett from '../../../kandidatliste/kandidatrad/status-og-hendelser/etiketter/StatusEtikett';
import css from './Historikkrad.module.css';

interface Props {
    kandidatliste: KandidatlisteForKandidat;
    aktiv: boolean;
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
    sms?: Sms;
}

export const Historikkrad: FunctionComponent<Props> = ({
    kandidatliste,
    aktiv,
    forespørselOmDelingAvCv,
    sms,
}) => {
    const listenavn = kandidatliste.slettet ? (
        <>
            <BodyShort as="span">{kandidatliste.tittel} </BodyShort>
            <Detail as="span" className={css.slettet}>
                (slettet)
            </Detail>
        </>
    ) : (
        <Lenke to={lenkeTilKandidatliste(kandidatliste.uuid)}>{kandidatliste.tittel}</Lenke>
    );

    return (
        <Table.Row shadeOnHover={false} selected={aktiv} key={kandidatliste.uuid}>
            <Table.DataCell>
                {moment(kandidatliste.lagtTilTidspunkt).format('DD.MM.YYYY')}
            </Table.DataCell>
            <Table.DataCell>{listenavn}</Table.DataCell>
            <Table.DataCell>
                {kandidatliste.organisasjonNavn
                    ? capitalizeEmployerName(kandidatliste.organisasjonNavn)
                    : ''}
            </Table.DataCell>
            <Table.DataCell>
                {kandidatliste.lagtTilAvNavn} ({kandidatliste.lagtTilAvIdent})
            </Table.DataCell>
            <Table.DataCell>
                <div className={css.statusOgHendelser}>
                    <StatusEtikett status={kandidatliste.status} />
                    <Hendelsesetikett
                        utfall={kandidatliste.utfall}
                        utfallsendringer={kandidatliste.utfallsendringer}
                        forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                        sms={sms}
                    />
                </div>
            </Table.DataCell>
            <Table.DataCell className="historikkrad__stilling">
                {!kandidatliste.slettet && kandidatliste.stillingId && (
                    <Lenke to={lenkeTilStilling(kandidatliste.stillingId)}>Se stilling</Lenke>
                )}
            </Table.DataCell>
        </Table.Row>
    );
};

const Lenke = ({ to, children }: { to: string; children: ReactNode }) => (
    <Link to={to} className={classNames(css.lenke, 'navds-link')}>
        {children}
        <LinkIcon />
    </Link>
);
