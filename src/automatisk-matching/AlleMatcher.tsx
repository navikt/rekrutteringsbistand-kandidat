import React from 'react';
import { Feilmelding, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Nettstatus } from '../api/Nettressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Kandidatfane, lenkeTilKandidatside, lenkeTilStilling } from '../app/paths';
import { Link, useLocation, useParams } from 'react-router-dom';
import useKandidatmatch from './useKandidatmatch';
import { Next } from '@navikt/ds-icons';
import { Checkbox } from 'nav-frontend-skjema';
import useKandidatlisteMedStillingsId from './useKandidatlisteMedStillingsId';
import './AlleMatcher.less';
import Sidefeil from '../common/sidefeil/Sidefeil';
import Sidelaster from '../common/sidelaster/Sidelaster';

export type Navigeringsstate = Partial<{
    aktørIder: string[];
}>;

type Params = {
    stillingsId: string;
};

const AlleMatcher = () => {
    const { stillingsId } = useParams<Params>();
    const { state } = useLocation();
    const { aktørIder } = (state || {}) as Navigeringsstate;
    const { stilling, kandidater, markerteKandidater, setMarkerteKandidater } = useKandidatmatch(
        stillingsId,
        aktørIder
    );

    const kandidatliste = useKandidatlisteMedStillingsId(stillingsId);

    if (stillingsId === undefined) {
        return <Sidefeil feilmelding="Oppgi en stillingsId i URL-en" />;
    }

    if (
        stilling.kind === Nettstatus.IkkeLastet ||
        stilling.kind === Nettstatus.LasterInn ||
        kandidatliste.kind === Nettstatus.IkkeLastet ||
        kandidatliste.kind === Nettstatus.LasterInn
    ) {
        return <Sidelaster />;
    }

    if (stilling.kind !== Nettstatus.Suksess) {
        return <Sidefeil feilmelding="Klarte ikke å laste inn stilling" />;
    }

    if (kandidatliste.kind !== Nettstatus.Suksess) {
        return <Sidefeil feilmelding="Klarte ikke å laste inn kandidatliste" />;
    }

    const onMarkertKandidat = (kandidatnummer: string) => {
        if (markerteKandidater.includes(kandidatnummer)) {
            const markertkeKandidaterUtenValgtKandiat = markerteKandidater.filter(
                (kandidat) => kandidat !== kandidatnummer
            );
            setMarkerteKandidater(markertkeKandidaterUtenValgtKandiat);
        } else {
            setMarkerteKandidater([...markerteKandidater, kandidatnummer]);
        }
    };

    return (
        <div className="alle-matcher">
            <Link className="lenke" to={lenkeTilStilling(stillingsId)}>
                Gå til stilling
                <Next />
            </Link>
            <div className="blokk-xxs" />
            <Innholdstittel className="blokk-xxs">
                Foreslåtte kandidater til «{stilling.data.stilling.title}»
            </Innholdstittel>
            <Normaltekst className="blokk-s">
                Kandidatene er foreslått automatisk med utgangspunkt i likhet mellom ordene i
                kandidaten og stillingen.
            </Normaltekst>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && <NavFrontendSpinner />}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>{kandidater.error.message}</Feilmelding>
                )}
                {kandidater.kind === Nettstatus.Suksess &&
                    kandidatliste.kind === Nettstatus.Suksess && (
                        <ol>
                            {kandidater.data.map((kandidat, index) => (
                                <li key={kandidat.arenaKandidatnr}>
                                    <Checkbox
                                        defaultChecked={markerteKandidater.includes(
                                            kandidat.arenaKandidatnr
                                        )}
                                        onChange={() => onMarkertKandidat(kandidat.arenaKandidatnr)}
                                        label={
                                            <>
                                                <Link
                                                    className="lenke"
                                                    to={lenkeTilKandidatside(
                                                        kandidat.arenaKandidatnr,
                                                        Kandidatfane.Cv,
                                                        kandidatliste.data.kandidatlisteId,
                                                        undefined,
                                                        true
                                                    )}
                                                >
                                                    {kandidat.arenaKandidatnr}
                                                </Link>
                                                <span> – </span>
                                                <Link
                                                    className="lenke"
                                                    to={opprettLenkeTilMatchforklaring(
                                                        kandidat.arenaKandidatnr,
                                                        stillingsId
                                                    )}
                                                >
                                                    Se matcheforklaring
                                                    <Next />
                                                </Link>
                                            </>
                                        }
                                    />
                                </li>
                            ))}
                        </ol>
                    )}
            </section>
        </div>
    );
};

const opprettLenkeTilMatchforklaring = (kandidatNr: string, stillingsId: string) =>
    `/prototype/stilling/${stillingsId}/forklaring/${kandidatNr}`;

export default AlleMatcher;
