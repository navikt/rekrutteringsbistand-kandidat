import React from 'react';
import PropTypes from 'prop-types';
import { VeilederHeaderMeny } from 'pam-frontend-header';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import '../../../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import './Toppmeny.less';

export const KandidatsokHeader = ({ innloggetVeileder, activeTabID }) => (
    <div className="top-menu">
        <VeilederHeaderMeny activeTabID={activeTabID} innloggetBruker={innloggetVeileder} />
        <div className="top-menu__nyheter">
            <NyttIRekrutteringsbistand orientering="under-hoyre" />
        </div>
    </div>
);

const propTypes = {
    activeTabID: PropTypes.string.isRequired,
    innloggetVeileder: PropTypes.string.isRequired,
};

KandidatsokHeader.propTypes = propTypes;
