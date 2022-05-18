import React, { FunctionComponent, ReactNode } from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import {
    erKobletTilArbeidsgiver,
    erKobletTilStilling,
    kandidaterMåGodkjenneDelingAvCv,
    Kandidatliste,
    Kandidatlistestatus,
    Stillingskategori,
} from '../domene/Kandidatliste';
import MedPopover from '../../common/med-popover/MedPopover';
import ForespørselOmDelingAvCv from './forespørsel-om-deling-av-cv/ForespørselOmDelingAvCv';
import useMarkerteKandidater from '../hooks/useMarkerteKandidater';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Kandidatmeldinger } from '../domene/Kandidatressurser';
import DelMedArbeidsgiverKnapp from './DelMedArbeidsgiverKnapp';
import './KnappeRad.less';

type Props = {
    kandidatliste: Kandidatliste;
    onKandidatShare: () => void;
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
    onSendSmsClick,
    onKandidaterAngreArkivering,
    sendteMeldinger,
    children,
    visArkiverte,
}) => {
    const markerteKandidater = useMarkerteKandidater(kandidatliste.kandidater);
    const minstEnKandidatErMarkert = markerteKandidater.length > 0;
    const markerteAktiveKandidater = markerteKandidater.filter((kandidat) => kandidat.fodselsnr);
    const minstEnKandidatHarIkkeFåttSms =
        sendteMeldinger.kind === Nettstatus.Suksess &&
        markerteAktiveKandidater.some(
            (markertKandidat) => !sendteMeldinger.data[markertKandidat.fodselsnr!]
        );

    const skalViseEkstraKnapper =
        kandidatliste.kanEditere && erKobletTilStilling(kandidatliste) && !visArkiverte;

    const skalViseDelMedArbeidsgiverKnapp =
        kandidatliste.kanEditere &&
        erKobletTilStilling(kandidatliste) &&
        erKobletTilArbeidsgiver(kandidatliste) &&
        kandidatliste.stillingskategori !== Stillingskategori.Jobbmesse &&
        !visArkiverte;

    const skalViseDelMedKandidatKnapp =
        kandidaterMåGodkjenneDelingAvCv(kandidatliste) &&
        erKobletTilArbeidsgiver(kandidatliste) &&
        !visArkiverte;

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
                    {skalViseDelMedKandidatKnapp && (
                        <ForespørselOmDelingAvCv
                            stillingsId={kandidatliste.stillingId!}
                            markerteKandidater={markerteKandidater}
                        />
                    )}
                    {skalViseDelMedArbeidsgiverKnapp && (
                        <DelMedArbeidsgiverKnapp
                            minstEnKandidatErMarkert={minstEnKandidatErMarkert}
                            kandidatliste={kandidatliste}
                            markerteKandidater={markerteKandidater}
                            onKandidatShare={onKandidatShare}
                        />
                    )}
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

const SletteIkon: FunctionComponent = () => (
    <>
        <i className="Delete__icon" />
        <span>Angre sletting</span>
    </>
);

export default KnappeRad;
