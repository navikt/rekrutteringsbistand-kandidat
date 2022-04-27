import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Kandidatfane, lenkeTilKandidatside } from '../app/paths';

export type ForeslåttKandidat = {
    fodselsnummer: string;
    fornavn: string;
    etternavn: string;
    arenaKandidatnr: string;
    score_utdannelse: number;
    score_jobbprofil: number;
    score_arbeidserfaring: number;
};

type Props = {
    stillingsId: string;
    kandidat: ForeslåttKandidat;
};

const VisForeslåttKandidat: FunctionComponent<Props> = ({ kandidat, stillingsId }) => {
    const lenkeTilKandidat = () =>
        lenkeTilKandidatside(
            kandidat.arenaKandidatnr,
            Kandidatfane.Cv,
            undefined,
            stillingsId,
            undefined,
            true
        );

    return (
        <>
            <Link to={lenkeTilKandidat}>
                {kandidat.fornavn} {kandidat.etternavn}
            </Link>
        </>
    );
};

export default VisForeslåttKandidat;
