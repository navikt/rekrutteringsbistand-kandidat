import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';

const KandidatmatchPrototype: FunctionComponent = () => {
    const [prototype, setPrototype] = useState<Prototype[] | undefined>(undefined);

    useEffect(() => {
        const hentPrototype = async () => {
            try {
                const proto = await fetch('/prototype');
                const data = await proto.json();

                setPrototype(data);
            } catch (e) {
                console.log(e);
            }
        };

        hentPrototype();
    }, []);

    return (
        <>
            <h1>Elitekandidater</h1>
            {prototype && (
                <ul>
                    {prototype.map((kandidat) => (
                        <li key={kandidat.arenaKandidatnr}>{kandidat.fornavn}</li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default KandidatmatchPrototype;
