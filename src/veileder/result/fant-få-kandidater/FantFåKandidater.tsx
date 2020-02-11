import React, { useState, useEffect } from 'react';
import './FantFåKandidater.less';
import { Innholdstittel, Normaltekst, Ingress } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { connect } from 'react-redux';
import { SEARCH, SET_STATE, REMOVE_KOMPETANSE_SUGGESTIONS } from '../../sok/searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER,
} from '../../sok/tilretteleggingsbehov/tilretteleggingsbehovReducer';
import Kategori from '../../sok/tilretteleggingsbehov/Kategori';
import { hentQueryUtenKriterier } from '../ResultatVisning';
import Forstørrelsesglass from './Forstørrelsesglass';

type Kriterie = {
    value: any;
    label: string;
    onRemove: () => void;
};

const ValgteKriterier = ({ kriterier }: { kriterier: Kriterie[] }) => {
    return (
        <div className="fant-få-kandidater__valgte-kriterier">
            {kriterier.map(kriterie => {
                return (
                    <Merkelapp
                        key={kriterie.label}
                        value={kriterie.value}
                        onRemove={kriterie.onRemove}
                    >
                        {kriterie.label}
                    </Merkelapp>
                );
            })}
        </div>
    );
};

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

const storForbokstav = (kriterie: string) =>
    kriterie.length < 2 ? kriterie : kriterie[0].toUpperCase() + kriterie.substr(1);

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

    const [kriterier, setKriterier] = useState<Kriterie[]>([]);

    useEffect(() => {
        const tilretteleggingsbehovKriterier = tilretteleggingsbehov
            ? [
                  {
                      value: tilretteleggingsbehov,
                      label: storForbokstav('tilretteleggingsbehov'),
                      onRemove: () => {
                          disableTilretteleggingsbehov();
                          search();
                      },
                  },
              ]
            : [];

        const kategoriKriterier = kategorier.map(kategori => ({
            value: kategori,
            label: storForbokstav(kategori),
            onRemove: () => {
                changeTilretteleggingsbehovKategorier(kategorier.filter(k => k !== kategori));
                search();
            },
        }));

        setKriterier([...tilretteleggingsbehovKriterier, ...kategoriKriterier]);
    }, [
        kategorier,
        tilretteleggingsbehov,
        changeTilretteleggingsbehovKategorier,
        disableTilretteleggingsbehov,
        search,
    ]);

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
                        Disse kriteriene er valgt for tilretteleggingsbehov:
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
