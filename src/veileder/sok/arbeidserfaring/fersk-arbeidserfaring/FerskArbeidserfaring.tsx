import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
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

const getDefaultState = (maksAlder: number | undefined) => {
    if (!maksAlder) {
        return { defaultValgtKnapp: 'ingen', defaultInput: '' };
    } else if (antallÅrListe.includes(maksAlder)) {
        return { defaultValgtKnapp: maksAlder, defaultInput: '' };
    } else {
        return { defaultValgtKnapp: 'egendefinert', defaultInput: maksAlder.toString() };
    }
};

const antallÅrListe = [2, 5];

const FerskArbeidserfaring: FunctionComponent<Props> = ({
    maksAlderArbeidserfaring,
    setMaksAlderArbeidserfaring,
    search,
}) => {
    const { defaultValgtKnapp, defaultInput } = getDefaultState(maksAlderArbeidserfaring);
    const [valgtKnapp, setValgtKnapp] = useState<number | string>(defaultValgtKnapp);
    const [egendefinertInput, setEgendefinertInput] = useState<string>(defaultInput);
    const [inputRef, setInputRef] = useState<any>();
    const [feilmelding, setFeilmelding] = useState<string | undefined>();

    useEffect(() => {
        const harNettoppKlikketPåEgendefinert =
            inputRef &&
            valgtKnapp === 'egendefinert' &&
            (egendefinertInput !== defaultInput || egendefinertInput === '');
        if (harNettoppKlikketPåEgendefinert) {
            inputRef.focus();
        }
    }, [inputRef, valgtKnapp]);

    const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value: number = parseInt(event.target.value);
        setValgtKnapp(value);
        setMaksAlderArbeidserfaring(value);
        setEgendefinertInput(defaultInput);
        setFeilmelding(undefined);
        search();
    };

    const onEgendefinertValgt = () => {
        setValgtKnapp('egendefinert');
        if (inputRef) {
            inputRef.focus();
        }
    };

    const onIngenValgt = () => {
        setValgtKnapp('ingen');
        setMaksAlderArbeidserfaring(undefined);
        setEgendefinertInput(defaultInput);
        setFeilmelding(undefined);
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

    const onBrukKlikk = () => {
        if (egendefinertInput === '') {
            setMaksAlderArbeidserfaring(undefined);
            setFeilmelding('Skriv inn antall år');
        } else {
            setMaksAlderArbeidserfaring(parseInt(egendefinertInput));
            setFeilmelding(undefined);
        }
        search();
    };

    return (
        <SkjemaGruppe className="fersk-arbeidserfaring" legend="Hvor fersk må erfaringen være?">
            <div className="fersk-arbeidserfaring__hjelpetekst">
                Husk å legge til arbeidserfaring over først
            </div>
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="Ingen krav"
                name="ferskArbeidserfaring"
                checked={valgtKnapp === 'ingen'}
                onChange={onIngenValgt}
            />
            {antallÅrListe.map((antallÅr) => (
                <Radio
                    className="fersk-arbeidserfaring__knapp"
                    key={antallÅr}
                    label={`Siste ${antallÅr} år`}
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
                    <Input
                        name="ferskArbeidserfaring"
                        label={''}
                        value={egendefinertInput}
                        onChange={onInputChange}
                        inputRef={setInputRef}
                        feil={feilmelding}
                    />
                    <Knapp
                        name="ferskArbeidserfaring"
                        className="fersk-arbeidserfaring__bruk-knapp"
                        onClick={onBrukKlikk}
                    >
                        Bruk
                    </Knapp>
                </div>
            )}
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
