import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { lenkeTilFinnKandidater } from '../../app/paths';

type Props = {
    stillingId: string | null;
    kandidatlisteId: string;
};

const FinnKandidaterLenke: FunctionComponent<Props> = ({ stillingId, kandidatlisteId }) => (
    <Link
        to={lenkeTilFinnKandidater(stillingId, kandidatlisteId)}
        className="finn-kandidater FinnKandidater lenke"
    >
        <i className="FinnKandidater__icon" />
        <span>Finn kandidater</span>
    </Link>
);

export default FinnKandidaterLenke;
