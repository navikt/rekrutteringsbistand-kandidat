import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LOGOUT_URL } from '../fasitProperties';
import HeaderMeny, { TAB_ID } from '../module/HeaderMeny';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from '../../arbeidsgiver/arbeidsgiverReducer';

const loggUt = () => {
    window.location.href = LOGOUT_URL;
};

const Toppmeny = ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver, activeTabID }) => {
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
};

Toppmeny.defaultProps = {
    valgtArbeidsgiverId: undefined
};

Toppmeny.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired,
    valgtArbeidsgiverId: PropTypes.string,
    velgArbeidsgiver: PropTypes.func.isRequired,
    resetArbeidsgiver: PropTypes.func.isRequired,
    activeTabID: PropTypes.string.isRequired
};


const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

const KandidatsokHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={TAB_ID.KANDIDATSOK} />
);

const KandidatlisteHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={TAB_ID.KANDIDATLISTER} />
);

export const KandidatsokHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatsokHeaderComponent);

export const KandidatlisteHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatlisteHeaderComponent);
