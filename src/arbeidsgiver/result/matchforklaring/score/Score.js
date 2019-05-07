import React from 'react';
import PropTypes from 'prop-types';
import { TotalScoreLimitEnum, ScoreLimitEnum } from './ScoreLimitEnum';
import './Score.less';

export default function Score({ value, isTotalScore = false }) {
    const limitEnum = isTotalScore ? TotalScoreLimitEnum : ScoreLimitEnum;
    let ariaLabel = 'Match 0 av 5';
    if (value >= limitEnum.LIMIT_5) {
        ariaLabel = 'Match 5 av 5';
    } else if (value >= limitEnum.LIMIT_4) {
        ariaLabel = 'Match 4 av 5';
    } else if (value >= limitEnum.LIMIT_3) {
        ariaLabel = 'Match 3 av 5';
    } else if (value >= limitEnum.LIMIT_2) {
        ariaLabel = 'Match 2 av 5';
    } else if (value >= limitEnum.LIMIT_1) {
        ariaLabel = 'Match 1 av 5';
    }

    return (
        <div className="match-score" aria-label={ariaLabel}>
            <div className={value >= limitEnum.LIMIT_1 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnum.LIMIT_2 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnum.LIMIT_3 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnum.LIMIT_4 ? 'scoreIcon--filled' : 'scoreIcon'} />
            <div className={value >= limitEnum.LIMIT_5 ? 'scoreIcon--filled' : 'scoreIcon'} />
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
