import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { KandidatIKandidatliste, Kandidatstatus } from '../../../kandidatlistetyper';
import { statusToDisplayName } from '../../statusSelect/StatusSelect';
import Hendelse from './Hendelse';
import FåttJobben from './FåttJobben';
import DelingAvCv from './DelingAvCv';
import './EndreStatusOgHendelser.less';
import { datoformatNorskLang } from '../../../../utils/dateUtils';

type Props = {
    kandidat: KandidatIKandidatliste;
    kandidatlisteId: string;
    onStatusChange: (status: Kandidatstatus) => void;
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
                                        {beskrivelse && (
                                            <Normaltekst className="endre-status-og-hendelser__statusbeskrivelse">
                                                {beskrivelse}
                                            </Normaltekst>
                                        )}
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
            <div className="endre-status-og-hendelser__hendelser">
                <Undertittel>Hendelser</Undertittel>
                <ol className="endre-status-og-hendelser__hendelsesliste">
                    <Hendelse checked tittel="Ny kandidat" beskrivelse={cvDeltBeskrivelse} />
                    <DelingAvCv
                        erRedigerbar
                        utfall={kandidat.utfall}
                        kandidatnummer={kandidat.kandidatnr}
                        kandidatlisteId={kandidatlisteId}
                    />
                    <FåttJobben
                        erRedigerbar
                        navn={`${kandidat.fornavn} ${kandidat.etternavn}`}
                        utfall={kandidat.utfall}
                        kandidatnummer={kandidat.kandidatnr}
                        kandidatlisteId={kandidatlisteId}
                    />
                </ol>
            </div>
        </div>
    );
};

export default EndreStatusOgHendelser;
