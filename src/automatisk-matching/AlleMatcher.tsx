import React, { FunctionComponent } from 'react';
import { Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Nettstatus } from '../api/Nettressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { tilProsent } from './formatering';
import { Kandidatfane, lenkeTilKandidatside } from '../app/paths';
import { Link, RouteChildrenProps } from 'react-router-dom';
import useKandidatmatch from './useKandidatmatch';

type Props = RouteChildrenProps<{
    stillingsId: string;
}>;

const AlleMatcher: FunctionComponent<Props> = ({ match }) => {
    const stillingsId = match?.params.stillingsId;
    const { stilling, kandidater } = useKandidatmatch(stillingsId);

    if (stillingsId === undefined) {
        return <Feilmelding>Oppgi en stillingsId i URL-en</Feilmelding>;
    }

    if (stilling.kind === Nettstatus.IkkeLastet || stilling.kind === Nettstatus.LasterInn) {
        return <NavFrontendSpinner />;
    }

    if (stilling.kind !== Nettstatus.Suksess) {
        return <Feilmelding>Klarte ikke å laste inn stilling</Feilmelding>;
    }

    return (
        <>
            <Undertittel>Foreslåtte kandidater til «{stilling.data.stilling.title}»</Undertittel>
            <Normaltekst>
                Kandidatene som er foreslått av NAV er de som har høyest sannsynlighet for å bli
                stillingen.
            </Normaltekst>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && <NavFrontendSpinner />}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>{kandidater.error.message}</Feilmelding>
                )}
                {kandidater.kind === Nettstatus.Suksess && (
                    <ul>
                        {kandidater.data.map((kandidat) => (
                            <li key={kandidat.arenaKandidatnr}>
                                <Link
                                    className="lenke"
                                    to={opprettLenkeTilCv(kandidat.arenaKandidatnr, stillingsId)}
                                >
                                    {kandidat.fornavn} {kandidat.etternavn}
                                </Link>{' '}
                                ({tilProsent(kandidat.score)}):{' '}
                                <Link
                                    className="lenke"
                                    to={opprettLenkeTilMatchforklaring(
                                        kandidat.arenaKandidatnr,
                                        stillingsId
                                    )}
                                >
                                    Se matcheforklaring
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
};

const opprettLenkeTilMatchforklaring = (kandidatNr: string, stillingsId: string) =>
    `/prototype/stilling/${stillingsId}/forklaring/${kandidatNr}`;

const opprettLenkeTilCv = (kandidatNr: string, stillingId: string) =>
    lenkeTilKandidatside(kandidatNr, Kandidatfane.Cv, undefined, stillingId, undefined, true);

export default AlleMatcher;
