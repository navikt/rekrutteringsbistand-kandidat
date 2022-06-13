import React from 'react';
import { tilProsent, tilProsentpoeng } from '../formatering';
import { ErfaringPrototype } from '../Kandidatmatch';

const ForkortetMatrise = ({
    erfaring,
    minimumTreffprosent,
}: {
    erfaring: ErfaringPrototype;
    minimumTreffprosent: Number;
}) => {
    return (
        <div className="blokk-m">
            <h4>Hvilke ord hos kandidaten er mest relatert til ord fra stillingsannonsen?</h4>
            <table>
                <thead>
                    <tr>
                        <th>Ord fra stilling</th>
                        <th colSpan={2}>Relatert ord fra kandidaten</th>
                    </tr>
                </thead>
                <tbody>
                    {erfaring.ordScore
                        .sort(([, matchedeOrdFraKandidat1], [, matchedeOrdFraKandidat2]) => {
                            const [, , score1] = matchedeOrdFraKandidat1[0];
                            const [, , score2] = matchedeOrdFraKandidat2[0];
                            return tilProsentpoeng(score2) - tilProsentpoeng(score1);
                        })
                        .map((ordscore, k) => {
                            const [ordFraStilling, matchedeOrdFraKandidat] = ordscore;
                            const toBesteMatcherFraKandidat = matchedeOrdFraKandidat
                                .sort(([, , score1], [, , score2]) => score2 - score1)
                                .slice(0, 2);

                            return (
                                tilProsentpoeng(toBesteMatcherFraKandidat[0][2]) >=
                                    minimumTreffprosent && (
                                    <tr key={k}>
                                        <td>{ordFraStilling[1]}</td>
                                        {toBesteMatcherFraKandidat.map(([, ord, score], index) => {
                                            return (
                                                tilProsentpoeng(score) >= minimumTreffprosent && (
                                                    <td key={index}>
                                                        <span>{ord}</span>
                                                        <span> ({tilProsent(score)})</span>
                                                    </td>
                                                )
                                            );
                                        })}
                                    </tr>
                                )
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default ForkortetMatrise;
