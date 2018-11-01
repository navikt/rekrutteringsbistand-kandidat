import * as React from 'react';
import PropTypes from 'prop-types';
import './PageHeaderWrapper.less';

const PageHeader = ({ children }) => (
    <div className="PageHeader">
        <div className="PageHeader__content">
            { children }
        </div>
    </div>
);

PageHeader.propTypes = {
    children: PropTypes.node.isRequired
};

export default PageHeader;
