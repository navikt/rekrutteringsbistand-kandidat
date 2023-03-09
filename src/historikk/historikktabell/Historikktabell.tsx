import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../historikkReducer';
import { Historikkrad } from './Historikkrad/Historikkrad';
import { ForespørselOmDelingAvCv } from '../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Sms } from '../../kandidatliste/domene/Kandidatressurser';
import './Historikktabell.less';

interface Props {
    kandidatlister: KandidatlisteForKandidat[];
    aktivKandidatlisteId: string | null;
    forespørslerOmDelingAvCvForKandidat: Nettressurs<ForespørselOmDelingAvCv[]>;
    smser: Nettressurs<Sms[]>;
}

export const Historikktabell: FunctionComponent<Props> = ({
    kandidatlister,
    aktivKandidatlisteId,
    forespørslerOmDelingAvCvForKandidat,
    smser,
}) => (
    <table className="historikktabell tabell tabell--stripet">
        <thead>
            <tr>
                <th>Lagt i listen</th>
                <th>Navn på kandidatliste</th>
                <th>Arbeidsgiver</th>
                <th>Lagt til av</th>
                <th>Status/hendelser</th>
                <th>Stilling</th>
            </tr>
        </thead>
        <tbody>
            {kandidatlister.map((liste) => (
                <Historikkrad
                    key={liste.uuid}
                    kandidatliste={liste}
                    aktiv={liste.uuid === aktivKandidatlisteId}
                    forespørselOmDelingAvCv={finnForespørselOmDelingAvCv(
                        forespørslerOmDelingAvCvForKandidat,
                        liste
                    )}
                    sms={finnSms(smser, liste.uuid)}
                />
            ))}
        </tbody>
    </table>
);

export const finnForespørselOmDelingAvCv = (
    forespørslerOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv[]>,
    kandidatliste: KandidatlisteForKandidat
) => {
    if (forespørslerOmDelingAvCv.kind !== Nettstatus.Suksess) {
        return undefined;
    }

    return forespørslerOmDelingAvCv.data.find(
        (forespørsel) => forespørsel.stillingsId === kandidatliste.stillingId
    );
};

const finnSms = (sms: Nettressurs<Sms[]>, kandidatlisteId: string) => {
    if (sms.kind !== Nettstatus.Suksess) {
        return undefined;
    }
    return sms.data.find((sms) => sms.kandidatlisteId === kandidatlisteId);
};
