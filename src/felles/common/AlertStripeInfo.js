import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import './AlertStripeInfo.less';

const AlertStripeInfo = ({ totaltAntallTreff }) => (
    <div className="info--wrapper">
        <i className="info--icon" />
        <Element className="info--text">
            {`${totaltAntallTreff} ${totaltAntallTreff === 1 ? 'kandidat' : 'kandidater'} matcher søket. For flere treff velg færre kriterier`}
        </Element>
    </div>
);

AlertStripeInfo.propTypes = {
    totaltAntallTreff: PropTypes.number.isRequired
};

export default AlertStripeInfo;
