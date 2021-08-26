import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import useStatusPåForespørsler from './useStatusPåForespørsler';
import './FeilVedSendingAvForespørsel.less';

type Props = {
    forespørslerOmDelingAvCv: Kandidatforespørsler;
};

const FeilVedSendingAvForespørsel: FunctionComponent<Props> = ({ forespørslerOmDelingAvCv }) => {
    const { kortetBleIkkeOpprettet, veilederKanSvare } =
        useStatusPåForespørsler(forespørslerOmDelingAvCv);

    return (
        <>
            {kortetBleIkkeOpprettet.length > 0 && (
                <AlertStripeFeil className="feil-ved-sending-av-forespørsel__alertstripe">
                    For {kortetBleIkkeOpprettet.length} av kandidatene ble stillingskortet ikke
                    opprettet i Aktivitetsplanen. CV-en kan ikke deles med arbeidsgiver.
                </AlertStripeFeil>
            )}
            {veilederKanSvare.length > 0 && (
                <AlertStripeAdvarsel className="feil-ved-sending-av-forespørsel__alertstripe">
                    {veilederKanSvare.length} av kandidatene bruker ikke digitale tjenester fra NAV.
                    Du må ringe og registrere svaret i stillingskortet i Aktivitetsplanen.
                </AlertStripeAdvarsel>
            )}
        </>
    );
};

export default FeilVedSendingAvForespørsel;
