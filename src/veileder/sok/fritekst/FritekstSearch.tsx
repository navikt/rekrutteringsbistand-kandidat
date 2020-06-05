import React, { FunctionComponent, ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import validator from '@navikt/fnrvalidator';

import { Input } from 'nav-frontend-skjema';
import { hentKandidatnr } from '../../api';
import { SEARCH } from '../searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import { Søkeknapp } from 'nav-frontend-ikonknapper';
import AppState from '../../AppState';
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
    const [erGyldigFnr, setErGyldigFnr] = useState<boolean>(false);
    const [fantIkkeKandidatnr, setFantIkkeKandidatnr] = useState<boolean>(false);

    useEffect(() => {
        setInput(fritekstSøkeord);
    }, [fritekstSøkeord]);

    useEffect(() => {
        const inputErGyldigFnr = validator.fnr(input).status === 'valid';
        const feilmeldingBørFjernes = !inputErGyldigFnr && fantIkkeKandidatnr;

        setErGyldigFnr(inputErGyldigFnr);
        if (feilmeldingBørFjernes) {
            setFantIkkeKandidatnr(false);
        }
    }, [input, fantIkkeKandidatnr]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (erGyldigFnr) {
            try {
                const kandidatnr = (await hentKandidatnr(input)).kandidatnr;
                history.push(`/kandidater/kandidat/${kandidatnr}/cv`);
            } catch (e) {
                setFantIkkeKandidatnr(true);
            }
        } else {
            setFritekstSøkeord(input);
            search();
        }
    };

    let className = 'fritekst-search';
    if (fantIkkeKandidatnr) {
        className += ' fritekst-search--med-feilmelding';
    }

    let knappClassName = 'fritekst-search__søkeknapp';
    if (erGyldigFnr) {
        knappClassName += ' fritekst-search__søkeknapp--uten-svg';
    }

    return (
        <form className={className} onSubmit={onSubmit}>
            <Input
                label="Fødselsnummer (11 sifre) eller fritekstsøk"
                id="fritekstsok-input"
                value={input}
                onChange={onInputChange}
                feil={fantIkkeKandidatnr ? 'Fant ikke kandidaten' : undefined}
            />
            <Søkeknapp
                type="flat"
                aria-label="fritekstsøk"
                className={knappClassName}
                id="fritekstsok-knapp"
                htmlType="submit"
            >
                {erGyldigFnr ? 'Gå til CV' : 'Søk'}
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
