import React, { FunctionComponent, useEffect, useState } from 'react';
import Panel from 'nav-frontend-paneler';
import { Feilmelding, Undertittel } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import { fetchJson, SearchApiError } from '../api/fetchUtils';
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

const hentStilling = async (stillingsId: string): Promise<any> => {
    try {
        const response = fetchJson(`${STILLINGSSØK_PROXY}/stilling/_doc/${stillingsId}`);
        return response['_source'];
    } catch (e) {
        throw new SearchApiError({
            message: 'Klarte ikke å hente stilling fra stillingssøk-proxy',
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
                const stilling = hentStilling(stillingsId);

                console.log('Stilling', stilling);

                const kandidaterResponse = await fetch(`${KANDIDATMATCH_API_URL}/match`, {
                    body: JSON.stringify(stilling),
                    method: 'post',
                });

                const kandidatene = await kandidaterResponse.json();
                console.log('Mottok kandidatene: ', kandidatene);

                setKandidater({
                    kind: Nettstatus.Suksess,
                    data: kandidatene,
                });
            } catch (e) {
                console.log('Feilmeldingen er her: ', e);
                setKandidater({
                    kind: Nettstatus.Feil,
                    error: e!,
                });
            }
        };

        hentAutomatiskeMatcher();
    }, [stillingsId]);

    useEffect(() => {
        console.log('Foreslåtte kandidater: ', kandidater);
    }, [kandidater]);

    return (
        <Panel border className="kandidatmatch">
            <Undertittel>Foreslåtte kandidater</Undertittel>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && (
                    <p>Leter etter passende kandidater for stillingen ...</p>
                )}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>Klarte ikke å hente passende kandidater</Feilmelding>
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
