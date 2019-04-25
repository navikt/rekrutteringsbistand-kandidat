import React from 'react';
import PropTypes from 'prop-types';
import './Score.less';

export default function Score({ value }) {

    const limitOneFilled = 20;
    const limitTwoFilled = 50;
    const limitThreeFilled = 80;
    return (
        <div className="match-score">
            <div className={value > limitOneFilled ? 'rectangle--filled' : 'rectangle'} />
            <div className={value > limitTwoFilled ? 'rectangle--filled' : 'rectangle'} />
            <div className={value > limitThreeFilled ? 'rectangle--filled' : 'rectangle'} />
        </div>
    );
}

Score.propTypes = {
    value: PropTypes.number.isRequired
};
