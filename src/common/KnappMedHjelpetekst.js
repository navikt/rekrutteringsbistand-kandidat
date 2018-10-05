import React from 'react';
import PropTypes from 'prop-types';
import KnappBase from 'nav-frontend-knapper';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';

const KnappMedHjelpetekst = ({ disabled, onClick, type, children, spinner, mini, hjelpetekst }) => {
    if (disabled) {
        const disabledClasses = 'knapp knapp--disabled knapp--disabled--clickable';

        const DisabledKnapp = () => (<div className={mini ? `${disabledClasses} knapp--mini` : disabledClasses}>{children}</div>);
        return (

            <HjelpetekstMidt
                className="hjelpetekst--slett"
                id="marker-kandidater-hjelpetekst"
                anchor={DisabledKnapp}
            >
                {hjelpetekst}
            </HjelpetekstMidt>

        );
    }
    return <KnappBase mini={mini} spinner={spinner} type={type} onClick={onClick}>{children}</KnappBase>;
};

KnappMedHjelpetekst.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hjelpetekst: PropTypes.string.isRequired,
    type: PropTypes.string,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    mini: PropTypes.bool
};

KnappMedHjelpetekst.defaultProps = {
    type: 'standard',
    children: '',
    spinner: false,
    mini: false
};

export default KnappMedHjelpetekst;
