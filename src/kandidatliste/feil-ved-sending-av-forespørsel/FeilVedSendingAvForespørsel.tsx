import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import useStatusPåForespørsler from './useStatusPåForespørsler';
import { StatusPåForespørsel } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import './FeilVedSendingAvForespørsel.less';

type Props = {
    forespørslerOmDelingAvCv: Kandidatforespørsler;
};

const FeilVedSendingAvForespørsel: FunctionComponent<Props> = ({ forespørslerOmDelingAvCv }) => {
    const statuser = useStatusPåForespørsler(forespørslerOmDelingAvCv);
    const verdier = Object.values(statuser);

    const antallBrukereDerKortetIkkeBleOpprettet = verdier.filter(
        (status) => status === StatusPåForespørsel.KortetBleIkkeOpprettet
    );
    const antallBrukereDerVeilederKanSvare = verdier.filter(
        (status) => status === StatusPåForespørsel.VeilederKanSvare
    );

    return (
        <div className="feil-ved-sending-av-forespørsel">
            {antallBrukereDerKortetIkkeBleOpprettet.length > 0 && (
                <AlertStripeFeil className="feil-ved-sending-av-forespørsel__alertstripe">
                    For {antallBrukereDerKortetIkkeBleOpprettet.length} av kandidatene ble
                    stillingskortet ikke opprettet i Aktivitetsplanen. CV-en kan ikke deles med
                    arbeidsgiver.
                </AlertStripeFeil>
            )}
            {antallBrukereDerVeilederKanSvare.length > 0 && (
                <AlertStripeAdvarsel className="feil-ved-sending-av-forespørsel__alertstripe">
                    {antallBrukereDerVeilederKanSvare.length} av kandidatene bruker ikke digitale
                    tjenester fra NAV. Du må ringe og registrere svaret i stillingskortet i
                    Aktivitetsplanen.
                </AlertStripeAdvarsel>
            )}
        </div>
    );
};

export default FeilVedSendingAvForespørsel;
