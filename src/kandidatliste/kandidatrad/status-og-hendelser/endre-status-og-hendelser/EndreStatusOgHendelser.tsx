import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Kandidat, Kandidatstatus } from '../../../domene/Kandidat';
import Hendelse from './Hendelse';
import { datoformatNorskLang } from '../../../../utils/dateUtils';
import DelingAvCvForKandidat from './DelingAvCvForKandidat';
import FåttJobbenForKandidat from './FåttJobbenForKandidat';
import { statusToDisplayName } from '../etiketter/StatusEtikett';
import './EndreStatusOgHendelser.less';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
    onStatusChange: (status: Kandidatstatus) => void;
    kandidatlistenErKobletTilStilling: boolean;
};

const hentStatusbeskrivelse = (status: Kandidatstatus) => {
    return status === Kandidatstatus.Vurderes
        ? 'Settes automatisk når en kandidat legges i listen'
        : null;
};

const EndreStatusOgHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatlisteId,
    onStatusChange,
    kandidatlistenErKobletTilStilling,
}) => {
    const [status, setStatus] = useState(kandidat.status);

    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    const cvDeltBeskrivelse = `Lagt til i listen av ${kandidat.lagtTilAv.navn} (${
        kandidat.lagtTilAv.ident
    }) ${datoformatNorskLang(kandidat.lagtTilTidspunkt)}`;

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
                                        {beskrivelse && <Undertekst>{beskrivelse}</Undertekst>}
                                    </>
                                }
                                name={`kandidatstatus-${kandidat.kandidatnr}`}
                            />
                        );
                    })}
                </RadioGruppe>
                <Knapp onClick={onConfirmStatus} mini>
                    Lagre status
                </Knapp>
            </div>
            {kandidatlistenErKobletTilStilling && (
                <div className="endre-status-og-hendelser__hendelser">
                    <Undertittel>Hendelser</Undertittel>
                    <ol className="endre-status-og-hendelser__hendelsesliste">
                        <Hendelse checked tittel="Ny kandidat" beskrivelse={cvDeltBeskrivelse} />
                        <DelingAvCvForKandidat
                            kanEndre
                            kandidatlisteId={kandidatlisteId}
                            kandidat={kandidat}
                        />
                        <FåttJobbenForKandidat
                            kanEndre
                            kandidatlisteId={kandidatlisteId}
                            kandidat={kandidat}
                        />
                    </ol>
                </div>
            )}
        </div>
    );
};

export default EndreStatusOgHendelser;
