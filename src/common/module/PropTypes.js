import PropTypes from 'prop-types';

export default PropTypes.arrayOf(PropTypes.shape({
    orgnr: PropTypes.string,
    orgnavn: PropTypes.string
}));
