import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { PopoverOrientering } from 'nav-frontend-popover';
import HjelpetekstMedAnker from '../hjelpetekst-med-anker/HjelpetekstMedAnker';
import './CheckboxMedHjelpetekst.less';

const CheckboxMedHjelpetekst = ({ id, label, checked, onChange, disabled, tittel }) => {
    return (
        <HjelpetekstMedAnker
            innhold="Du må legge til fylke eller kommune for å kunne huke av for lokale kandidater."
            orientering={PopoverOrientering.Under}
        >
            <Checkbox
                className="Checkbox--ma-bo-pa-geografi"
                id={id}
                label={label}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
        </HjelpetekstMedAnker>
    );
};

CheckboxMedHjelpetekst.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    tittel: PropTypes.string.isRequired,
};

export default CheckboxMedHjelpetekst;
