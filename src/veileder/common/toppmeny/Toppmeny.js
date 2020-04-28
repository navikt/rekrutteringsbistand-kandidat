import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VeilederHeaderMeny } from 'pam-frontend-header';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import './Toppmeny.less';

const Toppmeny = ({ innloggetVeileder, activeTabID, visNyheter }) => (
    <div className="toppmeny">
        <VeilederHeaderMeny activeTabID={activeTabID} innloggetBruker={innloggetVeileder} />
        {visNyheter && (
            <div className="toppmeny__nyheter">
                <NyttIRekrutteringsbistand orientering="under-hoyre" />
            </div>
        )}
    </div>
);

Toppmeny.propTypes = {
    visNyheter: PropTypes.bool.isRequired,
    activeTabID: PropTypes.string.isRequired,
    innloggetVeileder: PropTypes.string.isRequired,
};

export default connect(
    (state) => ({
        visNyheter: state.search.featureToggles['vis-nyheter'],
    }),
    () => ({})
)(Toppmeny);
