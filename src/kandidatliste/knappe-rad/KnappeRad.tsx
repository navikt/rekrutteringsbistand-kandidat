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
import css from './KnappeRad.module.css';
import classNames from 'classnames';
import { MobileIcon, MobileFillIcon, TrashIcon, TrashFillIcon } from '@navikt/aksel-icons';

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
        kandidatliste.stillingskategori !== Stillingskategori.Formidling &&
        kandidatliste.stillingskategori !== Stillingskategori.Jobbmesse &&
        !visArkiverte;

    const skalViseDelMedKandidatKnapp =
        kandidaterMåGodkjenneDelingAvCv(kandidatliste) &&
        erKobletTilArbeidsgiver(kandidatliste) &&
        !visArkiverte;

    const skalViseAngreSlettingKnapp = visArkiverte;

    return (
        <div className={css.kandidatlisteknapper}>
            <div className={css.venstre}>{children}</div>
            {kandidatliste.status === Kandidatlistestatus.Åpen && (
                <div className={css.høyre}>
                    {skalViseEkstraKnapper &&
                        (minstEnKandidatErMarkert && minstEnKandidatHarIkkeFåttSms ? (
                            <Lenkeknapp
                                onClick={onSendSmsClick}
                                className={classNames(css.knapp, css.knapperadKnapp)}
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
                                <Lenkeknapp className={classNames(css.knapp, css.knapperadKnapp)}>
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
                                className={classNames(css.knapp, css.knapperadKnapp)}
                            >
                                <SletteIkon />
                            </Lenkeknapp>
                        ) : (
                            <MedPopover
                                orientering={PopoverOrientering.UnderVenstre}
                                hjelpetekst="Du må huke av for kandidatene du ønsker å angre sletting for."
                                tittel="Angre sletting for de markerte kandidatene"
                            >
                                <Lenkeknapp className={classNames(css.knapp, css.knapperadKnapp)}>
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
        <MobileIcon
            className={classNames(css.knapperadIkonIkkeFylt, css.knapperadIkon)}
            fontSize="1.5rem"
        />
        <MobileFillIcon
            className={classNames(css.knapperadIkonFylt, css.knapperadIkon)}
            fontSize="1.5rem"
        />
        <span>Send SMS</span>
    </>
);

const SletteIkon: FunctionComponent = () => (
    <>
        <TrashIcon
            className={classNames(css.knapperadIkonIkkeFylt, css.knapperadIkon)}
            fontSize="1.5rem"
        />
        <TrashFillIcon
            className={classNames(css.knapperadIkonFylt, css.knapperadIkon)}
            fontSize="1.5rem"
        />
        <span>Angre sletting</span>
    </>
);

export default KnappeRad;
