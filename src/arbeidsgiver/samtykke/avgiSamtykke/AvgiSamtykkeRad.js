import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Checkbox } from 'nav-frontend-skjema';
import { Hovedknapp, Flatknapp } from 'pam-frontend-knapper';

const AvgiSamtykkeRad = ({
    isSavingVilkar,
    onGodtaVilkar
}) => {
    const [feil, setFeil] = useState(undefined);
    const [isSamtykkeChecked, setIsSamtykkeChecked] = useState(false);

    const onSamtykkeChange = (event) => {
        setIsSamtykkeChecked(event.target.checked);
        setFeil(undefined);
    };

    const onClick = () => {
        if (!isSamtykkeChecked) {
            setFeil({ feilmelding: 'Du må huke av for å godta vilkår.' });
        } else {
            onGodtaVilkar();
        }
    };

    const onAvbryt = () => {
        window.location.href = '/';
    };

    return (
        <Row>
            <Column xs="12" className="center">
                <Checkbox
                    id={'avgi-samtykke-checkbox-utfyllende'}
                    label="Jeg godtar vilkårene"
                    value={isSamtykkeChecked}
                    name="samtykke"
                    checked={isSamtykkeChecked}
                    onChange={onSamtykkeChange}
                    className={'samtykke'}
                    feil={feil}
                />
                <Row>
                    <Column xs="12" className="center">
                        <Hovedknapp
                            id="samtykke-aksepter"
                            spinner={isSavingVilkar}
                            onClick={onClick}
                        >
                            Godta vilkår
                        </Hovedknapp>
                        <Flatknapp onClick={onAvbryt}>Avbryt</Flatknapp>
                    </Column>
                </Row>
            </Column>
        </Row>
    );
};

AvgiSamtykkeRad.propTypes = {
    onGodtaVilkar: PropTypes.func.isRequired,
    isSavingVilkar: PropTypes.bool.isRequired
};

export default AvgiSamtykkeRad;
