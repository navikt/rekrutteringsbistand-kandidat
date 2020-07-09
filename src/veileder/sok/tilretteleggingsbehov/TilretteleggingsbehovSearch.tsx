import * as React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';

import { SEARCH } from '../searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN,
    CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER,
} from './tilretteleggingsbehovReducer';
import Infoikon from './Infoikon';
import './Tilretteleggingsbehov.less';
import Kategori, { getKategoriLabel } from './Kategori';
import AppState from '../../AppState';

interface TilretteleggingsbehovSearchProps {
    search: () => void;
    harValgtTilretteleggingsbehov: boolean;
    toggleTilretteleggingsbehov: (harTilretteleggingsbehov: boolean) => void;
    panelOpen: boolean;
    togglePanelOpen: () => void;
    kategorier: Kategori[];
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) => void;
}

const TilretteleggingsbehovSearch = (props: TilretteleggingsbehovSearchProps) => {
    const {
        search,
        toggleTilretteleggingsbehov,
        togglePanelOpen,
        panelOpen,
        harValgtTilretteleggingsbehov,
        kategorier,
        changeTilretteleggingsbehovKategorier,
    } = props;

    const onTilretteleggingsbehovChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleTilretteleggingsbehov(event.target.checked);
        search();
    };

    const onTilretteleggingsbehovKategorierChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const kategori = event.target.name as Kategori;
        changeTilretteleggingsbehovKategorier(
            kategorier.includes(kategori)
                ? kategorier.filter((k) => k !== kategori)
                : [...kategorier, kategori]
        );
        search();
    };

    return (
        <SokekriteriePanel
            id="Tilretteleggingsbehov__SokekriteriePanel"
            fane="tilretteleggingsbehov"
            tittel="Tilretteleggingsbehov"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Checkbox
                id="tilretteleggingsbehov-checkbox"
                label="Vis kandidater med tilretteleggingsbehov"
                checked={harValgtTilretteleggingsbehov}
                onChange={onTilretteleggingsbehovChange}
            />
            {harValgtTilretteleggingsbehov && (
                <fieldset
                    aria-label="Kategorier for tilretteleggingsbehov"
                    className="tilretteleggingsbehov__kategorier"
                >
                    {Object.keys(Kategori).map((key) => {
                        const kategori = Kategori[key];

                        return (
                            <Checkbox
                                key={kategori}
                                className="tilretteleggingsbehov__kategori"
                                id={`tilretteleggingsbehov-kategori-${kategori.toLowerCase()}-checkbox`}
                                label={getKategoriLabel(kategori)}
                                name={kategori}
                                checked={kategorier.includes(kategori)}
                                onChange={onTilretteleggingsbehovKategorierChange}
                            />
                        );
                    })}
                </fieldset>
            )}
            <div className="tilretteleggingsbehov__informasjon">
                <Infoikon />
                <Normaltekst>
                    Vi tester ut ny funksjonalitet. Du vil kun få treff på noen få kandidater som
                    har denne informasjonen.
                </Normaltekst>
            </div>
        </SokekriteriePanel>
    );
};

const mapStateToProps = (state: AppState) => ({
    harValgtTilretteleggingsbehov: state.søkefilter.tilretteleggingsbehov.harTilretteleggingsbehov,
    kategorier: state.søkefilter.tilretteleggingsbehov.kategorier,
    panelOpen: state.søkefilter.tilretteleggingsbehov.tilretteleggingsbehovPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    toggleTilretteleggingsbehov: (harValgtTilretteleggingsbehov: boolean) =>
        dispatch({
            type: TOGGLE_TILRETTELEGGINGSBEHOV,
            harTilretteleggingsbehov: harValgtTilretteleggingsbehov,
        }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN }),
    changeTilretteleggingsbehovKategorier: (kategorier: Kategori[]) =>
        dispatch({ type: CHANGE_TILRETTELEGGINGSBEHOV_KATEGORIER, kategorier }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilretteleggingsbehovSearch);
