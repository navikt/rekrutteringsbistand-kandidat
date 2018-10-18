import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidsgiverSelect from './ArbeidsgiverSelect';
import ArbeidsgiverListePropTypes from './PropTypes';
import './HeaderMeny.less';

export const TAB_ID = {
    VAAR_SIDE: 'VAAR_SIDE',
    KANDIDATSOK: 'KANDIDATSOK',
    KANDIDATLISTER: 'KANDIDATLISTER',
    STILLINGSREGISTRERING: 'STILLINGSREGISTRERING'
};

const TABS = [
    {
        id: TAB_ID.VAAR_SIDE,
        tittel: 'Vår side',
        href: '/stillingsregistrering'
    },
    {
        id: TAB_ID.KANDIDATSOK,
        tittel: 'Kandidatsøk',
        href: '/pam-kandidatsok'
    },
    {
        id: TAB_ID.KANDIDATLISTER,
        tittel: 'Kandidatlister',
        href: '/pam-kandidatsok/lister'
    },
    {
        id: TAB_ID.STILLINGSREGISTRERING,
        tittel: 'Stillingsregistrering',
        href: '/stillingsregistrering/vilkaar'
    }
];

const tabErIPamKandidatsok = (tabId) => (
    tabId === TAB_ID.KANDIDATSOK || tabId === TAB_ID.KANDIDATLISTER
);

const HeaderMeny = ({ onLoggUt, onArbeidsgiverSelect, arbeidsgivere, valgtArbeidsgiverId, activeTabID }) => {
    const onLoggUtClick = () => {
        sessionStorage.removeItem('orgnr');
        onLoggUt();
    };
    return (
        <div className="HeaderMeny">
            <div className="topp">
                <div className="logo">
                    <a href="/">Arbeidsplassen</a>
                </div>
                <div>
                    {arbeidsgivere.length === 1 ? (
                        <Normaltekst className="topmeny-navn">
                            {arbeidsgivere[0].orgnavn}
                        </Normaltekst>
                    ) :
                        (arbeidsgivere.length > 1 && valgtArbeidsgiverId !== undefined && (
                            <ArbeidsgiverSelect
                                arbeidsgivere={arbeidsgivere}
                                valgtArbeidsgiverId={valgtArbeidsgiverId}
                                onArbeidsgiverSelect={onArbeidsgiverSelect}
                            />
                        ))}
                </div>
                <div>
                    <Knapp onClick={onLoggUtClick} id="logg-ut" className="knapp knapp--mini knapp--loggut">
                        Logg ut
                    </Knapp>
                </div>
            </div>
            <div className="meny">
                <ul>
                    {TABS.map((tab) => (
                        tabErIPamKandidatsok(tab.id) && tabErIPamKandidatsok(activeTabID)
                            ? <Link to={tab.href} className="meny--lenke" key={tab.id}>
                                <li className={tab.id === activeTabID ? 'active' : 'not-active'}>
                                    {tab.tittel}
                                </li>
                            </Link>
                            : <a href={tab.href} className="meny--lenke" key={tab.id}>
                                <li className={tab.id === activeTabID ? 'active' : 'not-active'}>
                                    {tab.tittel}
                                </li>
                            </a>
                    ))}
                </ul>
            </div>
        </div>
    );
};

HeaderMeny.defaultProps = {
    valgtArbeidsgiverId: undefined
};

HeaderMeny.propTypes = {
    onLoggUt: PropTypes.func.isRequired,
    onArbeidsgiverSelect: PropTypes.func.isRequired,
    arbeidsgivere: ArbeidsgiverListePropTypes.isRequired,
    valgtArbeidsgiverId: PropTypes.string,
    activeTabID: PropTypes.oneOf(Object.values(TAB_ID)).isRequired
};

export default HeaderMeny;
