import React, { FunctionComponent } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';

interface Props {
    sti: string;
    label: string;
}

const Kandidattab: FunctionComponent<Props> = ({ sti, label }) => {
    const { search, pathname } = useLocation();
    const { kandidatnr } = useParams();

    const aktiv = pathname.split('/').reverse()[0] === sti;

    return (
        <Link
            className={`kandidatmeny__tab${aktiv ? ' kandidatmeny__tab--aktiv' : ''}`}
            to={`/kandidater/kandidat/${kandidatnr}/${sti}${search}`}
        >
            {label}
        </Link>
    );
};

export default Kandidattab;
