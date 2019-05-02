import React from 'react';
import PropTypes from 'prop-types';
import ScoreLimitEnum from './ScoreLimitEnum';
import './Score.less';

export default function Score({ value }) {
    return (
        <div className="match-score">
            <div className={value >= ScoreLimitEnum.LIMIT_1 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= ScoreLimitEnum.LIMIT_2 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= ScoreLimitEnum.LIMIT_3 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= ScoreLimitEnum.LIMIT_4 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= ScoreLimitEnum.LIMIT_5 ? 'scoreIcon--filled' : 'scoreIcon'} />
        </div>
    );
}

Score.propTypes = {
    value: PropTypes.number.isRequired
};
