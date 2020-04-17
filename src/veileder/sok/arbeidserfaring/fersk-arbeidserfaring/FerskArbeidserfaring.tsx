import React, { ChangeEvent, FunctionComponent } from 'react';
import { Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import './FerskArbeidserfaring.less';
import { Knapp } from 'pam-frontend-knapper/dist';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { ArbeidserfaringActionType } from '../arbeidserfaringReducer';

interface Props {
    maksAlderArbeidserfaring: number | undefined;
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) => void;
}

const antallÅrListe = [2, 5];

const FerskArbeidserfaring: FunctionComponent<Props> = props => {
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
            {antallÅrListe.map(antallÅr => (
                <Radio
                    className="fersk-arbeidserfaring__knapp"
                    key={antallÅr}
                    label={antallÅr + ' år'}
                    name="ferskArbeidserfaring"
                    value={antallÅr}
                    checked={maksAlderArbeidserfaring === antallÅr}
                    onChange={onRadioChange}
                />
            ))}
            <Radio
                className="fersk-arbeidserfaring__knapp"
                label="Velg antall år"
                name="ferskArbeidserfaring"
                value="egendefinert"
                checked={
                    !!maksAlderArbeidserfaring && !antallÅrListe.includes(maksAlderArbeidserfaring)
                }
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
    maksAlderArbeidserfaring: state.arbeidserfaring.maksAlderArbeidserfaring,
});

const mapDispatchToProps = (dispatch: any) => ({
    setMaksAlderArbeidserfaring: (maksAlder: number | undefined) =>
        dispatch({
            type: ArbeidserfaringActionType.SET_MAKS_ALDER_ARBEIDSERFARING,
            value: maksAlder,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FerskArbeidserfaring);
