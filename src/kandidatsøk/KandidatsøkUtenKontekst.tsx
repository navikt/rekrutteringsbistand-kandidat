import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { harUrlParametere } from './reducer/searchQuery';
import { Kandidatsøk } from './Kandidatsøk';
import { SEARCH, SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';
import AppState from '../AppState';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';

const KandidatsøkUtenKontekst: FunctionComponent = () => {
    const dispatch = useDispatch();
    const søkestateKommerFraAnnetSøk = useSelector(
        (state: AppState) => !!state.søk.kandidatlisteId
    );

    useNullstillKandidatlisteState();

    useEffect(() => {
        const oppdaterStateFraUrlOgSøk = (href: string) => {
            dispatch({ type: SØK_MED_URL_PARAMETERE, href });
        };

        const oppdaterUrlFraStateOgSøk = () => {
            dispatch({ type: SEARCH });
        };

        if (søkestateKommerFraAnnetSøk || harUrlParametere(window.location.href)) {
            oppdaterStateFraUrlOgSøk(window.location.href);
        } else {
            oppdaterUrlFraStateOgSøk();
        }
    }, [dispatch, søkestateKommerFraAnnetSøk]);

    return <Kandidatsøk />;
};

export default KandidatsøkUtenKontekst;
