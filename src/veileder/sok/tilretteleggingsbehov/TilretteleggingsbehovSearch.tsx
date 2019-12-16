import * as React from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';

import { SEARCH } from '../searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN
} from './tilretteleggingsbehovReducer';
import Infoikon from '../../../felles/common/ikoner/Infoikon';
import './Tilretteleggingsbehov.less';

interface TilretteleggingsbehovSearchProps {
    search: () => void;
    harTilretteleggingsbehov: boolean;
    toggleTilretteleggingsbehov: (harTilretteleggingsbehov: boolean) => void;
    panelOpen: boolean;
    togglePanelOpen: () => void;
}

const TilretteleggingsbehovSearch = (props: TilretteleggingsbehovSearchProps) => {
    const {
        search,
        toggleTilretteleggingsbehov,
        togglePanelOpen,
        panelOpen,
        harTilretteleggingsbehov
    } = props;

    const onTilretteleggingsbehovChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleTilretteleggingsbehov(event.target.checked);
        search();
    };

    return (
        <SokekriteriePanel
            id="Tilretteleggingsbehov__SokekriteriePanel"
            tittel="Tilretteleggingsbehov"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Checkbox
                className="skjemaelement--pink"
                id="tilretteleggingsbehov-checkbox"
                label="Vis kandidater med tilretteleggingsbehov"
                key="HAR_TILRETTELEGGINGSBEHOV"
                checked={harTilretteleggingsbehov}
                onChange={onTilretteleggingsbehovChange}
            />
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

const mapStateToProps = (state) => ({
    harTilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
    panelOpen: state.tilretteleggingsbehov.tilretteleggingsbehovPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    toggleTilretteleggingsbehov: (harTilretteleggingsbehov: boolean) =>
        dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV, harTilretteleggingsbehov }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TilretteleggingsbehovSearch);
