import React from 'react';
import Proptypes from 'prop-types';
import { Column } from 'nav-frontend-grid';
import Chevron from 'nav-frontend-chevron';
import { Sidetittel } from 'nav-frontend-typografi';
import PageHeader from '../../../felles/common/PageHeaderWrapper';
import './SubHeader.less';

const SubHeader = ({ backLink, backLinkText, title }) => (
    <PageHeader className="SubHeader">
        <Column xs="12" sm="3" className="back-link">
            {backLink && (
                <React.Fragment>
                    <Chevron type="venstre" />
                    <a href={backLink}>
                        {backLinkText}
                    </a>
                </React.Fragment>
            )}
        </Column>
        <Column xs="12" sm="6" className="text-center">
            <Sidetittel className="display-1">{title}</Sidetittel>
        </Column>
        <Column xs="12" sm="3" />
    </PageHeader>
);

SubHeader.defaultProps = {
    backLink: undefined,
    backLinkText: undefined
};

SubHeader.propTypes = {
    backLink: Proptypes.string,
    backLinkText: Proptypes.string,
    title: Proptypes.string.isRequired
};

export default SubHeader;
