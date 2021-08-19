import React, { FunctionComponent, ReactNode } from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import {
    erKobletTilArbeidsgiver,
    erKobletTilStilling,
    Kandidatliste,
    Kandidatlistestatus,
} from '../domene/Kandidatliste';
import MedPopover from '../../common/med-popover/MedPopover';
import { erIkkeProd } from '../../utils/featureToggleUtils';
import ForespørselOmDelingAvCv from './forespørsel-om-deling-av-cv/ForespørselOmDelingAvCv';
import useMarkerteKandidater from '../hooks/useMarkerteKandidater';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Kandidatmeldinger } from '../domene/Kandidatressurser';
import './KnappeRad.less';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';
import { SvarPåDelingAvCv } from './forespørsel-om-deling-av-cv/Forespørsel';

type Props = {
    kandidatliste: Kandidatliste;
    onKandidatShare: () => void;
    onEmailKandidater: () => void;
    onLeggTilKandidat: () => void;
    onSendSmsClick: () => void;
    onKandidaterAngreArkivering: () => void;
    visArkiverte: boolean;
    sendteMeldinger: Nettressurs<Kandidatmeldinger>;
    children: ReactNode;
};

const KnappeRad: FunctionComponent<Props> = ({
    kandidatliste,
    onKandidatShare,
    onEmailKandidater,
    onSendSmsClick,
    onKandidaterAngreArkivering,
    sendteMeldinger,
    children,
    visArkiverte,
}) => {
    const markerteKandidater = useMarkerteKandidater(kandidatliste.kandidater);
    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const markerteAktiveKandidater = markerteKandidater.filter((kandidat) => kandidat.fodselsnr);
    const minstEnKandidatHarIkkeFåttSms =
        sendteMeldinger.kind === Nettstatus.Suksess &&
        markerteAktiveKandidater.some(
            (markertKandidat) => !sendteMeldinger.data[markertKandidat.fodselsnr!]
        );

    const minstEnAvKandidateneHarSvartJa = markerteKandidater.some(
        (markertKandidat) =>
            forespørslerOmDelingAvCv.kind === Nettstatus.Suksess &&
            forespørslerOmDelingAvCv.data[markertKandidat.aktørid!]?.svar === SvarPåDelingAvCv.Ja
    );

    const stillingenErEgentligIkkeEnStilling = true; // TODO: Sjekk på stillingsobjektet når dette er implementert

    const skalViseEkstraKnapper =
        kandidatliste.kanEditere && erKobletTilStilling(kandidatliste) && !visArkiverte;

    const skalViseDelMedArbeidsgiverKnapp =
        kandidatliste.kanEditere && erKobletTilArbeidsgiver(kandidatliste) && !visArkiverte;

    const skalViseDelMedKandidatKnapp =
        kandidatliste.kanEditere &&
        erKobletTilStilling(kandidatliste) &&
        erKobletTilArbeidsgiver(kandidatliste) &&
        !visArkiverte;

    const skalViseKopierEposterKnapp = !visArkiverte;
    const skalViseAngreSlettingKnapp = visArkiverte;

    return (
        <div className="kandidatlisteknapper">
            <div className="kandidatlisteknapper__venstre">{children}</div>
            {kandidatliste.status === Kandidatlistestatus.Åpen && (
                <div className="kandidatlisteknapper__høyre">
                    {skalViseEkstraKnapper &&
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
                    {skalViseKopierEposterKnapp &&
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
                    {erIkkeProd && skalViseDelMedKandidatKnapp && (
                        <ForespørselOmDelingAvCv
                            stillingsId={kandidatliste.stillingId!}
                            markerteKandidater={markerteKandidater}
                        />
                    )}
                    {skalViseDelMedArbeidsgiverKnapp &&
                        (minstEnKandidatErMarkert ? (
                            <>
                                {(erIkkeProd && minstEnAvKandidateneHarSvartJa) ||
                                stillingenErEgentligIkkeEnStilling ? (
                                    <Lenkeknapp
                                        onClick={onKandidatShare}
                                        className="kandidatlisteknapper__knapp Share"
                                    >
                                        <DeleIkon />
                                    </Lenkeknapp>
                                ) : (
                                    <MedPopover
                                        hjelpetekst="Ingen av kandidatene har bekreftet at CV-en kan deles. Du kan derfor ikke dele dem."
                                        tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                                    >
                                        <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                                            <DeleIkon />
                                        </Lenkeknapp>
                                    </MedPopover>
                                )}
                            </>
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
                    {skalViseAngreSlettingKnapp &&
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
