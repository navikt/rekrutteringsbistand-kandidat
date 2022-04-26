import React, { FunctionComponent, useEffect, useState } from 'react';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import { SearchApiError } from '../api/fetchUtils';
import './Kandidatmatch.less';

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
                const stillingResponse = await fetch(
                    `${STILLINGSSØK_PROXY}/stilling/_doc/${stillingsId}`
                );
                const stillingDokument = await stillingResponse.json();
                const stilling = stillingDokument['_source'];

                const kandidaterResponse = await fetch(`${KANDIDATMATCH_API_URL}/match`, {
                    body: JSON.stringify(stilling),
                    method: 'post',
                });

                setKandidater({
                    kind: Nettstatus.Suksess,
                    data: await kandidaterResponse.json(),
                });
            } catch (e) {
                setKandidater({
                    kind: Nettstatus.Feil,
                    error: new SearchApiError('Klarte ikke å hente kandidater'),
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
                {kandidater.kind === Nettstatus.Suksess && (
                    <ul>
                        {kandidater.data.map((kandidat) => (
                            <li key={kandidat.arenaKandidatnr}>{kandidat.fornavn}</li>
                        ))}
                    </ul>
                )}
            </section>
        </Panel>
    );
};

export default Kandidatmatch;
