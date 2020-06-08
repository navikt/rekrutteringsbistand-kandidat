import React, { FunctionComponent, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import { useHistory } from 'react-router-dom';

import { SEARCH } from '../searchReducer';
import {
    utenKandidatnr,
    Fritekstvalidering,
    Fritekststatus,
    validerFritekstfelt,
    lagFeilmeldingFraFritekstinput,
} from './validering';
import AppState from '../../AppState';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import './FritekstSearch.less';
import { sendEvent } from '../../amplitude/amplitude';

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
    const [validering, setValidering] = useState<Fritekstvalidering>(
        utenKandidatnr(Fritekststatus.IkkeEtFnr)
    );

    const navigerTilCv = () => {
        sendEvent('fødselsnummersøk', 'naviger_til_cv');
        history.push(`/kandidater/kandidat/${validering.kandidatnr}/cv`);
    };

    useEffect(() => {
        setInput(fritekstSøkeord);
    }, [fritekstSøkeord]);

    useEffect(() => {
        const valider = async () => {
            if (hasSubmit) {
                if (validering.status === Fritekststatus.FantKandidat) {
                    navigerTilCv();
                }
            } else {
                setValidering({
                    status: Fritekststatus.Validerer,
                });
                setValidering(await validerFritekstfelt(input));
            }
        };

        valider();
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

        if (validering.status === Fritekststatus.IkkeEtFnr) {
            setFritekstSøkeord(input);
            search();
        }
    };

    let className = 'fritekst-search';
    let knappClassName = 'fritekst-search__søkeknapp';
    const visFeilmelding =
        hasSubmit &&
        validering.status !== Fritekststatus.FantKandidat &&
        validering.status !== Fritekststatus.IkkeEtFnr;

    if (visFeilmelding) className += ' fritekst-search--med-feilmelding';
    if (validering.status === Fritekststatus.FantKandidat)
        knappClassName += ' fritekst-search__søkeknapp--uten-svg';

    return (
        <form className={className} onSubmit={onSubmit}>
            <Input
                label="Fødselsnummer (11 sifre) eller fritekstsøk"
                autoComplete="off"
                id="fritekstsok-input"
                value={input}
                onChange={onInputChange}
                feil={hasSubmit ? lagFeilmeldingFraFritekstinput(validering.status) : undefined}
            />
            <Søkeknapp
                type="flat"
                disabled={validering.status === Fritekststatus.Validerer}
                aria-label="fritekstsøk"
                className={knappClassName}
                id="fritekstsok-knapp"
                htmlType="submit"
            >
                {validering.status === Fritekststatus.FantKandidat ? 'Gå til CV' : 'Søk'}
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
