import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import { HjelpetekstMidt, HjelpetekstUnderVenstre } from 'nav-frontend-hjelpetekst';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import './KnappeRad.less';

type Props = {
    kandidater: KandidatIKandidatliste[];
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    onSendSmsClick: () => void;
    onKandidaterAngreArkivering: () => void;
    kanEditere: boolean;
    arbeidsgiver?: string;
    kandidatlisteId: string;
    stillingsId: string | null;
    children: ReactNode;
    visArkiverte: boolean;
};

const SmsKnapp: FunctionComponent = () => (
    <div className="kandidatlisteknapper__knapp">
        <i className="Sms__icon" />
        <span>Send SMS</span>
    </div>
);

const Epostknapp: FunctionComponent = () => (
    <div className="kandidatlisteknapper__knapp">
        <i className="Email__icon" />
        Kopier e-postadresser
    </div>
);

const Deleknapp: FunctionComponent = () => (
    <div className="kandidatlisteknapper__knapp">
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </div>
);

const Sletteknapp: FunctionComponent = () => (
    <div className="kandidatlisteknapper__knapp">
        <i className="Delete__icon" />
        <span>Angre sletting</span>
    </div>
);

const SmsKnappMedHjelpetekst: FunctionComponent = () => (
    <div className="Sms">
        <SmsKnapp />
    </div>
);

const EpostknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Email">
        <Epostknapp />
    </div>
);

const DeleknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Share">
        <Deleknapp />
    </div>
);

const SletteknappMedHjelpetekst: FunctionComponent = () => (
    <div className="Delete">
        <Sletteknapp />
    </div>
);

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    onKandidatShare,
    onEmailKandidater,
    onSendSmsClick,
    onKandidaterAngreArkivering,
    kanEditere,
    arbeidsgiver,
    children,
    stillingsId,
    visArkiverte,
}) => {
    const skalViseSendSms = kanEditere && stillingsId && !visArkiverte;

    const markerteKandidater = kandidater.filter((kandidat) => kandidat.markert);
    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const minstEnKandidatHarIkkeFåttSms = markerteKandidater.some((kandidat) => !kandidat.sms);

    return (
        <div className="kandidatlisteknapper">
            <div className="kandidatlisteknapper__venstre">{children}</div>
            <div className="kandidatlisteknapper__høyre">
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
                {!visArkiverte &&
                    (minstEnKandidatErMarkert ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onEmailKandidater} className="Email">
                                <Epostknapp />
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstUnderVenstre
                            id="marker-kandidater-epost-hjelpetekst"
                            anchor={EpostknappMedHjelpetekst}
                            tittel="Send e-post til de markerte kandidatene"
                        >
                            Du må huke av for kandidatene du ønsker å kopiere e-postadressen til.
                        </HjelpetekstUnderVenstre>
                    ))}
                {kanEditere &&
                    !visArkiverte &&
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
                {visArkiverte &&
                    (minstEnKandidatErMarkert ? (
                        <div className="hjelpetekst">
                            <Lenkeknapp onClick={onKandidaterAngreArkivering} className="Delete">
                                <Sletteknapp />
                            </Lenkeknapp>
                        </div>
                    ) : (
                        <HjelpetekstUnderVenstre
                            id="marker-kandidater-angre-arkivering-hjelpetekst"
                            anchor={SletteknappMedHjelpetekst}
                            tittel="Angre sletting for de markerte kandidatene"
                        >
                            Du må huke av for kandidatene du ønsker å angre sletting for.
                        </HjelpetekstUnderVenstre>
                    ))}
            </div>
        </div>
    );
};

export default KnappeRad;
