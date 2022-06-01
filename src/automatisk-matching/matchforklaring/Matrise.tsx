import React from 'react';
import { tilProsentpoeng } from '../formatering';
import { ErfaringPrototype } from '../Kandidatmatch';
import { IngenData } from './Matchforklaring';

const Matrise = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
    if (erfaring.ordScore.length === 0) {
        return <IngenData />;
    }

    const [, matchedeOrdFraKandidat] = erfaring.ordScore[0];
    const alleOrdFraKandidat = matchedeOrdFraKandidat.map(([, ord]) => ord);

    return (
        <div className="blokk-m">
            <h4>Hvor godt matcher hvert ord i stillingsannonsen med ord fra kandidaten?</h4>
            <table>
                <thead>
                    <tr>
                        <th>Ord fra stilling</th>
                        <th colSpan={alleOrdFraKandidat.length}>
                            Ord fra kandidaten og relasjon (%)
                        </th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th />
                        {alleOrdFraKandidat.map((ord) => (
                            <th key={`th-${ord}`}>{ord}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {erfaring.ordScore.map(([[, ordFraStilling], matchedeOrdFraKandidaten], i) => {
                        return (
                            <tr key={ordFraStilling}>
                                <td>{ordFraStilling}</td>
                                {matchedeOrdFraKandidaten.map(([, ord, score]) => (
                                    <td key={ord}>{tilProsentpoeng(score)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Matrise;
