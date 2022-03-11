import React, { FunctionComponent, ReactNode } from 'react';
import { Feilmelding } from 'nav-frontend-typografi';
import {
    Synlighetsevaluering,
    Synlighetskriterie,
    kriterierPerAnsvarsområde,
    KravTilKandidaten,
    KravTilVeileder,
    KriterieUtenforNoensKontroll,
} from './Synlighetsevaluering';

type Props = {
    synlighetsevaluering: Synlighetsevaluering;
};

const KandidatenFinnesIkke: FunctionComponent<Props> = ({ synlighetsevaluering }) => {
    const ingenKriterierStemmer = Object.values(synlighetsevaluering).every(
        (kriterie) => kriterie === false
    );
    const alleKriterierStemmer = Object.values(synlighetsevaluering).every(
        (kriterie) => kriterie === true
    );

    let forklaring: ReactNode = null;

    if (ingenKriterierStemmer) {
        forklaring = <p>Kandidaten finnes ikke.</p>;
    } else if (alleKriterierStemmer) {
        forklaring = null;
    } else {
        const kandidatensKriterierPerAnsvarsområde =
            hentKandidatensKriterierPerAnsvarsområde(synlighetsevaluering);

        if (kandidatensKriterierPerAnsvarsområde.utenforNoensKontroll.length) {
            forklaring = (
                <p>
                    Mulige årsaker er:
                    {kandidatensKriterierPerAnsvarsområde.utenforNoensKontroll.map((kriterie) => (
                        <li>{kriterieTilForklaring(kriterie)}</li>
                    ))}
                </p>
            );
        } else {
            forklaring = (
                <>
                    {kandidatensKriterierPerAnsvarsområde.kandidat.length > 0 && (
                        <p>
                            For å bli synlig må kandidaten
                            <ul>
                                {kandidatensKriterierPerAnsvarsområde.kandidat.map((kriterie) => (
                                    <li>{kriterieTilForklaring(kriterie)}</li>
                                ))}
                            </ul>
                        </p>
                    )}
                    {kandidatensKriterierPerAnsvarsområde.veileder.length > 0 && (
                        <p>
                            For å bli synlig må du
                            <ul>
                                {kandidatensKriterierPerAnsvarsområde.veileder.map((kriterie) => (
                                    <li>{kriterieTilForklaring(kriterie)}</li>
                                ))}
                            </ul>
                        </p>
                    )}
                </>
            );
        }
    }

    return (
        <Feilmelding>
            <p>Kandidaten er ikke synlig i Rekrutteringsbistand.</p>
            {forklaring}
        </Feilmelding>
    );
};

const hentKandidatensKriterierPerAnsvarsområde = (synlighetsevaluering: Synlighetsevaluering) => {
    const ikkeTilfredsstilteKriterier = Object.entries(synlighetsevaluering)
        .filter(([_, verdi]) => verdi === false)
        .map(([kriterie, _]) => kriterie as Synlighetskriterie);

    return {
        utenforNoensKontroll: ikkeTilfredsstilteKriterier.filter((k) =>
            kriterierPerAnsvarsområde.utenforNoensKontroll.includes(k)
        ),
        kandidat: ikkeTilfredsstilteKriterier.filter((k) =>
            kriterierPerAnsvarsområde.kandidat.includes(k)
        ),
        veileder: ikkeTilfredsstilteKriterier.filter((k) =>
            kriterierPerAnsvarsområde.veileder.includes(k)
        ),
    };
};

const kriterieTilForklaring = (kriterie: Synlighetskriterie) => {
    switch (kriterie) {
        case KravTilKandidaten.HarAktivCv:
            return 'logge inn på Arbeidsplassen og opprette CV';
        case KravTilKandidaten.HarJobbprofil:
            return 'logge inn på Arbeidsplassen og registrere jobbønsker i CV-en';
        case KravTilKandidaten.HarSettHjemmel:
            return 'logge inn på Arbeidsplassen og godkjenne deling av CV-en med NAV';
        case KravTilKandidaten.ErUnderOppfølging:
            return 'registrere seg som arbeidssøker på nav.no';
        case KravTilKandidaten.MåIkkeBehandleTidligereCv:
            return 'logge inn på Arbeidsplassen og godkjenne tidligere registrert CV for deling med NAV';

        case KravTilVeileder.ErIkkeFritattKandidatsøk:
            return 'fjerne personforholdet "Fritatt for kandidatsøk" i Arena';
        case KravTilVeileder.HarRiktigFormidlingsgruppe:
            return 'reaktivere personen som arbeidssøker. Han/hun har feil formidlingskode i Arena';

        case KriterieUtenforNoensKontroll.ErIkkeSperretAnsatt:
            return 'Egen ansatt';
        case KriterieUtenforNoensKontroll.ErIkkeDød:
            return 'Død';
    }
};

export default KandidatenFinnesIkke;
