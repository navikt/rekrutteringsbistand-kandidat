import React from 'react';
import PropTypes from 'prop-types';

export default class LeggTilKnapp extends React.Component {
    render() {
        const { children, ...props } = this.props;
        return (
            <button
                ref={(button) => { this.button = button; }}
                className="lenke dashed"
                {...props}
            >
                + {children}
            </button>
        );
    }
}

LeggTilKnapp.defaultProps = {
    autoFocus: false
};

LeggTilKnapp.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.string.isRequired
};
