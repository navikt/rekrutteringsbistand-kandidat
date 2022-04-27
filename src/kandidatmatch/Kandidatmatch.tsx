import React, { FunctionComponent, useEffect, useState } from 'react';
import Panel from 'nav-frontend-paneler';
import { Feilmelding, Undertittel } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import { fetchJson, postJson, SearchApiError } from '../api/fetchUtils';
import './Kandidatmatch.less';
import { Kandidatfane, lenkeTilKandidatside } from '../app/paths';
import { Link } from 'react-router-dom';

export type ForeslåttKandidat = {
    fodselsnummer: string;
    fornavn: string;
    etternavn: string;
    arenaKandidatnr: string;
};

type Props = {
    stillingsId: string;
};

export const KANDIDATMATCH_API_URL = '/kandidatmatch-api';
export const STILLINGSSØK_PROXY = '/stillingssok-proxy';

const hentStilling = async (stillingsId: string): Promise<any> => {
    try {
        const response = await fetchJson(`${STILLINGSSØK_PROXY}/stilling/_doc/${stillingsId}`);
        return response['_source'];
    } catch (e) {
        throw new SearchApiError({
            message: 'Klarte ikke å hente stilling',
            status: e.status,
        });
    }
};

const hentKandidater = async (stilling: any): Promise<ForeslåttKandidat[]> => {
    try {
        return await postJson(`${KANDIDATMATCH_API_URL}/match`, JSON.stringify(stilling));
    } catch (e) {
        throw new SearchApiError({
            message: 'Klarte ikke å hente foreslåtte kandidater',
            status: e.status,
        });
    }
};

const Kandidatmatch: FunctionComponent<Props> = ({ stillingsId }) => {
    const [kandidater, setKandidater] = useState<Nettressurs<ForeslåttKandidat[]>>({
        kind: Nettstatus.IkkeLastet,
    });

    useEffect(() => {
        const hentAutomatiskeMatcher = async () => {
            setKandidater({
                kind: Nettstatus.LasterInn,
            });

            try {
                const stilling = await hentStilling(stillingsId);
                const kandidater = await hentKandidater(stilling);

                setKandidater({
                    kind: Nettstatus.Suksess,
                    data: kandidater,
                });
            } catch (error) {
                setKandidater({
                    kind: Nettstatus.Feil,
                    error,
                });
            }
        };

        hentAutomatiskeMatcher();
    }, [stillingsId]);

    return (
        <Panel border className="kandidatmatch">
            <Undertittel>Foreslåtte kandidater</Undertittel>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && (
                    <p>Leter etter passende kandidater for stillingen ...</p>
                )}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>{kandidater.error.message}</Feilmelding>
                )}
                {kandidater.kind === Nettstatus.Suksess && (
                    <ul>
                        {kandidater.data.map((kandidat) => (
                            <li key={kandidat.arenaKandidatnr}>
                                <Link
                                    to={lenkeTilKandidatside(
                                        kandidat.arenaKandidatnr,
                                        Kandidatfane.Cv,
                                        undefined,
                                        stillingsId
                                    )}
                                >
                                    {kandidat.fornavn} {kandidat.etternavn}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </Panel>
    );
};

export default Kandidatmatch;
