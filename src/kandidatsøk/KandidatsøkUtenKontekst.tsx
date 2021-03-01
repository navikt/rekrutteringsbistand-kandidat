import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';
import { harUrlParametere } from './reducer/searchQuery';
import { Kandidatsøk } from './Kandidatsøk';
import { SEARCH, SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';
import AppState from '../AppState';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import './Resultat.less';

type Props = FellesKandidatsøkProps & {
    søkestateKommerFraAnnetSøk: boolean;
    nullstillKandidaterErLagretIKandidatlisteAlert: () => void;
};

const KandidatsøkUtenKontekst: FunctionComponent<Props> = ({
    search,
    leggUrlParametereIStateOgSøk,
    søkestateKommerFraAnnetSøk,
}) => {
    useNullstillKandidatlisteState();

    useEffect(() => {
        if (søkestateKommerFraAnnetSøk || harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href);
        } else {
            search();
        }
    }, [leggUrlParametereIStateOgSøk, søkestateKommerFraAnnetSøk, search]);

    return <Kandidatsøk />;
};

const mapStateToProps = (state: AppState) => ({
    søkestateKommerFraAnnetSøk: !!state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    leggUrlParametereIStateOgSøk: (href: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkUtenKontekst);
