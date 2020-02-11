import React from 'react';
import './FantFåKandidater.less';
import { Innholdstittel, Normaltekst, Ingress } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import { connect } from 'react-redux';
import { SEARCH, SET_STATE, REMOVE_KOMPETANSE_SUGGESTIONS } from '../../sok/searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER,
} from '../../sok/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import { hentQueryUtenKriterier } from '../ResultatVisning';
import Forstørrelsesglass from './Forstørrelsesglass';
import ValgteKriterier from './ValgteKriterier';
import useKriterier from './useKriterier';
import Kategori from '../../sok/tilretteleggingsbehov/Kategori';

type Props = {
    antallKandidater: number;
    tilretteleggingsbehov: boolean;
    kategorier: Kategori[];
    search: () => void;
    resetQuery: (query: object) => void;
    removeKompetanseSuggestions: () => void;
    harHentetStilling: boolean;
    disableTilretteleggingsbehov: () => void;
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) => void;
};

const FantFåKandidater = (props: Props) => {
    const {
        antallKandidater = 0,
        search,
        harHentetStilling,
        resetQuery,
        removeKompetanseSuggestions,
        disableTilretteleggingsbehov,
        changeTilretteleggingsbehovKategorier,
        kategorier,
        tilretteleggingsbehov,
    } = props;

    const onRemoveTilretteleggingsbehov = () => {
        disableTilretteleggingsbehov();
        search();
    };

    const onRemoveKategori = (kategori: Kategori) => {
        changeTilretteleggingsbehovKategorier(kategorier.filter(k => k !== kategori));
        search();
    };

    const kriterier = useKriterier(
        kategorier,
        tilretteleggingsbehov,
        onRemoveTilretteleggingsbehov,
        onRemoveKategori
    );

    const fjernAlleKriterier = () => {
        resetQuery(hentQueryUtenKriterier(harHentetStilling));
        removeKompetanseSuggestions();
        search();
    };

    return (
        <div className="fant-få-kandidater">
            <Forstørrelsesglass className="fant-få-kandidater__ikon" />
            <Innholdstittel className="fant-få-kandidater__overskrift">
                {antallKandidater === 0
                    ? 'Fant ingen kandidater'
                    : `Fant kun ${antallKandidater} kandidater`}
            </Innholdstittel>
            <Ingress className="fant-få-kandidater__ingress">
                For å få treff på flere kandidater, fjern et eller flere kriterier.
            </Ingress>
            {kriterier.length > 0 && (
                <>
                    <Normaltekst className="fant-få-kandidater__valgte-kriterier-tittel">
                        Disse kriteriene er tatt med fra:
                    </Normaltekst>
                    <ValgteKriterier kriterier={kriterier} />
                </>
            )}
            <Knapp onClick={fjernAlleKriterier}>Slett alle kriterier</Knapp>
        </div>
    );
};

const mapStateToProps = state => ({
    tilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
    kategorier: state.tilretteleggingsbehov.kategorier,
    harHentetStilling: state.search.harHentetStilling,
});

const mapDispatchToProps = dispatch => ({
    search: () => dispatch({ type: SEARCH }),
    resetQuery: query => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    disableTilretteleggingsbehov: () =>
        dispatch({
            type: TOGGLE_TILRETTELEGGINGSBEHOV,
            harTilretteleggingsbehov: false,
        }),
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) =>
        dispatch({ type: CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER, kategorier }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FantFåKandidater);
