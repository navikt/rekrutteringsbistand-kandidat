import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';

const DisabledCheckbox = () => (
    <Checkbox className="Checkbox--ma-bo-pa-geografi-disabled" id={'geografi-checkbox-hjelpetekst-disabled'} label="Ønsker kun lokale kandidater (gir treff på kandidatens bosted)" checked={false} disabled={false} readOnly />
);

const CheckboxMedDisabledFunksjon = ({ id, label, checked, onChange, disabled_ }) => (
    disabled_ ?
        <HjelpetekstMidt className="hjelpetekst__tooltip--over" id="geografi-checkbox-hjelpetekst" anchor={DisabledCheckbox}>
            Du må legge til fylke eller kommune for å kunne huke av for lokale kandidater.
        </HjelpetekstMidt>
        :
        <Checkbox className="Checkbox--ma-bo-pa-geografi" id={id} label={label} checked={checked} onChange={onChange} disabled={false} />
);

CheckboxMedDisabledFunksjon.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled_: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

CheckboxMedDisabledFunksjon.defaultProps = {
    type: 'standard'
};

export default CheckboxMedDisabledFunksjon;
