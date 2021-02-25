import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
    SØK_MED_URL_PARAMETERE,
} from './reducer/searchReducer';
import './Resultat.less';
import { Nettstatus } from '../api/remoteData';
import { Kandidatsøk } from './Kandidatsøk';
import { Container } from 'nav-frontend-grid';
import AppState from '../AppState';
import { harUrlParametere } from './reducer/searchQuery';
import { ListeoversiktActionType } from '../listeoversikt/reducer/ListeoversiktAction';
import { Sidetittel } from 'nav-frontend-typografi';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';

type Props = FellesKandidatsøkProps & {
    søkestateKommerFraAnnetSøk: boolean;
};

const DefaultKandidatsøk: FunctionComponent<Props> = ({
    isInitialSearch,
    leggUrlParametereIStateOgSøk,
    resetKandidatlisterSokekriterier,
    lukkAlleSokepanel,
    resetQuery,
    removeKompetanseSuggestions,
    search,
    harHentetStilling,
    søkestateKommerFraAnnetSøk,
}) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        resetKandidatlisterSokekriterier();
    }, [resetKandidatlisterSokekriterier]);

    useEffect(() => {
        if (søkestateKommerFraAnnetSøk || harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href);
        } else {
            search();
        }
    }, [leggUrlParametereIStateOgSøk, søkestateKommerFraAnnetSøk, search]);

    const header = (
        <Container className="container--header--uten-stilling">
            <Sidetittel>Kandidatsøk</Sidetittel>
        </Container>
    );

    const onRemoveCriteriaClick = () => {
        lukkAlleSokepanel();
        resetQuery(hentQueryUtenKriterier(harHentetStilling, undefined));
        removeKompetanseSuggestions();
        search();
    };

    return (
        <Kandidatsøk
            visSpinner={isInitialSearch}
            header={header}
            onRemoveCriteriaClick={onRemoveCriteriaClick}
        />
    );
};

export const hentQueryUtenKriterier = (
    harHentetStilling: boolean,
    kandidatlisteId: string | undefined
) => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
    harHentetStilling: harHentetStilling,
    kandidatlisteId: kandidatlisteId,
});

const mapStateToProps = (state: AppState) => ({
    isInitialSearch: state.søk.isInitialSearch,
    harHentetStilling: state.søk.harHentetStilling,
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    søkestateKommerFraAnnetSøk: !!state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    leggUrlParametereIStateOgSøk: (href: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href }),
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: ListeoversiktActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultKandidatsøk);
