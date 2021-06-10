import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { Kandidatstatus } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';
import './EndreStatusOgHendelser.less';

type Props = {
    kandidatnummer: string;
    kandidatstatus: Kandidatstatus;
    onStatusChange: (status: Kandidatstatus) => void;
    utfall: Utfall;
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
}) => {
    const [status, setStatus] = useState(kandidatstatus);

    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    return (
        <div className="endre-status-og-hendelser">
            <RadioGruppe className="endre-status-og-hendelser__statustittel" legend="Velg status">
                {statuser.map(([statusKey, statusValue]) => {
                    const beskrivelse = hentStatusbeskrivelse(statusValue);

                    if (status === statusValue) {
                        console.log('Default verdi skal være', status);
                    }

                    return (
                        <Radio
                            key={statusKey}
                            onChange={() => setStatus(statusValue)}
                            defaultChecked={statusValue === status}
                            label={
                                <>
                                    <Normaltekst>{statusToDisplayName(statusValue)}</Normaltekst>
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
    );
};

export default EndreStatusOgHendelser;
