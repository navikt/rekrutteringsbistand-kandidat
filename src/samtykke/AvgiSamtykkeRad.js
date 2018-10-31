import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Checkbox } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';

const AvgiSamtykkeRad = ({ ...props }) => (
    <Row>
        <Column xs="12" className="center">
            <form onSubmit={props.handleClick} className={'panel--samtykke-utfyllende'}>
                <Checkbox
                    id={'avgi-samtykke-checkbox-utfyllende'}
                    label="Jeg godtar vilkårene"
                    value={props.isSamtykkeChecked}
                    name="samtykke"
                    checked={props.isSamtykkeChecked}
                    onChange={props.onSamtykkeChange}
                    className={'samtykke'}
                />
                <Row>
                    <Column xs="12" className="center">
                        <Hovedknapp
                            id="samtykke-aksepter"
                            spinner={props.isSavingVilkar}
                            disabled={!props.isSamtykkeChecked}
                            htmlType="submit"
                        >
                  Lagre
                        </Hovedknapp>
                        <a href="/" className="lenke--vilkar" >Avbryt</a>
                    </Column>
                </Row>
            </form>
        </Column>
    </Row>
);

AvgiSamtykkeRad.defaultProps = {
    isSamtykkeChecked: false,
    isSavingVilkar: false
};

AvgiSamtykkeRad.propTypes = {
    handleClick: PropTypes.func.isRequired,
    isSamtykkeChecked: PropTypes.bool,
    onSamtykkeChange: PropTypes.func.isRequired,
    isSavingVilkar: PropTypes.bool.isRequired
};

export default AvgiSamtykkeRad;
