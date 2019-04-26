import React from 'react';
import PropTypes from 'prop-types';
import ScoreLimitEnum from './ScoreLimitEnum';
import './Score.less';

export default function Score({ value }) {
    return (
        <div className="match-score">
            <div className={value >= ScoreLimitEnum.LIMIT_1 ? 'rectangle--filled' : 'rectangle'} />
            <div className={value >= ScoreLimitEnum.LIMIT_2 ? 'rectangle--filled' : 'rectangle'} />
            <div className={value >= ScoreLimitEnum.LIMIT_3 ? 'rectangle--filled' : 'rectangle'} />
            <div className={value >= ScoreLimitEnum.LIMIT_4 ? 'rectangle--filled' : 'rectangle'} />
            <div className={value >= ScoreLimitEnum.LIMIT_5 ? 'rectangle--filled' : 'rectangle'} />
        </div>
    );
}

Score.propTypes = {
    value: PropTypes.number.isRequired
};
