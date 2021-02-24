import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import './FåKandidaterAlert.less';

const FåKandidaterAlert = ({ totaltAntallTreff }) => (
    <div className="info--wrapper">
        <i className="info--icon" />
        <Element className="info--text">
            {`${totaltAntallTreff} ${
                totaltAntallTreff === 1 ? 'kandidat' : 'kandidater'
            } matcher søket. For flere treff velg færre kriterier`}
        </Element>
    </div>
);

FåKandidaterAlert.propTypes = {
    totaltAntallTreff: PropTypes.number.isRequired,
};

export default FåKandidaterAlert;
