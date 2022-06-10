import React from 'react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { tilProsent, tilProsentpoeng } from '../formatering';
import { ErfaringPrototype } from '../Kandidatmatch';
import ForkortetMatrise from './ForkortetMatrise';
import { IngenData } from './Matchforklaring';

type Props = {
    erfaring: ErfaringPrototype;
    tittel: string;
    match?: number;
};

const Matrise = ({ erfaring, tittel, match }: Props) => {
    const minimumTreffprosent: Number = 25;

    if (erfaring.ordScore.length === 0) {
        return <IngenData />;
    }

    const [, matchedeOrdFraKandidat] = erfaring.ordScore[0];
    const alleOrdFraKandidat = matchedeOrdFraKandidat.map(([, ord]) => ord);

    return (
        <details className="matchforklaring-matrise">
            <summary>
                <h3>
                    <Expand className="matchforklaring-matrise__down" />
                    <Collapse className="matchforklaring-matrise__up" />
                    {match !== undefined && <span>({tilProsent(match)})</span>} {tittel}
                </h3>
            </summary>

            <ForkortetMatrise erfaring={erfaring} minimumTreffprosent={minimumTreffprosent} />

            <details className="matchdetaljer-matrise">
                <summary>
                    <Expand className="matchdetaljer-seksjon__ikon--ned" />
                    <Collapse className="matchdetaljer-seksjon__ikon--opp" />
                    Matchdetaljer
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
                )
            </details>
        </details>
    );
};

export default Matrise;
