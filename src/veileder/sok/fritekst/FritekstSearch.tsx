import React, { FunctionComponent, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Input } from 'nav-frontend-skjema';
import { SEARCH } from '../searchReducer';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import {
    utenKandidatnr,
    Fritekststate,
    Fritekstinput,
    validerFritekstfelt,
    lagFeilmeldingFraFritekstinput,
} from './validering';
import AppState from '../../AppState';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import './FritekstSearch.less';

interface Props {
    search: () => void;
    fritekstSøkeord: string;
    setFritekstSøkeord: (søkeord: string) => void;
}

const FritekstSearch: FunctionComponent<Props> = ({
    search,
    fritekstSøkeord,
    setFritekstSøkeord,
}) => {
    const history = useHistory();
    const [input, setInput] = useState<string>(fritekstSøkeord);
    const [hasSubmit, setHasSubmit] = useState<boolean>(false);
    const [state, setState] = useState<Fritekststate>(utenKandidatnr(Fritekstinput.IkkeEtFnr));

    useEffect(() => {
        setInput(fritekstSøkeord);
    }, [fritekstSøkeord]);

    const valider = async (input: string) => {
        if (hasSubmit) {
            if (state.input === Fritekstinput.FantKandidat) {
                history.push(`/kandidater/kandidat/${state.kandidatnr}/cv`);
            }
        } else {
            setState({
                input: Fritekstinput.Validerer,
            });
            setState(await validerFritekstfelt(input));
        }
    };

    useEffect(() => {
        valider(input);
    }, [input, hasSubmit]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (hasSubmit) {
            setHasSubmit(false);
        }

        setInput(e.target.value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setHasSubmit(true);

        if (state.input === Fritekstinput.IkkeEtFnr) {
            setFritekstSøkeord(input);
            search();
        }
    };

    let className = 'fritekst-search';
    let knappClassName = 'fritekst-search__søkeknapp';
    const visFeilmelding =
        hasSubmit &&
        state.input !== Fritekstinput.FantKandidat &&
        state.input !== Fritekstinput.IkkeEtFnr;

    if (visFeilmelding) className += ' fritekst-search--med-feilmelding';
    if (state.input === Fritekstinput.FantKandidat)
        knappClassName += ' fritekst-search__søkeknapp--uten-svg';

    return (
        <form className={className} onSubmit={onSubmit}>
            <Input
                label="Fødselsnummer (11 sifre) eller fritekstsøk"
                autoComplete="off"
                id="fritekstsok-input"
                value={input}
                onChange={onInputChange}
                feil={hasSubmit ? lagFeilmeldingFraFritekstinput(state.input) : undefined}
            />
            <Søkeknapp
                type="flat"
                spinner={state.input === Fritekstinput.Validerer}
                aria-label="fritekstsøk"
                className={knappClassName}
                id="fritekstsok-knapp"
                htmlType="submit"
            >
                {state.input === Fritekstinput.FantKandidat ? 'Gå til CV' : 'Søk'}
            </Søkeknapp>
        </form>
    );
};

const mapStateToProps = (state: AppState) => ({
    fritekstSøkeord: state.fritekst.fritekst,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSøkeord: (fritekstSøkeord: string) =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSøkeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
