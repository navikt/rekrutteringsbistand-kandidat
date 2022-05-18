import React, { FunctionComponent } from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';
import { useSelector } from 'react-redux';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import MedPopover from '../../common/med-popover/MedPopover';
import { Kandidat } from '../domene/Kandidat';
import { kandidaterMåGodkjenneDelingAvCv, Kandidatliste } from '../domene/Kandidatliste';
import {
    hentForespørslerForKandidatForStilling,
    TilstandPåForespørsel,
} from './forespørsel-om-deling-av-cv/Forespørsel';
import { cvErSendtTilArbeidsgiverOgSlettet } from '../kandidatrad/status-og-hendelser/hendelser/CvErSlettet';

type Props = {
    kandidatliste: Kandidatliste;
    markerteKandidater: Kandidat[];
    minstEnKandidatErMarkert: boolean;
    onKandidatShare: () => void;
};

const DelMedArbeidsgiverKnapp: FunctionComponent<Props> = ({
    kandidatliste,
    markerteKandidater,
    minstEnKandidatErMarkert,
    onKandidatShare,
}) => {
    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    const alleMarkerteKandidaterHarSvartJa =
        forespørslerOmDelingAvCv.kind === Nettstatus.Suksess &&
        markerteKandidater.every((markertKandidat) => {
            const forespørsel = hentForespørslerForKandidatForStilling(
                markertKandidat.aktørid,
                forespørslerOmDelingAvCv.data
            );

            return (
                forespørsel?.gjeldendeForespørsel.tilstand === TilstandPåForespørsel.HarSvart &&
                forespørsel.gjeldendeForespørsel.svar?.harSvartJa
            );
        });

    if (!minstEnKandidatErMarkert) {
        return (
            <MedPopover
                hjelpetekst="Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver."
                tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
            >
                <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                    <DeleIkon />
                </Lenkeknapp>
            </MedPopover>
        );
    }

    const visMeldingOmForespørselOmDelingAvCv =
        kandidaterMåGodkjenneDelingAvCv(kandidatliste) && !alleMarkerteKandidaterHarSvartJa;

    if (visMeldingOmForespørselOmDelingAvCv) {
        return (
            <MedPopover
                hjelpetekst={
                    <>
                        <Normaltekst className="blokk-xs">
                            Kandidaten(e) har ikke svart eller svart nei på om CV-en kan deles. Du
                            kan derfor ikke dele disse.
                        </Normaltekst>
                        <Normaltekst>
                            Har du hatt dialog med kandidaten, og fått bekreftet at NAV kan dele
                            CV-en? Da må du registrere dette i aktivitetsplanen. Har du ikke delt
                            stillingen med kandidaten må du gjøre det først.{' '}
                            <Lenke
                                target="_blank"
                                rel="noreferrer noopener"
                                href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-markedsarbeid/SitePages/Del-stillinger-med-kandidater-i-Aktivitetsplanen.aspx#har-du-ringt-kandidaten-istedenfor-%C3%A5-dele-i-aktivitetsplanen"
                            >
                                Se rutiner på Navet
                            </Lenke>
                            .
                        </Normaltekst>
                    </>
                }
                tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
            >
                <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                    <DeleIkon />
                </Lenkeknapp>
            </MedPopover>
        );
    }

    const minstEnAvKandidateneHarFåttCvSlettetFraArbeidsgiversKandidatliste =
        markerteKandidater.some((kandidat) =>
            cvErSendtTilArbeidsgiverOgSlettet(kandidat.utfallsendringer)
        );

    if (minstEnAvKandidateneHarFåttCvSlettetFraArbeidsgiversKandidatliste) {
        return (
            <MedPopover
                hjelpetekst="En av kandidatene har fått CV-en sin sendt til arbeidsgivers kandidatliste, men er blitt slettet i etterkant. Du kan ikke dele CV-en på nytt."
                tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
            >
                <Lenkeknapp className="kandidatlisteknapper__knapp Share">
                    <DeleIkon />
                </Lenkeknapp>
            </MedPopover>
        );
    }

    return (
        <Lenkeknapp onClick={onKandidatShare} className="kandidatlisteknapper__knapp Share">
            <DeleIkon />
        </Lenkeknapp>
    );
};

const DeleIkon: FunctionComponent = () => (
    <>
        <i className="Share__icon" />
        <span>Del med arbeidsgiver (presenter)</span>
    </>
);

export default DelMedArbeidsgiverKnapp;
