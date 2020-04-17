import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import './FerskArbeidserfaring.less';
import { Knapp } from 'pam-frontend-knapper/dist';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { ArbeidserfaringActionType } from '../arbeidserfaringReducer';
import { SEARCH } from '../../searchReducer';
import { ALERTTYPE } from '../../../../felles/konstanter';

interface Props {
    search: () => void;
    maksAlderArbeidserfaring: number | undefined;
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) => void;
}

const antallÅrListe = [2, 5];

const FerskArbeidserfaring: FunctionComponent<Props> = ({
    maksAlderArbeidserfaring,
    setMaksAlderArbeidserfaring,
    search,
}) => {
    const [valgtKnapp, setValgtKnapp] = useState<number | string>(
        maksAlderArbeidserfaring || 'ingen'
    );
    const [egendefinertInput, setEgendefinertInput] = useState<string>('');

    const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value: number = parseInt(event.target.value);
        setValgtKnapp(value);
        setMaksAlderArbeidserfaring(value);
        search();
    };

    const onEgendefinertValgt = () => {
        setValgtKnapp('egendefinert');
    };

    const onIngenValgt = () => {
        setValgtKnapp('ingen');
        setMaksAlderArbeidserfaring(undefined);
        search();
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setEgendefinertInput('');
            return;
        }

        const value: number = parseInt(event.target.value);
        if (!isNaN(value)) {
            setEgendefinertInput(value.toString());
        }
    };

    return (
        <SkjemaGruppe
            className="fersk-arbeidserfaring"
            title="Kandidaten må ha fersk arbeidserfaring"
        >
            {antallÅrListe.map(antallÅr => (
                <Radio
                    className="fersk-arbeidserfaring__knapp"
                    key={antallÅr}
                    label={antallÅr + ' år'}
                    name="ferskArbeidserfaring"
                    value={antallÅr}
                    checked={valgtKnapp === antallÅr}
                    onChange={onRadioChange}
                />
            ))}
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="Velg antall år"
                name="ferskArbeidserfaring"
                checked={valgtKnapp === 'egendefinert'}
                onChange={onEgendefinertValgt}
            />
            {valgtKnapp === 'egendefinert' && (
                <div className="fersk-arbeidserfaring__input-wrapper">
                    <Input label={''} value={egendefinertInput} onChange={onInputChange} />
                    <Knapp className="fersk-arbeidserfaring__knapp">Bruk</Knapp>
                </div>
            )}
            <Radio
                label="Ingen krav"
                name="ferskArbeidserfaring"
                checked={valgtKnapp === 'ingen'}
                onChange={onIngenValgt}
            />
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    maksAlderArbeidserfaring: state.arbeidserfaring.maksAlderArbeidserfaring,
});

const mapDispatchToProps = (dispatch: any) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.ARBEIDSERFARING }),
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) =>
        dispatch({
            type: ArbeidserfaringActionType.SET_MAKS_ALDER_ARBEIDSERFARING,
            value: maksAlder,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FerskArbeidserfaring);
