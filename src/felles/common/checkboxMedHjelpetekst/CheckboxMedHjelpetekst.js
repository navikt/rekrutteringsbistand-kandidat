import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { HjelpetekstUnder } from 'nav-frontend-hjelpetekst';
import './CheckboxMedHjelpetekst.less';

const DisabledCheckbox = () => (
    <Checkbox
        className="Checkbox--ma-bo-pa-geografi-disabled skjemaelement--pink"
        id="geografi-checkbox-hjelpetekst-disabled"
        label="Vis bare kandidater som bor i området"
        disabled
    />
);

const CheckboxMedHjelpetekst = ({
    id,
    label,
    checked,
    onChange,
    disabled,
    tittel
}) => (
    disabled ? (
        <HjelpetekstUnder
            id="geografi-checkbox-hjelpetekst"
            anchor={DisabledCheckbox}
            className="CheckboxMedHjelpetekst"
            tittel={tittel}
        >
            Du må legge til fylke eller kommune for å kunne huke av for lokale kandidater.
        </HjelpetekstUnder>
    ) : (
        <Checkbox
            className="Checkbox--ma-bo-pa-geografi skjemaelement--pink"
            id={id}
            label={label}
            checked={checked}
            onChange={onChange}
            disabled={false}
        />
    )
);

CheckboxMedHjelpetekst.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    tittel: PropTypes.string.isRequired
};

export default CheckboxMedHjelpetekst;
