import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { ErfaringPrototype } from '../Kandidatmatch';
import { tilProsentpoeng } from '../formatering';

const Matchdetaljer = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
    const [, matchedeOrdFraKandidat] = erfaring.ord_score[0];
    const alleOrdFraKandidat = matchedeOrdFraKandidat.map((matchetOrd) => matchetOrd.ord);

    return (
        <details className="matchdetaljer">
            <summary>
                <ChevronDownIcon className="matchdetaljer__ikon--ned" />
                <ChevronUpIcon className="matchdetaljer__ikon--opp" />
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
                        {erfaring.ord_score.map(([ordFraStilling, matchedeOrdFraKandidaten], i) => {
                            return (
                                <tr key={ordFraStilling.ord}>
                                    <td>{ordFraStilling.ord}</td>
                                    {matchedeOrdFraKandidaten.map((matchetOrd) => (
                                        <td key={matchetOrd.ord}>
                                            {tilProsentpoeng(matchetOrd.score)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </details>
    );
};

export default Matchdetaljer;
