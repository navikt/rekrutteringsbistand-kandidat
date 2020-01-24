import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'nav-frontend-grid';
import './PageHeaderWrapper.less';

const PageHeader = ({ children, className }) => (
    <div className={`PageHeader${className ? ` ${className}` : ''}`}>
        <Container className="PageHeader__container">{children}</Container>
    </div>
);

PageHeader.defaultProps = {
    className: undefined,
};

PageHeader.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default PageHeader;
