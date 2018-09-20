import React from 'react';
import PropTypes from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';

const HjelpetekstFading = ({ synlig, type, tekst }) => (
    <AlertStripe type={type} className={synlig ? 'HjelpetekstFading fading synlig' : 'HjelpetekstFading fading'} solid>
        {tekst}
    </AlertStripe>
);

HjelpetekstFading.propTypes = {
    synlig: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    tekst: PropTypes.string.isRequired
};

export default HjelpetekstFading;
