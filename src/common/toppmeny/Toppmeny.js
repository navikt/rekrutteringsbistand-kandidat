/* eslint-disable react/prop-types */

import React from 'react';
import { connect } from 'react-redux';
import { LOGOUT_URL } from '../fasitProperties';
import HeaderMeny, { TAB_ID } from '../module/HeaderMeny';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from '../../arbeidsgiver/arbeidsgiverReducer';

const loggUt = () => {
    window.location.href = LOGOUT_URL;
};

const toppmenyForTab = (activeTabID) => (
    ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver }) => {
        const onArbeidsgiverSelect = (orgNummer) => {
            if (orgNummer) {
                velgArbeidsgiver(orgNummer);
            } else {
                resetArbeidsgiver();
            }
        };
        return (
            <HeaderMeny
                onLoggUt={loggUt}
                onArbeidsgiverSelect={onArbeidsgiverSelect}
                arbeidsgivere={arbeidsgivere}
                valgtArbeidsgiverId={valgtArbeidsgiverId}
                activeTabID={activeTabID}
            />
        );
    }
);

const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

export const KandidatsokHeader = connect(mapStateToProps, mapDispatchToProps)(toppmenyForTab(TAB_ID.KANDIDATSOK));
export const KandidatlisteHeader = connect(mapStateToProps, mapDispatchToProps)(toppmenyForTab(TAB_ID.KANDIDATLISTER));

