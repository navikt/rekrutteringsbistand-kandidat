import React from 'react';
import { Feilmelding, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Nettstatus } from '../api/Nettressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Kandidatfane, lenkeTilKandidatside, lenkeTilStilling } from '../app/paths';
import { Link, useLocation, useParams } from 'react-router-dom';
import useKandidatmatch from './useKandidatmatch';
import { Next } from '@navikt/ds-icons';
import './AlleMatcher.less';
import { Checkbox } from 'nav-frontend-skjema';

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

    if (stillingsId === undefined) {
        return <Feilmelding>Oppgi en stillingsId i URL-en</Feilmelding>;
    }

    if (stilling.kind === Nettstatus.IkkeLastet || stilling.kind === Nettstatus.LasterInn) {
        return <NavFrontendSpinner />;
    }

    if (stilling.kind !== Nettstatus.Suksess) {
        return <Feilmelding>Klarte ikke å laste inn stilling</Feilmelding>;
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
                {kandidater.kind === Nettstatus.Suksess && (
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
                                                    kandidatlisteId, // TODO: Fiks
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
