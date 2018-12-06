import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LOGIN_URL } from '../../common/fasitProperties';
import ManglerRolle from './ManglerRolle';
import GenerellFeilside from './GenerellFeilside';
import NotFound from './NotFound';

class ErrorSide extends React.Component {
    constructor(props) {
        super();
        if (props.error.status === 401) {
            window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
        }
    }

    componentDidUpdate(prevProps) {
        const { error, fjernError } = this.props;
        if (error.status === 401) {
            window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
        }
        if (this.props.location.pathname !== prevProps.location.pathname) {
            fjernError();
        }
    }

    render() {
        const { error } = this.props;
        if (error && error.status === 403) {
            return <ManglerRolle />;
        } else if (error && error.status === 404) {
            return <NotFound />;
        }
        return <GenerellFeilside />;
    }
}

ErrorSide.propTypes = {
    fjernError: PropTypes.func.isRequired,
    error: PropTypes.shape({
        status: PropTypes.number
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string
    }).isRequired
};

export default withRouter(ErrorSide);
