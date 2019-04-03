import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'pam-frontend-knapper';
import { HjelpetekstUnder } from 'nav-frontend-hjelpetekst';

const KnappMedHjelpetekst = ({ disabled, onClick, type, children, spinner, mini, hjelpetekst, id, tittel }) => {
    if (disabled) {
        const disabledClasses = 'Knapp Knapp--disabled';

        const DisabledKnapp = () => (<div className={mini ? `${disabledClasses} Knapp--mini` : disabledClasses}>{children}</div>);
        return (
            <HjelpetekstUnder
                id="marker-kandidater-hjelpetekst"
                anchor={DisabledKnapp}
                tittel={tittel}
            >
                {hjelpetekst}
            </HjelpetekstUnder>
        );
    }
    return <Hovedknapp mini={mini} spinner={spinner} type={type} onClick={onClick} id={id}>{children}</Hovedknapp>;
};

KnappMedHjelpetekst.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hjelpetekst: PropTypes.string.isRequired,
    type: PropTypes.string,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    mini: PropTypes.bool,
    id: PropTypes.string,
    tittel: PropTypes.string.isRequired
};

KnappMedHjelpetekst.defaultProps = {
    type: 'standard',
    children: '',
    spinner: false,
    mini: false,
    id: undefined
};

export default KnappMedHjelpetekst;
