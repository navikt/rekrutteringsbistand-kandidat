import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'nav-frontend-skjema';
import ArbeidsgiverListePropTypes from './PropTypes';

class ArbeidsgiverSelect extends React.Component {
    onArbeidsgiverChange = (e) => {
        if (e.target.value !== '0') {
            sessionStorage.setItem('orgnr', e.target.value);
            this.props.onArbeidsgiverSelect(e.target.value);
        } else {
            sessionStorage.removeItem('orgnr');
            this.props.onArbeidsgiverSelect();
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
                value={valgtArbeidsgiverId}
                bredde="m"
            >
                <option value="0">Velg arbeidsgiver</option>
                {arbeidsgivere && arbeidsgivere.map((arbeidsgiver) => (
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
    onArbeidsgiverSelect: PropTypes.func.isRequired,
    arbeidsgivere: ArbeidsgiverListePropTypes.isRequired,
    valgtArbeidsgiverId: PropTypes.string
};

export default ArbeidsgiverSelect;
