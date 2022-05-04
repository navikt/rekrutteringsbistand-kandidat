import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';

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
        <>
            <h1>Elitekandidater</h1>
            {kandidat && <h2>{kandidat.fornavn}</h2>}
        </>
    );
};

export default KandidatmatchPrototype;
