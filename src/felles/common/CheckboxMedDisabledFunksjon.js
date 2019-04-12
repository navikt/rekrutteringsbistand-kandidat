import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { HjelpetekstUnder } from 'nav-frontend-hjelpetekst';

const DisabledCheckbox = () => (
    <Checkbox className="Checkbox--ma-bo-pa-geografi-disabled skjemaelement--pink" id={'geografi-checkbox-hjelpetekst-disabled'} label="Vis bare kandidater som bor i området" checked={false} disabled={false} readOnly />
);

const CheckboxMedDisabledFunksjon = ({ id, label, checked, onChange, disabled }) => (
    disabled ?
        <HjelpetekstUnder id="geografi-checkbox-hjelpetekst" anchor={DisabledCheckbox}>
            Du må legge til fylke eller kommune for å kunne huke av for lokale kandidater.
        </HjelpetekstUnder>
        :
        <Checkbox className="Checkbox--ma-bo-pa-geografi" id={id} label={label} checked={checked} onChange={onChange} disabled={false} />
);

CheckboxMedDisabledFunksjon.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CheckboxMedDisabledFunksjon;
