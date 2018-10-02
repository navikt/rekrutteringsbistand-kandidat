import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'nav-frontend-skjema';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from './arbeidsgiverReducer';

class ArbeidsgiverSelect extends React.Component {
    onArbeidsgiverChange = (e) => {
        if (e.target.value !== '0') {
            this.props.velgArbeidsgiver(e.target.value);
        } else {
            this.props.resetArbeidsgiver();
        }
    };

    render() {
        const { arbeidsgivere, valgtArbeidsgiverId } = this.props;
        return (
            <Select
                className="topmeny-select topmeny-mr"
                label=""
                id="arbeidsgiver-select"
                onChange={this.onArbeidsgiverChange}
                value={valgtArbeidsgiverId || undefined}
                bredde="m"
            >
                <option value="0">Velg arbeidsgiver</option>
                {arbeidsgivere && arbeidsgivere.map((arbeidsgiver) =>
                    (
                        <option key={arbeidsgiver.orgnr} value={arbeidsgiver.orgnr}>
                            {arbeidsgiver.orgnavn}
                        </option>))
                };
            </Select>
        );
    }
}

ArbeidsgiverSelect.defaultProps = {
    valgtArbeidsgiverId: undefined
};

ArbeidsgiverSelect.propTypes = {
    valgtArbeidsgiverId: PropTypes.string,
    velgArbeidsgiver: PropTypes.func.isRequired,
    resetArbeidsgiver: PropTypes.func.isRequired,
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidsgiverSelect);
