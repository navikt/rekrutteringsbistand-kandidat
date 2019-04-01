import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';

const TilbakeLenke = ({ href, tekst }) => (
    <div className="TilbakeLenke">
        <NavFrontendChevron type="venstre" />
        <Link to={href} className="TilbakeLenke__lenke link">{tekst}</Link>
    </div>
);

TilbakeLenke.propTypes = {
    href: PropTypes.string.isRequired,
    tekst: PropTypes.string.isRequired
};

export default TilbakeLenke;
