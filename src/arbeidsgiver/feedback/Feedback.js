import React from 'react';
import { USE_JANZZ } from '../common/fasitProperties';
import './Feedback.less';

export default () => (
    <div className="Feedback">
        <a
            className="Feedback__link"
            href={USE_JANZZ ? 'https://surveys.hotjar.com/s?siteId=118350&surveyId=133020'
                : 'https://in.hotjar.com/s?siteId=118350&surveyId=118054'}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className="Feedback__link__inner">
                Gi tilbakemelding
            </span>
        </a>
    </div>
);
