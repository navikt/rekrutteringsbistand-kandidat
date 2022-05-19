import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';
import { hentStilling } from '../kandidatmatch/kandidatmatchApi';
import './KandidatmatchStillingPrototype.less';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { lenkeTilStilling, lenkeTilKandidatside, Kandidatfane } from '../app/paths';

type Props = RouteChildrenProps<{
    stillingId: string;
}>;

type Stilling = {
    uuid: string;
    title: string;
};

const KandidatmatchStillingPrototype: FunctionComponent<Props> = ({ match }) => {
    const [kandiater, setKandidater] = useState<Prototype[] | undefined>(undefined);
    const [stilling, setStilling] = useState<Stilling | undefined>(undefined);

    useEffect(() => {
        console.log('Henter ai data');
        const hentPrototype = async () => {
            try {
                const stillingsId = match?.params.stillingId!;
                const stilling = await hentStilling(stillingsId);
                setStilling(stilling.stilling);

                const response = await fetch('/kandidatmatch-api/match', {
                    method: 'POST',
                    body: JSON.stringify({
                        stilling,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Returnerer ai data', data);
                    setKandidater(data);
                } else {
                    console.log('Kall mot ai feilet, status', response.status);
                    throw await response.text();
                }
            } catch (e) {
                console.log(e);
            }
        };

        hentPrototype();
    }, [match?.params.stillingId]);

    const score = (scoreDesimal) => {
        const score = Math.round(scoreDesimal * 100);
        return `(${isNaN(score) ? 0 : score}% Match)`;
    };

    kandiater?.sort((a, b) => b.score - a.score);

    console.log('kandidater', kandiater);
    console.log('stilling', stilling);

    const lenkeTilKandidat = (kandidatId: string) =>
        lenkeTilKandidatside(
            kandidatId,
            Kandidatfane.Cv,
            undefined,
            stilling?.uuid,
            undefined,
            true
        );
    return (
        <div>
            {stilling && (
                <div className="prototype">
                    <div className="blokk-xl">
                        <h1>{stilling.title}</h1>
                        <Link to={lenkeTilStilling(stilling?.uuid!)} className="lenke">
                            Se stillingsannonse
                        </Link>
                    </div>
                    <div className="blokk-xl">
                        Matcher
                        <ul>
                            {kandiater?.map((k) => (
                                <li key={k.aktoerId}>
                                    {k.fornavn} {k.etternavn} {score(k.score)}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Link
                                        className="kandidatmatch__navn"
                                        to={lenkeTilKandidat(k.arenaKandidatnr)}
                                    >
                                        {' '}
                                        CV
                                    </Link>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Link
                                        to={`/prototype/stilling/${stilling.uuid}/kandidat/${k.arenaKandidatnr}`}
                                    >
                                        {' '}
                                        Match
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KandidatmatchStillingPrototype;
