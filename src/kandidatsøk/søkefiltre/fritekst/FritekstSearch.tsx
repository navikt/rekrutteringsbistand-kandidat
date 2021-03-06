import React, { FunctionComponent, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

import { Fritekststatus } from './validering';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import AppState from '../../../AppState';
import useFritekstvalidering from './useFritekstvalidering';
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
    const [input, setInput] = useState<string>(fritekstSøkeord);
    const [harTrykketPåKnappISøkefelt, setHarTrykketPåKnappISøkefelt] = useState<boolean>(false);
    const validering = useFritekstvalidering(input, harTrykketPåKnappISøkefelt);

    useEffect(() => {
        setInput(fritekstSøkeord);
    }, [fritekstSøkeord]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);

        if (harTrykketPåKnappISøkefelt) {
            setHarTrykketPåKnappISøkefelt(false);
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setHarTrykketPåKnappISøkefelt(true);

        if (validering.status === Fritekststatus.IkkeEtFnr) {
            setFritekstSøkeord(input);
            search();
        }
    };

    const feilmelding = harTrykketPåKnappISøkefelt ? validering.feilmelding : undefined;

    let className = 'fritekst-search';
    if (feilmelding) className += ` ${className}--med-feilmelding`;

    let knappClassName = 'fritekst-search__søkeknapp';
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
                feil={feilmelding && validering.feilmelding}
            />
            <Søkeknapp
                type="flat"
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
    fritekstSøkeord: state.søkefilter.fritekst.fritekst,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search }),
    setFritekstSøkeord: (fritekstSøkeord: string) =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSøkeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
