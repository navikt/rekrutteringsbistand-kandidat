import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidatsøkActionType } from './reducer/searchReducer';

const KandidatsøkUtenKontekst: FunctionComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const oppdaterStateFraUrlOgSøk = (href: string) => {
            dispatch({ type: KandidatsøkActionType.SøkMedUrlParametere, href });
        };

        oppdaterStateFraUrlOgSøk(window.location.href);
    }, [dispatch]);

    return <Kandidatsøk />;
};

export default KandidatsøkUtenKontekst;
