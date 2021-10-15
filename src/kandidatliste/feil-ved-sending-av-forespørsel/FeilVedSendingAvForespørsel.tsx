import React, { FunctionComponent } from 'react';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import {
    ForespørslerGruppertPåAktørId,
    TilstandPåForespørsel,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidatliste } from '../domene/Kandidatliste';
import useSlettedeKandidater from '../hooks/useIkkeSlettedeKandidater';
import './FeilVedSendingAvForespørsel.less';

type Props = {
    forespørslerOmDelingAvCv: ForespørslerGruppertPåAktørId;
    kandidatliste: Kandidatliste;
};

const FeilVedSendingAvForespørsel: FunctionComponent<Props> = ({
    forespørslerOmDelingAvCv,
    kandidatliste,
}) => {
    const slettedeKandidater = useSlettedeKandidater(kandidatliste.kandidater);
    const aktiveKandidaterMedForespørsler = Object.keys(forespørslerOmDelingAvCv).filter(
        (aktørId) => !slettedeKandidater.some((kandidat) => kandidat.aktørid === aktørId)
    );

    const forespørsler = aktiveKandidaterMedForespørsler.map(
        (aktørId) => forespørslerOmDelingAvCv[aktørId]?.gjeldendeForespørsel
    );

    const antallBrukereDerKortetIkkeBleOpprettet = forespørsler.filter(
        (forespørsel) => forespørsel?.tilstand === TilstandPåForespørsel.KanIkkeOpprette
    );

    const antallBrukereDerVeilederKanSvare = forespørsler.filter(
        (forespørsel) => forespørsel?.tilstand === TilstandPåForespørsel.KanIkkeVarsle
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
