import React from 'react';
import PropTypes from 'prop-types';
import { TotalScoreLimitEnum, ScoreLimitEnum } from './ScoreLimitEnum';
import './Score.less';

export default function Score({ value, isTotalScore = false }) {
    const limitEnumm = isTotalScore ? TotalScoreLimitEnum : ScoreLimitEnum;
    
    if (value < limitEnumm.LIMIT_1) {
        return <div />;
    }
    return (
        <div className="match-score">
            <div className={value >= limitEnumm.LIMIT_1 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnumm.LIMIT_2 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnumm.LIMIT_3 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnumm.LIMIT_4 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnumm.LIMIT_5 ? 'scoreIcon--filled' : 'scoreIcon'} />
        </div>
    );
}

Score.defaultProps = {
    isTotalScore: false
};

Score.propTypes = {
    value: PropTypes.number.isRequired,
    isTotalScore: PropTypes.bool
};
