import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendChevron from 'nav-frontend-chevron';

import { logEvent } from '../../../veileder/amplitude/amplitude';
import './SokekriteriePanel.less';

const SokekriteriePanel = ({ children, tittel, fane, apen: erÅpen, onClick, id }) => {
    const onClickMedLogging = () => {
        if (!erÅpen) {
            logEvent('kandidatsøk_filterfane', 'åpne', { fane });
        }

        onClick();
    };

    return (
        <div className="SokekriteriePanel">
            <button
                className="SokekriteriePanel__hode"
                aria-expanded={erÅpen ? 'true' : 'false'}
                type="button"
                aria-controls={erÅpen ? `${id}-innhold` : null}
                onClick={onClickMedLogging}
            >
                <div className="SokekriteriePanel__flex-wrapper">
                    <span className="SokekriteriePanel__heading">{tittel}</span>
                    <NavFrontendChevron type={erÅpen ? 'opp' : 'ned'} />
                </div>
            </button>
            {erÅpen && (
                <div className="SokekriteriePanel__innhold" id={`${id}-innhold`}>
                    {children}
                </div>
            )}
        </div>
    );
};

SokekriteriePanel.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    tittel: PropTypes.any.isRequired,
    fane: PropTypes.string.isRequired,
    apen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SokekriteriePanel;
