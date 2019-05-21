import * as React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import { Hovedknapp } from 'pam-frontend-knapper';
import './TomListe.less';

const TomListe = ({ children, lenke, lenkeTekst, knappTekst, onClick }) => {
    const visLenke = lenke !== undefined && lenke.length > 0;

    return (
        <Panel className="TomListe">
            <Undertittel>
                { children }
            </Undertittel>
            { visLenke && (<Link className="link" to={lenke}>{lenkeTekst}</Link>)}
            { knappTekst && onClick && <Hovedknapp className="TomListe-knapp" onClick={onClick}>{knappTekst}</Hovedknapp>}
        </Panel>
    );
};

TomListe.defaultProps = {
    lenke: '',
    lenkeTekst: undefined,
    knappTekst: undefined,
    onClick: undefined
};

TomListe.propTypes = {
    lenke: PropTypes.string,
    lenkeTekst: PropTypes.string,
    knappTekst: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string.isRequired
};

export default TomListe;
