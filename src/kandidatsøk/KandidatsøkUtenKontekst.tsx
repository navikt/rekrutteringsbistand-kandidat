import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Kandidatsøk } from './Kandidatsøk';
import { SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';

const KandidatsøkUtenKontekst: FunctionComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const oppdaterStateFraUrlOgSøk = (href: string) => {
            dispatch({ type: SØK_MED_URL_PARAMETERE, href });
        };

        oppdaterStateFraUrlOgSøk(window.location.href);
    }, [dispatch]);

    return <Kandidatsøk />;
};

export default KandidatsøkUtenKontekst;
