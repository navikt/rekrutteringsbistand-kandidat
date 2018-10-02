import * as React from 'react';
import PropTypes from 'prop-types';
import './kandidatlister.less';

const KandidatlisteHeader = ({ children }) => (
    <div className="KandidatlisteHeader">
        <div className="KandidatlisteHeader__content">
            { children }
        </div>
    </div>
);

KandidatlisteHeader.propTypes = {
    children: PropTypes.node.isRequired
};

export default KandidatlisteHeader;
