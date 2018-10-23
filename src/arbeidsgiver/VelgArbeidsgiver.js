import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VelgArbeidsgiver } from 'pam-frontend-header';
import 'pam-frontend-header/dist/style.css';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from './arbeidsgiverReducer';


const VelgArbeidsgiverComponent = ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver }) => {
    const onArbeidsgiverSelect = (orgNummer) => {
        if (orgNummer) {
            velgArbeidsgiver(orgNummer);
        } else {
            resetArbeidsgiver();
        }
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
