import React, { FunctionComponent, useState } from 'react';
import moment from 'moment';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Kandidatstatus, LagtTilAv } from '../../../kandidatlistetyper';
import { statusToDisplayName } from '../../statusSelect/StatusSelect';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Hendelse from './Hendelse';
import './EndreStatusOgHendelser.less';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';

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
                <ul className="endre-status-og-hendelser__hendelsesliste">
                    <Hendelse
                        checked
                        tittel="Ny kandidat"
                        beskrivelse={`Lagt til i listen av ${lagtTilAv.navn} (${
                            lagtTilAv.ident
                        }) ${formaterTidspunkt(lagtTilTidspunkt)}`}
                    />
                    <Hendelse
                        checked={utfall === Utfall.FåttJobben || utfall === Utfall.Presentert}
                        tittel="CV-en er delt med arbeidsgiver"
                        beskrivelse={
                            utfall === Utfall.IkkePresentert ? 'Deles i kandidatlisten' : undefined
                        }
                    >
                        {utfall === Utfall.IkkePresentert ? (
                            <Flatknapp
                                className="endre-status-og-hendelser__registrer-hendelse"
                                kompakt
                                mini
                            >
                                <AddCircle />
                                Registrer manuelt
                            </Flatknapp>
                        ) : (
                            <Flatknapp
                                className="endre-status-og-hendelser__registrer-hendelse"
                                kompakt
                                mini
                            >
                                <MinusCircle />
                                Fjern registrering
                            </Flatknapp>
                        )}
                    </Hendelse>
                    <Hendelse checked={utfall === Utfall.FåttJobben}>
                        {utfall === Utfall.FåttJobben ? (
                            <Flatknapp
                                className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
                                kompakt
                                mini
                            >
                                <MinusCircle />
                                Fjern registrering
                            </Flatknapp>
                        ) : (
                            <Flatknapp
                                className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
                                kompakt
                                mini
                            >
                                <AddCircle />
                                Registrer at kandidaten har fått jobb
                            </Flatknapp>
                        )}
                    </Hendelse>
                </ul>
            </div>
        </div>
    );
};

const formaterTidspunkt = (tidspunkt: string) => {
    return moment(tidspunkt).format('DD.MM.YYYY'); // TODO: Format skal være '26. mars 2021'
};

export default EndreStatusOgHendelser;
