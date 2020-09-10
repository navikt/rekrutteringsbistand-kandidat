import React, { FunctionComponent, ReactNode } from 'react';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import MedPopover from '../../../felles/common/med-popover/MedPopover';
import { PopoverOrientering } from 'nav-frontend-popover';
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

const Sletteknapp: FunctionComponent = () => (
    <>
        <i className="Delete__icon" />
        <span>Angre sletting</span>
    </>
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

    const markerteKandidater = kandidater.filter((kandidat) => kandidat.tilstand.markert);
    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const minstEnKandidatHarIkkeFåttSms = markerteKandidater.some((kandidat) => !kandidat.sms);

    return (
        <div className="kandidatlisteknapper">
            <div className="kandidatlisteknapper__venstre">{children}</div>
            <div className="kandidatlisteknapper__høyre">
                {skalViseSendSms &&
                    (minstEnKandidatErMarkert && minstEnKandidatHarIkkeFåttSms ? (
                        <Lenkeknapp
                            onClick={onSendSmsClick}
                            className="kandidatlisteknapper__knapp Sms"
                        >
                            <SmsKnapp />
                        </Lenkeknapp>
                    ) : (
                        <MedPopover
                            tittel="Send SMS til de markerte kandidatene"
                            hjelpetekst={
                                minstEnKandidatErMarkert
                                    ? 'Du har allerede sendt SMS til alle markerte kandidater.'
                                    : 'Du må huke av for kandidatene du ønsker å sende SMS til.'
                            }
                        >
                            <Lenkeknapp className="kandidatlisteknapper__knapp Sms">
                                <SmsKnapp />
                            </Lenkeknapp>
                        </MedPopover>
                    ))}
                {!visArkiverte &&
                    (minstEnKandidatErMarkert ? (
                        <Lenkeknapp
                            onClick={onEmailKandidater}
                            className="kandidatlisteknapper__knapp Email"
                        >
                            <Epostknapp />
                        </Lenkeknapp>
                    ) : (
                        <MedPopover
                            hjelpetekst="Du må huke av for kandidatene du ønsker å kopiere e-postadressen til."
                            tittel="Send e-post til de markerte kandidatene"
                        >
                            <Lenkeknapp className="kandidatlisteknapper__knapp Email">
                                <Epostknapp />
                            </Lenkeknapp>
                        </MedPopover>
                    ))}
                {kanEditere &&
                    !visArkiverte &&
                    arbeidsgiver &&
                    (minstEnKandidatErMarkert ? (
                        <Lenkeknapp
                            onClick={onKandidatShare}
                            className="kandidatlisteknapper__knapp Share"
                        >
                            <Deleknapp />
                        </Lenkeknapp>
                    ) : (
                        <MedPopover
                            hjelpetekst="Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver."
                            tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                        >
                            <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                                <Deleknapp />
                            </Lenkeknapp>
                        </MedPopover>
                    ))}
                {visArkiverte &&
                    (minstEnKandidatErMarkert ? (
                        <Lenkeknapp
                            onClick={onKandidaterAngreArkivering}
                            className="kandidatlisteknapper__knapp Delete"
                        >
                            <Sletteknapp />
                        </Lenkeknapp>
                    ) : (
                        <MedPopover
                            orientering={PopoverOrientering.UnderVenstre}
                            hjelpetekst="Du må huke av for kandidatene du ønsker å angre sletting for."
                            tittel="Angre sletting for de markerte kandidatene"
                        >
                            <Lenkeknapp className="kandidatlisteknapper__knapp Delete">
                                <Sletteknapp />
                            </Lenkeknapp>
                        </MedPopover>
                    ))}
            </div>
        </div>
    );
};

export default KnappeRad;
