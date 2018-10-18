import PropTypes from 'prop-types';

export default PropTypes.arrayOf(PropTypes.shape({
    orgNummer: PropTypes.string,
    navn: PropTypes.string
}));
