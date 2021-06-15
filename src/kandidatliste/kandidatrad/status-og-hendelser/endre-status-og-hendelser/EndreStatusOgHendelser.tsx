import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { Kandidatstatus, LagtTilAv } from '../../../kandidatlistetyper';
import { statusToDisplayName } from '../../statusSelect/StatusSelect';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import RegistrerEllerFjernDelingAvCv from './RegistrerEllerFjernDelingAvCv';
import Hendelse from './Hendelse';
import RegistrerEllerFjernFåttJobben from './RegistrerEllerFjernFåttJobben';
import './EndreStatusOgHendelser.less';

type Props = {
    kandidatnummer: string;
    kandidatstatus: Kandidatstatus;
    onStatusChange: (status: Kandidatstatus) => void;
    utfall: Utfall;
    lagtTilAv: LagtTilAv;
    lagtTilTidspunkt: string;
};

const hentStatusbeskrivelse = (status: Kandidatstatus) => {
    return status === Kandidatstatus.Vurderes
        ? 'Settes automatisk når en kandidat legges i listen'
        : null;
};

const EndreStatusOgHendelser: FunctionComponent<Props> = ({
    kandidatnummer,
    kandidatstatus,
    onStatusChange,
    utfall,
    lagtTilAv,
    lagtTilTidspunkt,
}) => {
    const [status, setStatus] = useState(kandidatstatus);

    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    const cvDeltBeskrivelse = `Lagt til i listen av ${lagtTilAv.navn} (${
        lagtTilAv.ident
    }) ${new Date(lagtTilTidspunkt).toLocaleString('no-NB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })}`;

    return (
        <div className="endre-status-og-hendelser">
            <div className="endre-status-og-hendelser__velg-status">
                <RadioGruppe
                    className="endre-status-og-hendelser__statustittel"
                    legend="Velg status"
                >
                    {statuser.map(([statusKey, statusValue]) => {
                        const beskrivelse = hentStatusbeskrivelse(statusValue);

                        return (
                            <Radio
                                key={statusKey}
                                onChange={() => setStatus(statusValue)}
                                defaultChecked={statusValue === status}
                                label={
                                    <>
                                        <Normaltekst>
                                            {statusToDisplayName(statusValue)}
                                        </Normaltekst>
                                        {beskrivelse && (
                                            <Normaltekst className="endre-status-og-hendelser__statusbeskrivelse">
                                                {beskrivelse}
                                            </Normaltekst>
                                        )}
                                    </>
                                }
                                name={`kandidatstatus-${kandidatnummer}`}
                            />
                        );
                    })}
                </RadioGruppe>
                <Knapp onClick={onConfirmStatus} mini>
                    Lagre status
                </Knapp>
            </div>
            <div className="endre-status-og-hendelser__hendelser">
                <Undertittel>Hendelser</Undertittel>
                <ol className="endre-status-og-hendelser__hendelsesliste">
                    <Hendelse checked tittel="Ny kandidat" beskrivelse={cvDeltBeskrivelse} />
                    <Hendelse
                        checked={utfall === Utfall.FåttJobben || utfall === Utfall.Presentert}
                        tittel="CV-en er delt med arbeidsgiver"
                        beskrivelse={
                            utfall === Utfall.IkkePresentert ? 'Deles i kandidatlisten' : undefined
                        }
                    >
                        <RegistrerEllerFjernDelingAvCv utfall={utfall} />
                    </Hendelse>
                    <Hendelse checked={utfall === Utfall.FåttJobben}>
                        <RegistrerEllerFjernFåttJobben utfall={utfall} />
                    </Hendelse>
                </ol>
            </div>
        </div>
    );
};

export default EndreStatusOgHendelser;
