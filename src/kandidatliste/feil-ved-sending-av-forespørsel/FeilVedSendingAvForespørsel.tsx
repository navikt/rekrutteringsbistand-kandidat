import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import { TilstandPåForespørsel } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidatliste } from '../domene/Kandidatliste';
import './FeilVedSendingAvForespørsel.less';

type Props = {
    forespørslerOmDelingAvCv: Kandidatforespørsler;
    kandidatliste: Kandidatliste;
};

const FeilVedSendingAvForespørsel: FunctionComponent<Props> = ({
    forespørslerOmDelingAvCv,
    kandidatliste,
}) => {
    const aktiveKandidater = kandidatliste.kandidater
        .filter((kandidat) => !kandidat.arkivert)
        .map((kandidat) => kandidat.aktørid);

    const aktiveForespørsler: Kandidatforespørsler = {};
    for (let key in forespørslerOmDelingAvCv) {
        if (aktiveKandidater.includes(key)) {
            aktiveForespørsler[key] = forespørslerOmDelingAvCv[key];
        }
    }

    const verdier = Object.values(aktiveForespørsler);

    const antallBrukereDerKortetIkkeBleOpprettet = verdier.filter(
        (forespørsel) => forespørsel.tilstand === TilstandPåForespørsel.KanIkkeOpprette
    );
    const antallBrukereDerVeilederKanSvare = verdier.filter(
        (forespørsel) => forespørsel.tilstand === TilstandPåForespørsel.KanIkkeVarsle
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
