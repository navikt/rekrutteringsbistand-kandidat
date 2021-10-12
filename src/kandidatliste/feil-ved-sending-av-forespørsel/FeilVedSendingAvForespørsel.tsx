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
    const forespørslerForAktiveKandidater = Object.entries(forespørslerOmDelingAvCv)
        .filter(([aktørId]) => !slettedeKandidater.some((kandidat) => kandidat.aktørid === aktørId))
        .map(([_, forespørsler]) => forespørsler.gjeldendeForespørsel);

    const antallBrukereDerKortetIkkeBleOpprettet = forespørslerForAktiveKandidater.filter(
        (forespørsel) => forespørsel.tilstand === TilstandPåForespørsel.KanIkkeOpprette
    );

    const antallBrukereDerVeilederKanSvare = forespørslerForAktiveKandidater.filter(
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
