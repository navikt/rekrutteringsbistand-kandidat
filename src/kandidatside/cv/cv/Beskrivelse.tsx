import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

type Props = {
    beskrivelse: string;
};

const CvBeskrivelse: FunctionComponent<Props> = ({ beskrivelse }) => {
    if (beskrivelse.includes('¿')) {
        const punktliste = beskrivelse.split('¿');
        if (!punktliste[0]) {
            punktliste.shift();
        }
        return (
            <ul className="nokkelkvalifikasjoner">
                {punktliste.map((punkt) => (
                    <li key={punkt.toString()}>{punkt}</li>
                ))}
            </ul>
        );
    }

    return <Normaltekst>{beskrivelse}</Normaltekst>;
};

export default CvBeskrivelse;
