import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { HjelpetekstUnderVenstre } from 'nav-frontend-hjelpetekst';
import './KnappMedHjelpetekst.less';

const KnappMedHjelpetekst = ({ disabled, onClick, children, spinner, hjelpetekst, id, tittel }) => {
    if (disabled) {
        const DisabledKnapp = () => <div className="knapp knapp--disabled">{children}</div>;

        return (
            <HjelpetekstUnderVenstre
                id="marker-kandidater-hjelpetekst"
                anchor={DisabledKnapp}
                tittel={tittel}
                className="KnappMedHjelpetekst"
            >
                {hjelpetekst}
            </HjelpetekstUnderVenstre>
        );
    }

    return (
        <Hovedknapp spinner={spinner} onClick={onClick} id={id}>
            {children}
        </Hovedknapp>
    );
};

KnappMedHjelpetekst.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hjelpetekst: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    id: PropTypes.string,
};

KnappMedHjelpetekst.defaultProps = {
    children: '',
    spinner: false,
    id: undefined,
};

export default KnappMedHjelpetekst;
