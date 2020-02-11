import React from 'react';
import PropTypes from 'prop-types';
import { VeilederHeaderMeny, VeilederTabId } from 'pam-frontend-header';

export const KandidatsokHeader = ({ innloggetVeileder }) => (
    <VeilederHeaderMeny
        activeTabID={VeilederTabId.KANDIDATSOK}
        innloggetBruker={innloggetVeileder}
    />
);

export const KandidatlisteHeader = ({ innloggetVeileder }) => (
    <VeilederHeaderMeny
        activeTabID={VeilederTabId.KANDIDATLISTER}
        innloggetBruker={innloggetVeileder}
    />
);

const propTypes = {
    innloggetVeileder: PropTypes.string.isRequired,
};

KandidatsokHeader.propTypes = propTypes;
KandidatlisteHeader.propTypes = propTypes;
