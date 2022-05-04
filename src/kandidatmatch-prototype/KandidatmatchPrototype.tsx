import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';
import './KandidatmatchPrototype.less';

const KandidatmatchPrototype: FunctionComponent = () => {
    const [prototype, setPrototype] = useState<Prototype[] | undefined>(undefined);

    useEffect(() => {
        const hentPrototype = async () => {
            try {
                const proto = await fetch('/api/prototype', {
                    method: 'GET',
                });

                const data = await proto.json();

                setPrototype(data);
            } catch (e) {
                console.log(e);
            }
        };

        hentPrototype();
    }, []);

    const kandidat = prototype ? prototype[0] : undefined;

    return (
        <div className="prototype">
            <h1>Elitekandidater</h1>
            {kandidat && (
                <>
                    <div>
                        <h2>{kandidat.fornavn}</h2>
                        <p aria-label="fødselsnummer">{kandidat.fodselsnummer}</p>
                    </div>
                    <div>
                        <h3>Arbeidserfaring ({kandidat.score_arbeidserfaring})</h3>
                        <ul>
                            {kandidat.arbeidserfaring.map((arbeidserfaring, index) => (
                                <li key={arbeidserfaring.janzzKonseptid}>
                                    {arbeidserfaring.stillingstittel} (
                                    {kandidat.match_forklaring.arbeidserfaring_forklaring[index]})
                                </li>
                            ))}
                        </ul>
                        <h3>Utdanning ({kandidat.score_utdannelse})</h3>
                        <ul>
                            {kandidat.utdannelse.map((utdannelse, index) => (
                                <li key={utdannelse.beskrivelse}>
                                    {utdannelse.laerested} (
                                    {kandidat.match_forklaring.utdannelse_forklaring[index]})
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
