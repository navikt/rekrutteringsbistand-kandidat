import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import './FerskArbeidserfaring.less';
import { Knapp } from 'pam-frontend-knapper/dist';
import AppState from '../../../AppState';
import { FerskArbeidserfaringActionType } from '../ferskArbeidserfaringReducer';
import { connect } from 'react-redux';

interface Props {
    maksAlderArbeidserfaring: number | undefined;
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) => void;
}

const FerskArbeidserfaring: FunctionComponent<Props> = props => {
    const [maksAlderArbeidserfaring2, setMaksAlderArbeidserfaring2] = useState<
        number | undefined | 'egendefinert'
    >();

    const { maksAlderArbeidserfaring, setMaksAlderArbeidserfaring } = props;

    const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value: number = parseInt(event.target.value);
        if (!isNaN(value)) {
            setMaksAlderArbeidserfaring(value);
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
                checked={maksAlderArbeidserfaring === 2}
                onChange={onRadioChange}
            />
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="5 år"
                name="ferskArbeidserfaring"
                value={5}
                checked={maksAlderArbeidserfaring === 5}
                onChange={onRadioChange}
            />
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="Velg antall år"
                name="ferskArbeidserfaring"
                value="egendefinert"
                checked={maksAlderArbeidserfaring2 !== 2 && maksAlderArbeidserfaring2 !== 5}
                onChange={onRadioChange}
            />
            <div className="fersk-arbeidserfaring__input-wrapper">
                <Input label={''} />
                <Knapp className="fersk-arbeidserfaring__knapp">Bruk</Knapp>
            </div>
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    maksAlderArbeidserfaring: state.maksAlderArbeidserfaring.verdi,
});

const mapDispatchToProps = (dispatch: any) => ({
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) =>
        dispatch({
            type: FerskArbeidserfaringActionType.SET_MAKS_ALDER_ARBEIDSERFARING,
            value: maksAlder,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FerskArbeidserfaring);
