import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import './FerskArbeidserfaring.less';
import { Knapp } from 'pam-frontend-knapper/dist';

interface Props {}

const FerskArbeidserfaring: FunctionComponent<Props> = props => {
    const [maksAlderYrkeserfaring, setMaksAlderYrkeserfaring] = useState<
        number | undefined | 'egendefinert'
    >();

    const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === 'egendefinert') {
            setMaksAlderYrkeserfaring('egendefinert');
            return;
        }
        const value: number = parseInt(event.target.value);
        if (!isNaN(value)) {
            setMaksAlderYrkeserfaring(value);
        }
    };

    return (
        <SkjemaGruppe
            className="fersk-arbeidserfaring"
            title="Kandidaten må ha fersk arbeidserfaring"
        >
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="2 år"
                name="ferskArbeidserfaring"
                value={2}
                checked={maksAlderYrkeserfaring === 2}
                onChange={onRadioChange}
            />
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="5 år"
                name="ferskArbeidserfaring"
                value={5}
                checked={maksAlderYrkeserfaring === 5}
                onChange={onRadioChange}
            />
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="Velg antall år"
                name="ferskArbeidserfaring"
                value="egendefinert"
                checked={maksAlderYrkeserfaring === 'egendefinert'}
                onChange={onRadioChange}
            />
            <div className="fersk-arbeidserfaring__input-wrapper">
                <Input label={''} />
                <Knapp className="fersk-arbeidserfaring__knapp">Bruk</Knapp>
            </div>
        </SkjemaGruppe>
    );
};

export default FerskArbeidserfaring;
