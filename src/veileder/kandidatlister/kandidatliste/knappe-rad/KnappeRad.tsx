import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';

type Props = {
    kandidater: KandidatIKandidatliste[];
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    onSendSmsClick: () => void;
    kanEditere: boolean;
    arbeidsgiver?: string;
    kandidatlisteId: string;
    stillingsId: string | null;
    children: ReactNode;
    visSendSms?: boolean;
};

const SmsKnapp: FunctionComponent = () => (
    <>
        <i className="Sms__icon" />
        <span>Send SMS</span>
    </>
);

const Epostknapp: FunctionComponent = () => (
    <>
        <i className="Email__icon" />
        Kopier e-postadresser
    </>
);

const Deleknapp: FunctionComponent = () => (
    <>
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </>
);

const SmsKnappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Sms">
        <SmsKnapp />
    </div>
);

const EpostknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Email">
        <Epostknapp />
    </div>
);

const DeleknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Lenkeknapp typo-normal Share">
        <Deleknapp />
    </div>
);

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    onKandidatShare,
    onEmailKandidater,
    onSendSmsClick,
    kanEditere,
    arbeidsgiver,
    children,
    stillingsId,
    visSendSms,
}) => {
    const skalViseSendSms = visSendSms && kanEditere && stillingsId;

    const markerteKandidater = kandidater.filter(kandidat => kandidat.markert);
    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const minstEnKandidatHarIkkeFåttSms = markerteKandidater.some(kandidat => !kandidat.sms);

    return (
        <div className="Kandidatliste__knapperad">
            <div className="knapper-venstre">{children}</div>
            <div className="dele-wrapper">
                {skalViseSendSms &&
                    (minstEnKandidatErMarkert && minstEnKandidatHarIkkeFåttSms ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onSendSmsClick} className="Sms">
                                <SmsKnapp />
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstMidt
                            id="marker-kandidater-sms-hjelpetekst"
                            anchor={SmsKnappMedHjelpetekst}
                            tittel="Send SMS til de markerte kandidatene"
                        >
                            {minstEnKandidatErMarkert
                                ? 'Du har allerede sendt SMS til alle markerte kandidater.'
                                : 'Du må huke av for kandidatene du ønsker å sende SMS til.'}
                        </HjelpetekstMidt>
                    ))}
                {minstEnKandidatErMarkert ? (
                    <div className="hjelpetekst">
                        <Lenkeknapp onClick={onEmailKandidater} className="Email">
                            <Epostknapp />
                        </Lenkeknapp>
                    </div>
                ) : (
                    <HjelpetekstMidt
                        id="marker-kandidater-epost-hjelpetekst"
                        anchor={EpostknappMedHjelpetekst}
                        tittel="Send e-post til de markerte kandidatene"
                    >
                        Du må huke av for kandidatene du ønsker å kopiere e-postadressen til.
                    </HjelpetekstMidt>
                )}
                {kanEditere &&
                    arbeidsgiver &&
                    (minstEnKandidatErMarkert ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onKandidatShare} className="Share">
                                <Deleknapp />
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstMidt
                            id="marker-kandidater-presentere-hjelpetekst"
                            anchor={DeleknappMedHjelpetekst}
                            tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                        >
                            Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver.
                        </HjelpetekstMidt>
                    ))}
            </div>
        </div>
    );
};

export default KnappeRad;
