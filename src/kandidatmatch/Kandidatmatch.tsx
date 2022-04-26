import React, { FunctionComponent, useEffect, useState } from 'react';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import { SearchApiError } from '../api/fetchUtils';
import './Kandidatmatch.less';

type ForeslåttKandidat = {
    kandidatnr: string;
    navn: string;
};

type Props = {
    stillingsId: string;
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
                const stillingResponse = await fetch(
                    `/stillingssok-proxy/stilling/_doc/${stillingsId}`
                );
                const stillingDokument = await stillingResponse.json();
                const stilling = stillingDokument['_source'];

                const kandidaterResponse = await fetch(`/kandidatmatch-api/match`, {
                    body: JSON.stringify(stilling),
                    method: 'post',
                });

                setKandidater(await kandidaterResponse.json());
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
                            <li key={kandidat.kandidatnr}>{kandidat.navn}</li>
                        ))}
                    </ul>
                )}
            </section>
        </Panel>
    );
};

export default Kandidatmatch;
