import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VelgArbeidsgiver } from 'pam-frontend-header';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from './arbeidsgiverReducer';
import { LOGOUT_URL } from '../common/fasitProperties';


const VelgArbeidsgiverComponent = ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver }) => {
    const onArbeidsgiverSelect = (orgNummer) => {
        if (orgNummer) {
            velgArbeidsgiver(orgNummer);
        } else {
            resetArbeidsgiver();
        }
    };
    const onLoggUt = () => {
        sessionStorage.clear();
        window.location.href = LOGOUT_URL;
    };
    const mappedeArbeidsgivere = arbeidsgivere.map((arbeidsgiver) => ({
        navn: arbeidsgiver.orgnavn,
        orgNummer: arbeidsgiver.orgnr
    }));
    return (
        <VelgArbeidsgiver
            arbeidsgivere={mappedeArbeidsgivere}
            valgtArbeidsgiverId={valgtArbeidsgiverId}
            onArbeidsgiverSelect={onArbeidsgiverSelect}
            onLoggUt={onLoggUt}
        />
    );
};

VelgArbeidsgiverComponent.defaultProps = {
    valgtArbeidsgiverId: undefined
};

VelgArbeidsgiverComponent.propTypes = {
    velgArbeidsgiver: PropTypes.func.isRequired,
    resetArbeidsgiver: PropTypes.func.isRequired,
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired,
    valgtArbeidsgiverId: PropTypes.string
};

const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

export default connect(mapStateToProps, mapDispatchToProps)(VelgArbeidsgiverComponent);
