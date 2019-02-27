import React from 'react';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';

const HjelpetekstFading = ({ synlig, type, tekst, id, className }) => (
    <div aria-live="assertive">
        <AlertStripe id={id} type={type} className={`${className}${synlig ? ' HjelpetekstFading fading synlig' : ' HjelpetekstFading fading'}`} solid>
            {tekst}
        </AlertStripe>
    </div>
);

HjelpetekstFading.defaultProps = {
    id: undefined,
    className: ''
};

HjelpetekstFading.propTypes = {
    synlig: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    tekst: PropTypes.string.isRequired,
    id: PropTypes.string,
    className: PropTypes.string
};

export default HjelpetekstFading;
