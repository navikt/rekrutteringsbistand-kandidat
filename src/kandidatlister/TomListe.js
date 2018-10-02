import * as React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

import './kandidatlister.less';

const TomListe = ({ children, lenke, lenkeTekst }) => {
    const visLenke = lenke !== undefined && lenke.length > 0;

    return (
        <Panel className="TomListe">
            <Undertittel>
                { children }
            </Undertittel>
            { visLenke && (<Lenke href={lenke}>{lenkeTekst}</Lenke>)}
        </Panel>
    );
};

TomListe.defaultProps = {
    lenke: ''
};

TomListe.propTypes = {
    lenke: PropTypes.string,
    lenkeTekst: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
};

export default TomListe;
