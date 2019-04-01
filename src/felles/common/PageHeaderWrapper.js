import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'nav-frontend-grid';
import './PageHeaderWrapper.less';

const PageHeader = ({ children }) => (
    <div className="PageHeader">
        <Container className="PageHeader__container">
            { children }
        </Container>
    </div>
);

PageHeader.propTypes = {
    children: PropTypes.node.isRequired
};

export default PageHeader;
