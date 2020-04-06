import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import './IngenKandidater.less';

const IngenKandidater: FunctionComponent = ({ children }) => {
    return <Element className="ingen-kandidater">{children}</Element>;
};

export default IngenKandidater;
