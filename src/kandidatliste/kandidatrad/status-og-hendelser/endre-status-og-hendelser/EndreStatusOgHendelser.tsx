import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Kandidat, Kandidatstatus } from '../../../domene/Kandidat';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import DelStillingMedKandidat from '../hendelser/DelStillingMedKandidat';
import { statusToDisplayName } from '../etiketter/StatusEtikett';
import { erIkkeProd } from '../../../../utils/featureToggleUtils';
import { ForespørselOmDelingAvCv } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Nettressurs, Nettstatus } from '../../../../api/Nettressurs';
import NyKandidat from '../hendelser/NyKandidat';
import SvarFraKandidat from '../hendelser/SvarFraKandidat';
import DelStillingMedKandidatPåNytt from '../hendelser/DelStillingMedKandidatPåNytt';
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
    const [visStegForÅDelePåNytt, setVisStegForÅDelePåNytt] = useState(false);

    // TODO: Lytt til resendForespørsel og skjul steg for å dele på nytt ved suksess.

    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    const onDelPåNyttClick = () => {
        setVisStegForÅDelePåNytt(true);
    };

    const onDelPåNyttLukk = () => {
        setVisStegForÅDelePåNytt(false);
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
                        <NyKandidat kandidat={kandidat} />
                        {erIkkeProd && (
                            <DelStillingMedKandidat
                                forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                            />
                        )}
                        {erIkkeProd && (
                            <SvarFraKandidat
                                kanEndre
                                forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                                onDelPåNyttClick={onDelPåNyttClick}
                            />
                        )}
                        {erIkkeProd &&
                            visStegForÅDelePåNytt &&
                            forespørselOmDelingAvCv.kind === Nettstatus.Suksess && (
                                <DelStillingMedKandidatPåNytt
                                    forespørselOmDelingAvCv={forespørselOmDelingAvCv.data}
                                    onLukk={onDelPåNyttLukk}
                                />
                            )}
                        <DelCvMedArbeidsgiver
                            kanEndre
                            kandidatlisteId={kandidatlisteId}
                            kandidat={kandidat}
                        />
                        <HarFåttJobben
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
