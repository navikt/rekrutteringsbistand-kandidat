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
import { erIkkeProd } from '../../../../utils/featureToggleUtils';
import {
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import './EndreStatusOgHendelser.less';

type Props = {
    kandidat: Kandidat;
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
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
    forespørselOmDelingAvCv,
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
                        {erIkkeProd &&
                            (forespørselOmDelingAvCv.kind === Nettstatus.Suksess ||
                                forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) && (
                                <Hendelse
                                    checked={forespørselOmDelingAvCv.kind === Nettstatus.Suksess}
                                    tittel="Stillingen er delt med kandidaten"
                                    beskrivelse="2. april 2021 av Ola Nordmann (N121212)" // TODO: "Deles fra kandidatlisten" hvis ikke delt ennå
                                />
                            )}
                        {erIkkeProd &&
                            (forespørselOmDelingAvCv.kind === Nettstatus.Suksess ||
                                forespørselOmDelingAvCv.kind === Nettstatus.FinnesIkke) && (
                                <Hendelse
                                    checked={
                                        forespørselOmDelingAvCv.kind === Nettstatus.Suksess &&
                                        forespørselOmDelingAvCv.data.svar !==
                                            SvarPåDelingAvCv.IkkeSvart
                                    }
                                    tittel={`Svar fra kandidat: Ja, del CV-en min`} // TODO: Tre cases: Har ikke svart, har svart ja, har svart nei
                                    beskrivelse="3. april 2021 hentet fra aktivitetsplanen" // TODO: "Hentes automatisk fra aktivitetsplan" hvis ikke svart ennå
                                />
                            )}
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
