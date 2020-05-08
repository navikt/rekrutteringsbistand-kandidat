import React from 'react';
import './FantFåKandidater.less';
import { Ingress, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import { connect } from 'react-redux';
import {
    FETCH_KOMPETANSE_SUGGESTIONS,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
} from '../../sok/searchReducer';
import {
    CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER,
    TOGGLE_TILRETTELEGGINGSBEHOV,
} from '../../sok/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import Forstørrelsesglass from './Forstørrelsesglass';
import ValgteKriterier from './ValgteKriterier';
import useKriterier from './useKriterier';
import Kategori from '../../sok/tilretteleggingsbehov/Kategori';
import { REMOVE_SELECTED_STILLING } from '../../sok/stilling/stillingReducer';
import { REMOVE_SELECTED_GEOGRAFI, TOGGLE_MA_BO_INNENFOR_GEOGRAFI } from '../../sok/geografi/geografiReducer';
import { hentQueryUtenKriterier } from '../DefaultKandidatsøk';

export type Geografi = {
    geografiKodeTekst: string;
    geografiKode: string;
};

type Props = {
    totaltAntallTreff: number;
    tilretteleggingsbehov: boolean;
    kategorier: Kategori[];
    search: () => void;
    resetQuery: (query: object) => void;
    removeKompetanseSuggestions: () => void;
    harHentetStilling: boolean;
    stillinger: string[];
    disableTilretteleggingsbehov: () => void;
    fetchKompetanseSuggestions: () => void;
    removeStilling: (stilling: string) => void;
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) => void;
    geografiListKomplett: Geografi[];
    maaBoInnenforGeografi: boolean;
    toggleMaBoPaGeografi: () => void;
    removeGeografi: (geografi: Geografi) => void;
};

const FantFåKandidater = (props: Props) => {
    const onRemoveTilretteleggingsbehov = () => {
        props.disableTilretteleggingsbehov();
        props.search();
    };

    const onRemoveKategori = (kategori: Kategori) => {
        props.changeTilretteleggingsbehovKategorier(props.kategorier.filter((k) => k !== kategori));
        props.search();
    };

    const onRemoveStillingEllerYrke = (stilling: string) => {
        props.removeStilling(stilling);
        props.fetchKompetanseSuggestions();
        props.search();
    };

    const onRemoveGeografi = (geografi: Geografi) => {
        if (
            props.geografiListKomplett &&
            props.geografiListKomplett.length === 1 &&
            props.maaBoInnenforGeografi
        ) {
            props.toggleMaBoPaGeografi();
        }
        props.removeGeografi(geografi);
        props.search();
    };

    const [andreKriterier, kategorikriterier] = useKriterier(
        props.stillinger,
        props.geografiListKomplett,
        props.kategorier,
        props.tilretteleggingsbehov,
        onRemoveStillingEllerYrke,
        onRemoveGeografi,
        onRemoveTilretteleggingsbehov,
        onRemoveKategori
    );

    const slettAlleKriterier = () => {
        props.resetQuery(hentQueryUtenKriterier(props.harHentetStilling));
        props.removeKompetanseSuggestions();
        props.search();
    };

    return (
        <div className="fant-få-kandidater">
            <Forstørrelsesglass className="fant-få-kandidater__ikon" />
            <Innholdstittel className="fant-få-kandidater__overskrift">
                {props.totaltAntallTreff === 0
                    ? 'Fant ingen kandidater'
                    : `Fant kun ${props.totaltAntallTreff} ${
                          props.totaltAntallTreff > 1 ? 'kandidater' : 'kandidat'
                      }`}
            </Innholdstittel>
            <Ingress className="fant-få-kandidater__ingress">
                For å få treff på flere kandidater, fjern et eller flere kriterier.
            </Ingress>
            {andreKriterier.length > 0 && (
                <>
                    <Normaltekst className="fant-få-kandidater__valgte-kriterier-tittel">
                        Disse kriteriene er tatt med fra stillingen/kandidatlisten:
                    </Normaltekst>
                    <ValgteKriterier kriterier={andreKriterier} />
                </>
            )}
            {kategorikriterier.length > 0 && (
                <>
                    <Normaltekst className="fant-få-kandidater__valgte-kriterier-tittel">
                        Disse kriteriene er valgt for tilretteleggingsbehov:
                    </Normaltekst>
                    <ValgteKriterier kriterier={kategorikriterier} />
                </>
            )}
            <Knapp onClick={slettAlleKriterier}>Slett alle kriterier</Knapp>
        </div>
    );
};

const mapStateToProps = (state) => ({
    tilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
    kategorier: state.tilretteleggingsbehov.kategorier,
    harHentetStilling: state.search.harHentetStilling,
    stillinger: state.stilling.stillinger,
    geografiListKomplett: state.geografi.geografiListKomplett,
    maaBoInnenforGeografi: state.geografi.maaBoInnenforGeografi,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    disableTilretteleggingsbehov: () =>
        dispatch({
            type: TOGGLE_TILRETTELEGGINGSBEHOV,
            harTilretteleggingsbehov: false,
        }),
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) =>
        dispatch({ type: CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER, kategorier }),
    fetchKompetanseSuggestions: () => dispatch({ type: FETCH_KOMPETANSE_SUGGESTIONS }),
    removeStilling: (value: string) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    removeGeografi: (value: Geografi) => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value }),
    toggleMaBoPaGeografi: () => dispatch({ type: TOGGLE_MA_BO_INNENFOR_GEOGRAFI }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FantFåKandidater);
