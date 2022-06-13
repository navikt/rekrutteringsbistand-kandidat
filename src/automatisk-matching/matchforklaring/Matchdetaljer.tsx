import React from 'react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { ErfaringPrototype } from '../Kandidatmatch';
import { tilProsentpoeng } from '../formatering';

const Matchdetaljer = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
    const [, matchedeOrdFraKandidat] = erfaring.ordScore[0];
    const alleOrdFraKandidat = matchedeOrdFraKandidat.map(([, ord]) => ord);

    return (
        <details className="matchdetaljer">
            <summary>
                <Expand className="matchdetaljer__ikon--ned" />
                <Collapse className="matchdetaljer__ikon--opp" />
                <span>Matchdetaljer</span>
            </summary>
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
                        {erfaring.ordScore.map(
                            ([[, ordFraStilling], matchedeOrdFraKandidaten], i) => {
                                return (
                                    <tr key={ordFraStilling}>
                                        <td>{ordFraStilling}</td>
                                        {matchedeOrdFraKandidaten.map(([, ord, score]) => (
                                            <td key={ord}>{tilProsentpoeng(score)}</td>
                                        ))}
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </details>
    );
};

export default Matchdetaljer;
