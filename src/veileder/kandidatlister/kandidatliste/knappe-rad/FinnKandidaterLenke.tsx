import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

type Props = {
    stillingsId: string | null;
    kandidatlisteId: string;
};

const FinnKandidaterLenke: FunctionComponent<Props> = ({ stillingsId, kandidatlisteId }) => (
    <Link
        to={
            stillingsId
                ? `/kandidater/stilling/${stillingsId}`
                : `/kandidater/kandidatliste/${kandidatlisteId}`
        }
        className="finn-kandidater FinnKandidater"
    >
        <i className="FinnKandidater__icon" />
        <span className="link">Finn kandidater</span>
    </Link>
);

export default FinnKandidaterLenke;
