import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Kandidat, Kandidatstatus } from '../../../domene/Kandidat';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import { statusToDisplayName } from '../etiketter/StatusEtikett';
import { ForespørslerForKandidatForStilling } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Nettressurs } from '../../../../api/Nettressurs';
import NyKandidat from '../hendelser/NyKandidat';
import ForespørslerOgSvar from '../hendelser/forespørsler-og-svar/ForespørslerOgSvar';
import './EndreStatusOgHendelser.less';
import {
    kandidaterMåGodkjenneDelingAvCv,
    Kandidatliste,
    Stillingskategori,
} from '../../../domene/Kandidatliste';
import { Sms } from '../../../domene/Kandidatressurser';
import SmsSendt from '../hendelser/SmsSendt';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    forespørselOmDelingAvCv: Nettressurs<ForespørslerForKandidatForStilling>;
    sms?: Sms;
    onStatusChange: (status: Kandidatstatus) => void;
};

const hentStatusbeskrivelse = (status: Kandidatstatus) => {
    return status === Kandidatstatus.Vurderes
        ? 'Settes automatisk når en kandidat legges i listen'
        : null;
};

const EndreStatusOgHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    forespørselOmDelingAvCv,
    sms,
    onStatusChange,
}) => {
    const [status, setStatus] = useState(kandidat.status);
    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    const visHendelser =
        kandidaterMåGodkjenneDelingAvCv(kandidatliste) ||
        kandidatliste.stillingskategori === Stillingskategori.Formidling ||
        kandidatliste.stillingskategori === Stillingskategori.Jobbmesse;
    let className = 'endre-status-og-hendelser';
    if (visHendelser) className += ' endre-status-og-hendelser--med-makshøyde';

    const erStillingEllerFormidling =
        kandidatliste.stillingskategori === Stillingskategori.Stilling ||
        kandidatliste.stillingskategori === Stillingskategori.Formidling;

    return (
        <div className={className}>
            <div className="endre-status-og-hendelser__velg-status">
                <RadioGruppe
                    className="endre-status-og-hendelser__statustittel blokk-xs"
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
            {visHendelser && (
                <div className="endre-status-og-hendelser__hendelser">
                    <Undertittel>Hendelser</Undertittel>
                    <ol className="endre-status-og-hendelser__hendelsesliste">
                        <NyKandidat kandidat={kandidat} />
                        <SmsSendt sms={sms} />
                        {erStillingEllerFormidling && (
                            <>
                                <ForespørslerOgSvar forespørsler={forespørselOmDelingAvCv} />
                                <DelCvMedArbeidsgiver
                                    kanEndre
                                    kandidatlisteId={kandidatliste.kandidatlisteId}
                                    kandidat={kandidat}
                                />
                                <HarFåttJobben
                                    kanEndre
                                    kandidatlisteId={kandidatliste.kandidatlisteId}
                                    kandidat={kandidat}
                                />
                            </>
                        )}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default EndreStatusOgHendelser;
