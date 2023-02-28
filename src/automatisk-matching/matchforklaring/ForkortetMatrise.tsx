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
                        <th>Spacy</th>
                        <th colSpan={2}>Gensim</th>
                    </tr>
                </thead>
                <tbody>
                    <th>
                        <thead>
                            <tr>
                                <th>Ord fra stilling</th>
                                <th colSpan={2}>Relatert ord fra kandidaten</th>
                            </tr>
                        </thead>
                        {erfaring.ord_score
                            .sort(([, matchedeOrdFraKandidat1], [, matchedeOrdFraKandidat2]) => {
                                const score1 = Math.max(
                                    ...matchedeOrdFraKandidat1.map((ord) => ord.score)
                                );
                                console.log(score1);
                                const score2 = Math.max(
                                    ...matchedeOrdFraKandidat2.map((ord) => ord.score)
                                );
                                console.log(score2);
                                return score2 - score1;
                            })
                            .map((ordscore, k) => {
                                const [ordFraStilling, matchedeOrdFraKandidat] = ordscore;
                                const toBesteMatcherFraKandidat = matchedeOrdFraKandidat
                                    .sort(
                                        (matchedeOrdFraKandidat1, matchedeOrdFraKandidat2) =>
                                            matchedeOrdFraKandidat2.score -
                                            matchedeOrdFraKandidat1.score
                                    )
                                    .slice(0, 2);

                                return (
                                    tilProsentpoeng(toBesteMatcherFraKandidat[0].score) >=
                                        minimumTreffprosent && (
                                        <tr key={k}>
                                            <td>{ordFraStilling.ord}</td>
                                            {toBesteMatcherFraKandidat.map(
                                                (matchedeOrdFraKandidat, index) => {
                                                    return (
                                                        tilProsentpoeng(
                                                            matchedeOrdFraKandidat.score
                                                        ) >= minimumTreffprosent && (
                                                            <td key={index}>
                                                                <span>
                                                                    {matchedeOrdFraKandidat.ord}
                                                                </span>
                                                                <span>
                                                                    (
                                                                    {tilProsent(
                                                                        matchedeOrdFraKandidat.score
                                                                    )}
                                                                    )
                                                                </span>
                                                            </td>
                                                        )
                                                    );
                                                }
                                            )}
                                        </tr>
                                    )
                                );
                            })}
                    </th>
                    <th>
                        <thead>
                            <tr>
                                <th>Ord fra stilling</th>
                                <th colSpan={2}>Relatert ord fra kandidaten</th>
                            </tr>
                        </thead>
                        {erfaring.ord_score
                            .sort(([, matchedeOrdFraKandidat1], [, matchedeOrdFraKandidat2]) => {
                                const nn_score1 = Math.max(
                                    ...matchedeOrdFraKandidat1.map((ord) => ord.nn_score)
                                );
                                const nn_score2 = Math.max(
                                    ...matchedeOrdFraKandidat2.map((ord) => ord.nn_score)
                                );
                                return nn_score2 - nn_score1;
                            })
                            .map((ordscore, k) => {
                                const [ordFraStilling, matchedeOrdFraKandidat] = ordscore;
                                const toBesteMatcherFraKandidat = matchedeOrdFraKandidat
                                    .sort(
                                        (matchedeOrdFraKandidat1, matchedeOrdFraKandidat2) =>
                                            matchedeOrdFraKandidat2.nn_score -
                                            matchedeOrdFraKandidat1.nn_score
                                    )
                                    .slice(0, 2);

                                return (
                                    tilProsentpoeng(toBesteMatcherFraKandidat[0].nn_score) >=
                                        minimumTreffprosent && (
                                        <tr key={k}>
                                            <td>{ordFraStilling.ord}</td>
                                            {toBesteMatcherFraKandidat.map(
                                                (matchedeOrdFraKandidat, index) => {
                                                    return (
                                                        tilProsentpoeng(
                                                            matchedeOrdFraKandidat.nn_score
                                                        ) >= minimumTreffprosent && (
                                                            <td key={index}>
                                                                <span>
                                                                    {matchedeOrdFraKandidat.ord}
                                                                </span>
                                                                <span>
                                                                    (
                                                                    {tilProsent(
                                                                        matchedeOrdFraKandidat.nn_score
                                                                    )}
                                                                    )
                                                                </span>
                                                            </td>
                                                        )
                                                    );
                                                }
                                            )}
                                        </tr>
                                    )
                                );
                            })}
                    </th>
                </tbody>
            </table>
        </div>
    );
};

export default ForkortetMatrise;
