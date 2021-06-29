import React, { FunctionComponent, ReactNode } from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import { KandidatIKandidatliste, Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import MedPopover from '../../common/med-popover/MedPopover';
import { erIkkeProd } from '../../utils/featureToggleUtils';
import ForespørselOmDelingAvCv from './forespørsel-om-deling-av-cv/ForespørselOmDelingAvCv';
import './KnappeRad.less';

type Props = {
    kandidater: KandidatIKandidatliste[];
    kandidatliste: Kandidatliste;
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    onSendSmsClick: () => void;
    onKandidaterAngreArkivering: () => void;
    visArkiverte: boolean;
    children: ReactNode;
};

const KnappeRad: FunctionComponent<Props> = ({
    kandidater,
    kandidatliste,
    onKandidatShare,
    onEmailKandidater,
    onSendSmsClick,
    onKandidaterAngreArkivering,
    children,
    visArkiverte,
}) => {
    const skalViseSendSms = kandidatliste.kanEditere && kandidatliste.stillingId && !visArkiverte;

    const markerteKandidater = kandidater.filter((kandidat) => kandidat.tilstand.markert);
    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const minstEnKandidatHarIkkeFåttSms = markerteKandidater.some((kandidat) => !kandidat.sms);

    return (
        <div className="kandidatlisteknapper">
            <div className="kandidatlisteknapper__venstre">{children}</div>
            {kandidatliste.status === Kandidatlistestatus.Åpen && (
                <div className="kandidatlisteknapper__høyre">
                    {skalViseSendSms &&
                        (minstEnKandidatErMarkert && minstEnKandidatHarIkkeFåttSms ? (
                            <Lenkeknapp
                                onClick={onSendSmsClick}
                                className="kandidatlisteknapper__knapp Sms"
                            >
                                <SmsIkon />
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
                                    <SmsIkon />
                                </Lenkeknapp>
                            </MedPopover>
                        ))}
                    {!visArkiverte &&
                        (minstEnKandidatErMarkert ? (
                            <Lenkeknapp
                                onClick={onEmailKandidater}
                                className="kandidatlisteknapper__knapp Email"
                            >
                                <EpostIkon />
                            </Lenkeknapp>
                        ) : (
                            <MedPopover
                                hjelpetekst="Du må huke av for kandidatene du ønsker å kopiere e-postadressen til."
                                tittel="Send e-post til de markerte kandidatene"
                            >
                                <Lenkeknapp className="kandidatlisteknapper__knapp Email">
                                    <EpostIkon />
                                </Lenkeknapp>
                            </MedPopover>
                        ))}
                    {erIkkeProd && kandidatliste.kanEditere && !visArkiverte && (
                        <ForespørselOmDelingAvCv />
                    )}
                    {kandidatliste.kanEditere &&
                        !visArkiverte &&
                        kandidatliste.organisasjonNavn &&
                        (minstEnKandidatErMarkert ? (
                            <Lenkeknapp
                                onClick={onKandidatShare}
                                className="kandidatlisteknapper__knapp Share"
                            >
                                <DeleIkon />
                            </Lenkeknapp>
                        ) : (
                            <MedPopover
                                hjelpetekst="Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver."
                                tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                            >
                                <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                                    <DeleIkon />
                                </Lenkeknapp>
                            </MedPopover>
                        ))}
                    {visArkiverte &&
                        (minstEnKandidatErMarkert ? (
                            <Lenkeknapp
                                onClick={onKandidaterAngreArkivering}
                                className="kandidatlisteknapper__knapp Delete"
                            >
                                <SletteIkon />
                            </Lenkeknapp>
                        ) : (
                            <MedPopover
                                orientering={PopoverOrientering.UnderVenstre}
                                hjelpetekst="Du må huke av for kandidatene du ønsker å angre sletting for."
                                tittel="Angre sletting for de markerte kandidatene"
                            >
                                <Lenkeknapp className="kandidatlisteknapper__knapp Delete">
                                    <SletteIkon />
                                </Lenkeknapp>
                            </MedPopover>
                        ))}
                </div>
            )}
        </div>
    );
};

const SmsIkon: FunctionComponent = () => (
    <>
        <i className="Sms__icon" />
        <span>Send SMS</span>
    </>
);

const EpostIkon: FunctionComponent = () => (
    <>
        <i className="Email__icon" />
        Kopier e-postadresser
    </>
);

const DeleIkon: FunctionComponent = () => (
    <>
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </>
);

const SletteIkon: FunctionComponent = () => (
    <>
        <i className="Delete__icon" />
        <span>Angre sletting</span>
    </>
);

export default KnappeRad;
