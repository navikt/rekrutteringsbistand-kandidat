import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { tilProsent } from '../formatering';
import { ErfaringPrototype } from '../Kandidatmatch';
import ForkortetMatrise from './ForkortetMatrise';
import { IngenData } from './Matchforklaring';
import Matchdetaljer from './Matchdetaljer';

type Props = {
    erfaring: ErfaringPrototype;
    tittel: string;
    match?: number;
};

const Matrise = ({ erfaring, tittel, match }: Props) => {
    const minimumTreffprosent: Number = 25;

    if (erfaring.ord_score.length === 0) {
        return <IngenData />;
    }

    return (
        <details className="matchforklaring-matrise">
            <summary>
                <h3>
                    <ChevronDownIcon className="matchforklaring-matrise__down" />
                    <ChevronUpIcon className="matchforklaring-matrise__up" />
                    {match !== undefined && <span>({tilProsent(match)})</span>} {tittel}
                </h3>
            </summary>

            <ForkortetMatrise erfaring={erfaring} minimumTreffprosent={minimumTreffprosent} />
            <Matchdetaljer erfaring={erfaring} />
        </details>
    );
};

export default Matrise;
