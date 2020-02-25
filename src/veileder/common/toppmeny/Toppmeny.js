import React from 'react';
import PropTypes from 'prop-types';
import { VeilederHeaderMeny } from 'pam-frontend-header';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import '../../../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import './Toppmeny.less';
import { connect } from 'react-redux';

const KandidatsokHeader = ({ innloggetVeileder, activeTabID, visNyheter }) => (
    <div className="top-menu">
        <VeilederHeaderMeny activeTabID={activeTabID} innloggetBruker={innloggetVeileder} />
        {visNyheter && (
            <div className="top-menu__nyheter">
                <NyttIRekrutteringsbistand orientering="under-hoyre" />
            </div>
        )}
    </div>
);

KandidatsokHeader.propTypes = {
    visNyheter: PropTypes.bool.isRequired,
    activeTabID: PropTypes.string.isRequired,
    innloggetVeileder: PropTypes.string.isRequired,
};

export default connect(
    state => ({
        visNyheter: state.search.featureToggles['vis-nyheter'],
    }),
    () => ({})
)(KandidatsokHeader);
