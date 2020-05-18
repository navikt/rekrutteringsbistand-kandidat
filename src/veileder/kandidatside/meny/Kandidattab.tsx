import React, { FunctionComponent } from 'react';
import { useLocation, useRouteMatch, Link } from 'react-router-dom';
import { Normaltekst, Element } from 'nav-frontend-typografi';

interface Props {
    sti: string;
    label: string;
}

const Kandidattab: FunctionComponent<Props> = ({ sti, label }) => {
    const { search, pathname } = useLocation();
    const { url } = useRouteMatch();

    const aktiv = pathname.split('/').reverse()[0] === sti;

    return (
        <Link
            className={`kandidatmeny__tab${aktiv ? ' kandidatmeny__tab--aktiv' : ''}`}
            to={`${url}/${sti}${search}`}
        >
            {label}
        </Link>
    );
};

export default Kandidattab;
