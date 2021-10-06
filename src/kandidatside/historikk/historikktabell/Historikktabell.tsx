import React, { FunctionComponent } from 'react';
import { KandidatlisteForKandidat } from '../historikkReducer';
import './Historikktabell.less';
import { Historikkrad } from './Historikkrad/Historikkrad';
import { ForespørselOmDelingAvCv } from '../../../kandidatliste/knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

interface Props {
    kandidatlister: KandidatlisteForKandidat[];
    aktivKandidatlisteId: string | null;
    forespørslerOmDelingAvCvForKandidat: ForespørselOmDelingAvCv[];
}

export const Historikktabell: FunctionComponent<Props> = ({
    kandidatlister,
    aktivKandidatlisteId,
    forespørslerOmDelingAvCvForKandidat,
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
                />
            ))}
        </tbody>
    </table>
);

export const finnForespørselOmDelingAvCv = (
    forespørslerOmDelingAvCv: ForespørselOmDelingAvCv[],
    kandidatliste: KandidatlisteForKandidat
) => forespørslerOmDelingAvCv.find(
        (forespørsel) => forespørsel.stillingsId === kandidatliste.stillingId
    );

