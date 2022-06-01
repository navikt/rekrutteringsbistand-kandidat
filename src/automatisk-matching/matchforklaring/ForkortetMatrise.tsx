import React from 'react';
import { tilProsent } from '../formatering';
import { ErfaringPrototype } from '../Kandidatmatch';

const ForkortetMatrise = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
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
                <thead>
                    <tr>
                        <th />
                        <th>Mest relatert</th>
                        <th>Nest mest relatert</th>
                    </tr>
                </thead>
                <tbody>
                    {erfaring.ordScore.map((ordscore, k) => {
                        const [ordFraStilling, matchedeOrdFraKandidat] = ordscore;
                        const toBesteMatcherFraKandidat = matchedeOrdFraKandidat
                            .sort(([, , score1], [, , score2]) => score2 - score1)
                            .slice(0, 2);

                        return (
                            <tr key={k}>
                                <td>{ordFraStilling[1]}</td>
                                {toBesteMatcherFraKandidat.map(([, ord, score], index) => {
                                    return (
                                        <td key={index}>
                                            <span>{ord}</span>
                                            <span> ({tilProsent(score)})</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ForkortetMatrise;
