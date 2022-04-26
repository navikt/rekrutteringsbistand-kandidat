import React, { FunctionComponent, useEffect, useState } from 'react';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';

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
        setKandidater({
            kind: Nettstatus.LasterInn,
        });
    }, [stillingsId]);

    return (
        <div>
            <h2>Kandidatmatch for stilling {stillingsId}</h2>
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
        </div>
    );
};

export default Kandidatmatch;
