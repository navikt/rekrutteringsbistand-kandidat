import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendChevron from 'nav-frontend-chevron';
import './SokekriteriePanel.less';

const SokekriteriePanel = ({ children, tittel, apen, onClick, id }) => {
    return (
        <div className="SokekriteriePanel">
            <button
                className="SokekriteriePanel__hode"
                aria-expanded={apen ? 'true' : 'false'}
                type="button"
                aria-controls={apen ? `${id}-innhold` : null}
                onClick={onClick}
            >
                <div className="SokekriteriePanel__flex-wrapper">
                    <span className="SokekriteriePanel__heading">{tittel}</span>
                    <NavFrontendChevron type={apen ? 'opp' : 'ned'} />
                </div>
            </button>
            {apen && (
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
    tittel: PropTypes.string.isRequired,
    apen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SokekriteriePanel;
