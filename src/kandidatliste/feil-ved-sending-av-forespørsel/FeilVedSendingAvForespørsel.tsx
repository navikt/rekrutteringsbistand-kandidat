import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import { ForespørselOmDelingAvCv } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import './FeilVedSendingAvForespørsel.less';

type Props = {
    forespørslerOmDelingAvCv: Kandidatforespørsler;
};

const FeilVedSendingAvForespørsel: FunctionComponent<Props> = ({ forespørslerOmDelingAvCv }) => {
    const forespørsler = Object.values(forespørslerOmDelingAvCv);

    const brukereDerKortetIkkeBleOpprettet = forespørsler.filter(
        tolkningAvSvarFraAktivitetsplanen.kortetBleIkkeOpprettet
    );

    // TODO: Ikke vis denne alerten hvis kandidaten har svart.
    const brukereSomIkkeKanSvarePåKortet = forespørsler.filter(
        tolkningAvSvarFraAktivitetsplanen.kanIkkeSvarePåKortet
    );

    return (
        <>
            {brukereDerKortetIkkeBleOpprettet.length > 0 && (
                <AlertStripeFeil className="feil-ved-sending-av-forespørsel__alertstripe">
                    For {brukereDerKortetIkkeBleOpprettet.length} av kandidatene ble stillingskortet
                    ikke opprettet i Aktivitetsplanen. CV-en kan ikke deles med arbeidsgiver.
                </AlertStripeFeil>
            )}
            {brukereSomIkkeKanSvarePåKortet.length > 0 && (
                <AlertStripeAdvarsel className="feil-ved-sending-av-forespørsel__alertstripe">
                    {brukereSomIkkeKanSvarePåKortet.length} av kandidatene bruker ikke digitale
                    tjenester fra NAV. Du må ringe og registrere svaret i stillingskortet i
                    Aktivitetsplanen.
                </AlertStripeAdvarsel>
            )}
        </>
    );
};

const tolkningAvSvarFraAktivitetsplanen: Record<
    string,
    (forespørsel: ForespørselOmDelingAvCv) => boolean
> = {
    altGikkBra: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === true && aktivitetOpprettet === true,
    kanIkkeSvarePåKortet: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === false && aktivitetOpprettet === true,
    kortetBleIkkeOpprettet: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === false && aktivitetOpprettet === false,
    ugyldigKombinasjon: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === true && aktivitetOpprettet === false,
};

export default FeilVedSendingAvForespørsel;
